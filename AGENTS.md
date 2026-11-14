# website (brendanwenzel.com)

Brendan's personal site. `README.md` has the design and current status. Read it first.

- Only `frontend/` (Next.js) is live. It is on Vercel, personal team `brendanw`, project
  `website`, and is not git-connected: deploy with
  `cd frontend && vercel deploy --prod --yes` after `npm run build` and `npm run lint` pass.
- The site runs in mock telemetry mode on purpose (`NEXT_PUBLIC_TELEMETRY_URL` unset, the
  ticker says "simulated"). Do not wire it to live data without a decision from Brendan.
- `backend/` (Rust) is archived and was never deployed. Do not build on it or deploy it.
- `brendanwenzel.org` is a different domain (OAuth consent pages, Grafana) and is not
  this repo.
