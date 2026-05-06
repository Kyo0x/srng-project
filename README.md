# SRNG Base App

Baseline Next.js setup for srng.no with a DSBot control plane.

## Architecture split

- Neon Postgres (cloud): dashboard auth, guild links, bot settings, command queue, bot status/events.
- Pi local DB (MySQL or similar): bot runtime-local data and high-frequency internal state.

This keeps srng.no as the source of truth for remote control while your bot stays resilient on home network.

## Routing model

- app/page.tsx: root page for srng.no (under construction)
- app/[service]/dashboard/page.tsx: service dashboards like /dsbot/dashboard
- app/s/[subdomain]/...: internal routes used by host rewrites

## Subdomain handling

proxy.ts rewrites requests from subdomains into internal app routes:

- deltabot.srng.no -> /s/deltabot
- deltabot.srng.no/settings -> /s/deltabot/settings

For local development, it also supports hosts like:

- deltabot.localhost:3000

## DSBot implementation status

Implemented:

- Discord login flow (Auth.js)
- Protected DSBot dashboard shell at /dsbot/dashboard
- Guild linking endpoint with Discord admin/manage permission checks
- Settings persistence in Postgres
- Bot command queue + heartbeat endpoints for Pi outbound connectivity

## Environment

Copy .env.example to .env.local and fill values.

Required keys:

- DATABASE_URL (Neon Postgres)
- AUTH_SECRET
- AUTH_DISCORD_ID
- AUTH_DISCORD_SECRET
- DSBOT_BOT_ID
- DSBOT_SHARED_SECRET

## Development

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npm run db:generate
```

3. Push schema to Neon dev database:

```bash
npm run db:push
```

4. Run local app:

```bash
npm run dev
```

## Pi connectivity contract

Pi sends signed requests to these endpoints:

- POST /api/dsbot/bot/heartbeat
- POST /api/dsbot/bot/commands/poll
- POST /api/dsbot/bot/commands/result

Headers required:

- x-srng-bot-id
- x-srng-timestamp
- x-srng-nonce
- x-srng-signature

Signature: HMAC-SHA256 over timestamp.nonce.body with DSBOT_SHARED_SECRET.
