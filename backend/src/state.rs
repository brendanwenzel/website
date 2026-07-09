//! Shared state: ring buffer of recent events + broadcast fan-out.

use std::collections::VecDeque;
use std::sync::Mutex;

use tokio::sync::broadcast;

use crate::sanitizer::SanitizedEvent;

/// Broadcast capacity is deliberately independent of the replay buffer size:
/// it only needs to absorb how far a slow client may fall behind before we
/// accept a `Lagged` skip.
const BROADCAST_CAPACITY: usize = 256;

pub struct AppState {
    // std Mutex, not tokio: it is never held across an .await, and both
    // critical sections below are microseconds.
    buffer: Mutex<VecDeque<SanitizedEvent>>,
    tx: broadcast::Sender<SanitizedEvent>,
    buffer_size: usize,
}

impl AppState {
    pub fn new(buffer_size: usize) -> Self {
        let (tx, _) = broadcast::channel(BROADCAST_CAPACITY);
        Self {
            buffer: Mutex::new(VecDeque::with_capacity(buffer_size)),
            tx,
            buffer_size,
        }
    }

    /// Called only by the journal task. Buffer push and broadcast send happen
    /// under the same lock — see `snapshot_and_subscribe` for why.
    pub fn publish(&self, ev: SanitizedEvent) {
        let mut buf = self.buffer.lock().unwrap();
        if buf.len() == self.buffer_size {
            buf.pop_front();
        }
        buf.push_back(ev.clone());
        // Err just means there are currently zero subscribers.
        let _ = self.tx.send(ev);
    }

    /// Called by the SSE handler on client connect.
    ///
    /// Cloning the buffer and subscribing happen under the same lock that
    /// `publish` holds for push+send, so for any connecting client the replay
    /// snapshot and the live receiver partition the publish sequence exactly:
    /// no event is missed between snapshot and subscribe, and none appears in
    /// both.
    pub fn snapshot_and_subscribe(
        &self,
    ) -> (Vec<SanitizedEvent>, broadcast::Receiver<SanitizedEvent>) {
        let buf = self.buffer.lock().unwrap();
        let snapshot = buf.iter().cloned().collect();
        let rx = self.tx.subscribe();
        (snapshot, rx)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ring_buffer_keeps_last_n_in_order() {
        let state = AppState::new(50);
        for i in 0..60 {
            state.publish(SanitizedEvent {
                event_type: "Purchase Captured",
                source: "CAPI Bridge",
                timestamp: format!("t{i}"),
            });
        }
        let (snapshot, _rx) = state.snapshot_and_subscribe();
        assert_eq!(snapshot.len(), 50);
        assert_eq!(snapshot.first().unwrap().timestamp, "t10");
        assert_eq!(snapshot.last().unwrap().timestamp, "t59");
    }
}
