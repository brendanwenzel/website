import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

/**
 * OAuth callback relay. Platform apps (TikTok Shop / Meta / Google) redirect
 * to this site with `?code=...` on whatever path their redirect URI points
 * at; this forwards the code to the webhook server-side and cleans the URL.
 *
 * Replaces the old Docusaurus Root.tsx relay with two fixes:
 *  - the webhook secret stays server-side (the old site inlined it into the
 *    client JS bundle via customFields — it was public);
 *  - the code is stripped from the URL afterwards, so a refresh can't
 *    double-fire and the code stays out of history/analytics.
 *
 * Matches every route (same public contract as before — redirect URIs may
 * point anywhere, changing them at the platforms is a coordination step we
 * avoid). Requests without ?code= early-return at ~zero cost; matchers can't
 * filter on query strings.
 *
 * Next 16 note: middleware.ts is renamed proxy.ts there; on Next 15 this
 * filename is correct.
 */
export function middleware(req: NextRequest, event: NextFetchEvent) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.next();

  const webhookUrl = process.env.OAUTH_WEBHOOK_URL;
  const secret = process.env.OAUTH_WEBHOOK_SECRET;

  if (webhookUrl && secret) {
    const target = new URL(webhookUrl);
    target.searchParams.set('code', code);
    const state = req.nextUrl.searchParams.get('state');
    if (state) target.searchParams.set('state', state); // old relay dropped state; forward it

    event.waitUntil(
      fetch(target, {
        method: 'POST',
        // Header name matches the existing webhook receiver.
        headers: { Secret: secret, 'Content-Type': 'application/json' },
      }).catch(() => {
        // Never break a visitor's navigation over a webhook failure.
      }),
    );
  }

  const clean = req.nextUrl.clone();
  clean.searchParams.delete('code');
  clean.searchParams.delete('state');
  return NextResponse.redirect(clean);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico|css|js|txt|xml)).*)'],
};
