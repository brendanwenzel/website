//! Spawns `journalctl` in follow+JSON mode and feeds each line through the
//! sanitizer. If the child dies (or fails to spawn), respawns with exponential
//! backoff so the stream self-heals.

use std::process::Stdio;
use std::sync::Arc;
use std::time::{Duration, Instant};

use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

use crate::sanitizer;
use crate::state::AppState;

const BACKOFF_START: Duration = Duration::from_secs(1);
const BACKOFF_CAP: Duration = Duration::from_secs(30);
/// A run at least this long counts as stable and resets the backoff.
const STABLE_RUN: Duration = Duration::from_secs(60);

pub async fn run(state: Arc<AppState>, units: Vec<String>) {
    let mut backoff = BACKOFF_START;
    loop {
        let started = Instant::now();
        if let Err(e) = run_once(&state, &units).await {
            tracing::error!(error = %e, "journalctl pipeline failed");
        }
        if started.elapsed() >= STABLE_RUN {
            backoff = BACKOFF_START;
        }
        tracing::warn!(backoff_secs = backoff.as_secs(), "respawning journalctl");
        tokio::time::sleep(backoff).await;
        backoff = (backoff * 2).min(BACKOFF_CAP);
    }
}

async fn run_once(state: &AppState, units: &[String]) -> std::io::Result<()> {
    let mut cmd = Command::new("journalctl");
    // -n 0: never re-emit old entries on respawn, so the ring buffer gets no
    // duplicates. Trade-off: events during a crash window are lost — fine for
    // a status ticker (a --cursor-file would close the gap; see README).
    cmd.args(["-f", "-o", "json", "-n", "0"]);
    for unit in units {
        cmd.arg("-u").arg(unit);
    }
    let mut child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        // No orphaned journalctl when we shut down or this task is dropped.
        .kill_on_drop(true)
        .spawn()?;

    tracing::info!(?units, "journalctl started");

    let stdout = child.stdout.take().expect("stdout was piped");
    let mut lines = BufReader::new(stdout).lines();
    while let Some(line) = lines.next_line().await? {
        if let Some(ev) = sanitizer::sanitize(&line) {
            tracing::info!(event = ev.event_type, source = ev.source, "event published");
            state.publish(ev);
        }
        // Dropped lines are NOT logged: the raw line contains exactly the
        // sensitive data this service exists to withhold.
    }

    let status = child.wait().await?;
    tracing::warn!(?status, "journalctl exited");
    Ok(())
}
