//! SECURITY BOUNDARY — allowlist-only, default-deny.
//!
//! Raw journald lines contain order IDs, dollar amounts, brand names, and
//! customer emails. None of that may ever reach a client. The rules:
//!
//! 1. The ONLY data that leaves [`sanitize`] is built from the two const
//!    tables below plus a timestamp reformatted from `__REALTIME_TIMESTAMP`.
//! 2. Output is CONSTRUCTED, never copied through. `event_type` and `source`
//!    are `&'static str`, so it is a type-level guarantee that they can only
//!    be values from the tables — a runtime string from the journal does not
//!    fit in those fields.
//! 3. Every fallible step is a `?`: anything unexpected drops the line.
//! 4. `MESSAGE` is read in exactly one place, and only to extract a leading
//!    `EVENT=<token>` word. It is never stored, forwarded, or logged.

/// Recognized event tokens -> public display labels.
///
/// The emitting services log lines that BEGIN with `EVENT=<token>`, e.g.
/// `EVENT=purchase_captured order=ORD-8842 amount=$149.99`. Only the token is
/// read; everything after the first whitespace is ignored. Add a row here to
/// allow a new event type — nothing else ever passes.
const EVENT_LABELS: &[(&str, &str)] = &[
    ("purchase_captured", "Purchase Captured"),
    ("event_relayed", "Event Relayed"),
    ("spend_synced", "Spend Synced"),
    ("row_updated", "Row Updated"),
    ("sample_requested", "Sample Requested"),
    ("sample_shipped", "Sample Shipped"),
];

/// Recognized `_SYSTEMD_UNIT` values -> public source names.
/// Note: journald reports the full unit name including the `.service` suffix,
/// while the UNITS env var (used for the journalctl -u flags) omits it.
const UNIT_NAMES: &[(&str, &str)] = &[
    ("capi-bridge.service", "CAPI Bridge"),
    ("spend-sheets.service", "Spend → Sheets"),
    ("sample-automation.service", "Sample Automation"),
];

/// The single interface with the frontend. Mirrored in
/// `frontend/lib/telemetry-types.ts`; the exact serialized shape is pinned by
/// the `no_pii_leaks` test below.
#[derive(Clone, Debug, serde::Serialize)]
pub struct SanitizedEvent {
    pub event_type: &'static str,
    pub source: &'static str,
    pub timestamp: String,
}

/// Transform one raw journald JSON line into a display-safe event, or drop it.
/// Every `?` is a default-deny.
pub fn sanitize(raw_line: &str) -> Option<SanitizedEvent> {
    let v: serde_json::Value = serde_json::from_str(raw_line).ok()?;

    // MESSAGE must be a JSON string. journald encodes non-UTF-8 payloads as an
    // array of byte values; as_str() returns None for those -> dropped.
    let msg = v.get("MESSAGE")?.as_str()?;

    // Structured token only: must lead the message, exact word, exact table
    // match. Prose that merely mentions a token does not pass.
    let token = msg.strip_prefix("EVENT=")?.split_whitespace().next()?;
    let event_type = lookup(EVENT_LABELS, token)?;

    let unit = v.get("_SYSTEMD_UNIT")?.as_str()?;
    let source = lookup(UNIT_NAMES, unit)?;

    // __REALTIME_TIMESTAMP is a decimal string of microseconds since epoch.
    let micros: i64 = v.get("__REALTIME_TIMESTAMP")?.as_str()?.parse().ok()?;
    let timestamp = chrono::DateTime::<chrono::Utc>::from_timestamp_micros(micros)?
        .to_rfc3339_opts(chrono::SecondsFormat::Secs, true);

    Some(SanitizedEvent { event_type, source, timestamp })
}

fn lookup(table: &[(&str, &'static str)], key: &str) -> Option<&'static str> {
    table.iter().find(|(k, _)| *k == key).map(|(_, v)| *v)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 2026-06-25T18:00:00Z in microseconds since epoch.
    const TS_MICROS: &str = "1782410400000000";

    fn journald_line(message: &str, unit: &str, ts: &str) -> String {
        serde_json::json!({
            "MESSAGE": message,
            "_SYSTEMD_UNIT": unit,
            "__REALTIME_TIMESTAMP": ts,
            // Fields a real journald line carries that must never leak:
            "_CMDLINE": "/usr/local/bin/capi-bridge --token=SECRET",
            "_HOSTNAME": "prod-hetzner-1",
        })
        .to_string()
    }

    /// The mandated test: a line containing a dollar amount AND a brand name
    /// (plus an order ID and email for good measure) produces output in which
    /// none of those strings appear anywhere.
    #[test]
    fn no_pii_leaks() {
        let line = journald_line(
            "EVENT=purchase_captured order=ORD-8842 amount=$149.99 brand=\"Acme Corp\" email=jane@example.com",
            "capi-bridge.service",
            TS_MICROS,
        );
        let ev = sanitize(&line).expect("recognized event must pass");
        let out = serde_json::to_string(&ev).unwrap();

        for secret in ["149.99", "$", "Acme", "ORD-8842", "jane", "example.com", "SECRET", "prod-hetzner-1"] {
            assert!(!out.contains(secret), "leaked {secret:?} in {out}");
        }
        // Pin the exact contract shape shared with the frontend.
        assert_eq!(
            out,
            r#"{"event_type":"Purchase Captured","source":"CAPI Bridge","timestamp":"2026-06-25T18:00:00Z"}"#
        );
    }

    #[test]
    fn default_deny_unknown_token() {
        let line = journald_line("EVENT=totally_new_thing foo", "capi-bridge.service", TS_MICROS);
        assert!(sanitize(&line).is_none());
    }

    /// A known token mentioned in prose (no leading EVENT=) must NOT match —
    /// proves we never substring-match free text.
    #[test]
    fn default_deny_prose() {
        let line = journald_line(
            "Processed purchase_captured for Acme Corp ($149.99)",
            "capi-bridge.service",
            TS_MICROS,
        );
        assert!(sanitize(&line).is_none());
    }

    #[test]
    fn default_deny_unknown_unit() {
        let line = journald_line("EVENT=purchase_captured", "sshd.service", TS_MICROS);
        assert!(sanitize(&line).is_none());
    }

    /// journald encodes non-UTF-8 MESSAGE payloads as a byte array.
    #[test]
    fn drops_non_utf8_message() {
        let line = format!(
            r#"{{"MESSAGE":[69,86,69,78,84],"_SYSTEMD_UNIT":"capi-bridge.service","__REALTIME_TIMESTAMP":"{TS_MICROS}"}}"#
        );
        assert!(sanitize(&line).is_none());
    }

    #[test]
    fn timestamp_conversion() {
        let line = journald_line("EVENT=spend_synced", "spend-sheets.service", TS_MICROS);
        let ev = sanitize(&line).unwrap();
        assert_eq!(ev.timestamp, "2026-06-25T18:00:00Z");
        assert_eq!(ev.source, "Spend → Sheets");

        let bad = journald_line("EVENT=spend_synced", "spend-sheets.service", "garbage");
        assert!(sanitize(&bad).is_none());

        let missing = r#"{"MESSAGE":"EVENT=spend_synced","_SYSTEMD_UNIT":"spend-sheets.service"}"#;
        assert!(sanitize(missing).is_none());
    }

    #[test]
    fn drops_unparseable_line() {
        assert!(sanitize("not json at all").is_none());
        assert!(sanitize("").is_none());
    }
}
