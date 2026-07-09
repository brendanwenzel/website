//! Telemetry SSE backend: tails journald for the production pipeline units,
//! sanitizes events through a strict allowlist (src/sanitizer.rs — the
//! security boundary), and streams them to browsers over SSE.

mod journal;
mod sanitizer;
mod state;

use std::convert::Infallible;
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

use axum::extract::State;
use axum::http::{HeaderValue, Method};
use axum::response::sse::{Event, KeepAlive, Sse};
use axum::routing::get;
use axum::Router;
use tokio_stream::wrappers::errors::BroadcastStreamRecvError;
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::{Stream, StreamExt};
use tower_http::cors::CorsLayer;

use crate::state::AppState;

struct Config {
    units: Vec<String>,
    bind_addr: SocketAddr,
    buffer_size: usize,
    allowed_origin: HeaderValue,
}

impl Config {
    /// All parse failures are fatal: a misconfigured deploy must fail loudly
    /// at startup, never fall back to something permissive.
    fn from_env() -> Config {
        let units = std::env::var("UNITS")
            .unwrap_or_else(|_| "capi-bridge,spend-sheets,sample-automation".into())
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>();
        if units.is_empty() {
            fail("UNITS is set but empty");
        }

        let bind_addr = std::env::var("BIND_ADDR")
            .unwrap_or_else(|_| "127.0.0.1:8088".into())
            .parse()
            .unwrap_or_else(|e| fail(&format!("BIND_ADDR unparseable: {e}")));

        let buffer_size = std::env::var("BUFFER_SIZE")
            .unwrap_or_else(|_| "50".into())
            .parse()
            .unwrap_or_else(|e| fail(&format!("BUFFER_SIZE unparseable: {e}")));

        // Required — the CORS policy must be an explicit deploy-time decision.
        let allowed_origin = std::env::var("ALLOWED_ORIGIN")
            .unwrap_or_else(|_| {
                fail("ALLOWED_ORIGIN is required (e.g. https://www.brendanwenzel.com, or http://localhost:8000 for local dev)")
            })
            .parse()
            .unwrap_or_else(|e| fail(&format!("ALLOWED_ORIGIN is not a valid header value: {e}")));

        Config { units, bind_addr, buffer_size, allowed_origin }
    }
}

fn fail(msg: &str) -> ! {
    eprintln!("config error: {msg}");
    std::process::exit(1);
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "telemetry_backend=info".into()),
        )
        .init();

    let config = Config::from_env();
    let state = Arc::new(AppState::new(config.buffer_size));

    tokio::spawn(journal::run(state.clone(), config.units.clone()));

    // Exact single origin, never a wildcard. EventSource sends no custom
    // headers, so there is no preflight; the browser only checks
    // Access-Control-Allow-Origin on the response.
    let cors = CorsLayer::new()
        .allow_origin(config.allowed_origin.clone())
        .allow_methods([Method::GET]);

    let app = Router::new()
        .route("/events", get(sse_handler))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind(config.bind_addr)
        .await
        .unwrap_or_else(|e| fail(&format!("cannot bind {}: {e}", config.bind_addr)));
    tracing::info!(addr = %config.bind_addr, origin = ?config.allowed_origin, "listening");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("server error");
}

async fn sse_handler(
    State(state): State<Arc<AppState>>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    // Snapshot + subscribe are atomic w.r.t. publish (see state.rs), so the
    // replay-then-live chain has no gap and no duplicate.
    let (snapshot, rx) = state.snapshot_and_subscribe();

    let replay = tokio_stream::iter(snapshot);
    let live = BroadcastStream::new(rx).filter_map(|item| match item {
        Ok(ev) => Some(ev),
        Err(BroadcastStreamRecvError::Lagged(missed)) => {
            // A client that fell >256 events behind skips the gap and keeps
            // streaming; these are ephemeral status blips, not a ledger.
            tracing::warn!(missed, "sse client lagged; skipping");
            None
        }
    });

    let stream = replay.chain(live).map(|ev| {
        Ok(Event::default()
            .json_data(&ev)
            .expect("SanitizedEvent serialization cannot fail"))
    });

    // 15s comment frames: safely under the 30-60s idle timeouts common to
    // mobile NATs and corporate proxies. (Caddy itself doesn't buffer SSE.)
    Sse::new(stream).keep_alive(
        KeepAlive::new()
            .interval(Duration::from_secs(15))
            .text("keep-alive"),
    )
}

/// SIGINT (^C locally) or SIGTERM (systemctl stop/restart). Graceful shutdown
/// closes client connections cleanly, and dropping the runtime reaps the
/// journalctl child via kill_on_drop.
async fn shutdown_signal() {
    use tokio::signal::unix::{signal, SignalKind};
    let mut sigterm = signal(SignalKind::terminate()).expect("install SIGTERM handler");
    tokio::select! {
        _ = tokio::signal::ctrl_c() => {},
        _ = sigterm.recv() => {},
    }
    tracing::info!("shutdown signal received");
}
