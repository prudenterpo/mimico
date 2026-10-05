# Implementation inventory — Mimico

## Evidence baseline

This inventory was refreshed on 2026-10-05 after fetching both application
repositories. It records a point-in-time navigation baseline, not live status.
Always refresh `origin/develop` before relying on it.

| Repository | Baseline | Evidence |
|---|---|---|
| `api-mimico` | `474a2f0` on `origin/develop` | Table HTTP path, Postgres status, and invite host lookup, on top of authenticated match signaling. |
| `mimico-game` | `175822e` on `origin/develop` | “Restore paused matches from the server.” |

`origin/develop` is the implementation baseline. The 2026-10-04 four-browser
smoke described below used the table fixes before they were merged and an
unmerged frontend media branch. That smoke is evidence of a path that reached
the initial roll. It is not the current frontend baseline.

## Backend capabilities

Verified from `api-mimico@474a2f0`:

- registration, login, logout, authenticated profile;
- lobby presence and chat over WebSocket;
- table creation at `POST /api/tables` and table read at `GET /api/tables/{tableId}`,
  invitation decisions, membership, table chat, manual teams, explicit host
  start, and leave flow;
- Flyway V13: `game_tables.status` is `VARCHAR(32)` and accepts
  `TABLE_WAITING`, `TABLE_READY_TO_START`, `TABLE_IN_MATCH`,
  `TABLE_BETWEEN_MATCHES`, and `TABLE_CLOSED`;
- invite delivery reads the host nickname from `userRepository` inside the
  `TablePlayerService` transaction, so `TABLE_INVITE_RECEIVED` reaches the guest;
- persisted match, match player, match state, game round, and private word-card
  models through Flyway V12;
- initial representative selection and deterministic tie handling;
- authoritative dice, position, private card, word selection, guess eligibility,
  timeout, mime rotation, steal, natural win, abandonment, and forfeit;
- match and round state enums aligned with the current gameplay implementation;
- persisted pause metadata and 60-second reconnection behavior;
- deterministic dice, timer, and word-selection seams for tests;
- per-match command locking and retry support;
- state, private-card, and match-end event publication;
- authenticated match signaling (`OFFER`, `ANSWER`, `CANDIDATE`, `JOIN`,
  `LEAVE`) on `/app/match/{matchId}/signal`;
- mime media unavailable/available commands and `MIME_MEDIA_FAILED` pause.

The branch contains 116 JUnit `@Test` declarations. This count is navigation
evidence only; the suite result must be checked in CI or a clean compatible
environment before delivery.

## Frontend capabilities

Verified from `mimico-game@175822e`:

- registration, login, lobby, invitation, table, team assignment, and start UI;
- server-backed gameplay store and typed authoritative match state;
- initial roll, turn eligibility, dice, private word card, word selection, guess
  chat, board positions, round clock, finish, forfeit, and return-to-table flow;
- refresh recovery and paused-match restoration;
- reconnecting and paused UI states;
- responsive gameplay components for board, clock, and pause feedback.

The branch contains 38 frontend test declarations. As with the backend count,
this does not replace a clean test/build result.

Video UI is not on `origin/develop`. `src/lib/peer.ts` is an empty file there.
A separate media store, an `RTCPeerConnection` mesh over the existing STOMP
connection, permission and mime-media reporting, and game-page tiles exist on
`feature/frontend-media-session-462b` (`fdc5050`), one commit ahead of
`175822e`. Application code on that branch does not open a PeerJS socket. That
commit is not the frontend baseline.

## Integrated four-browser smoke (2026-10-04)

Four isolated Chromium profiles ran against PostgreSQL 16, Redis 7, a local
backend that contained the table fixes now on `474a2f0`, and the unmerged
frontend media branch.

What passed in that smoke:

- four users registered and logged in;
- the host saw the other three online and created one table;
- the three guests received the invite toast and accepted;
- the host assigned two players per team and started the match;
- all four browsers opened the same game URL;
- four labeled video tiles appeared with browser fake-camera streams;
- the host reached the initial-roll selector; guests waited for that choice.

What that smoke did not prove:

- a complete match through natural victory;
- normal guess, special steal, timeout, abandonment, rematch;
- disconnect and reconnect without closing the browsers;
- TURN, real cameras, or a repository-owned four-browser harness.

## Gaps confirmed by inspection and the smoke

### Video is not on the frontend baseline

- `mimico-game` `origin/develop` has an empty `src/lib/peer.ts` and no
  game-page media session.
- The backend signaling and mime-media pause contract is on `api-mimico`
  `origin/develop`. The consumer is not.
- Permission denial, ICE failure, cleanup, and media-driven pause are not
  proven on the merged frontend.

### Table HTTP contract is aligned

The 2026-10-04 PostgreSQL run failed on three producer defects that H2 tests
did not catch. Those fixes are on `api-mimico` `origin/develop` (`474a2f0`):

- `TableController` is mapped at `/api/tables`, which matches the frontend
  client (`NEXT_PUBLIC_API_URL` defaults to `http://localhost:8080/api`, and
  the store calls `/tables`);
- Flyway V13 widens `game_tables.status` and accepts the five `TABLE_*`
  lifecycle values;
- `sendInvite` reads the host nickname from `userRepository` inside the
  `TablePlayerService` transaction, so `TABLE_INVITE_RECEIVED` can be delivered.

A fresh four-browser run against this merged baseline has not been repeated.

### Integrated harness is still missing

- No repository Playwright (or equivalent) four-browser suite exists.
- Rematch with the same four clients is not proven.
- A Next.js runtime overlay (“1 issue”) appeared on table and game pages
  during the smoke and is unresolved.

### Release readiness is unproven

- Public deployment topology and environment promotion are not recorded.
- Production STUN/TURN behavior has not been tested.
- Health, metrics, structured logging, alerting, backup, and rollback are not
  proven as one deployed system.
- The frontend README is still the generic Next.js starter text, and application
  setup documentation is incomplete.

## Historical material disposition

The vault note `medium/massa-conteudo/mimico/especificacao.md` is useful
historical evidence. Its game rules informed the PRD, but it is not canonical:

- it mixes product requirements with implementation archaeology;
- it includes account confirmation and password recovery not accepted into the
  current V1;
- it describes automatic start and automatic team division in places, while the
  accepted product uses manual teams and explicit host start;
- its security deep dive describes an old implementation rather than a product
  behavior.

The removed root specs, contracts, tasks, prompts, handoffs, and execution logs
were also historical evidence. They were not referenced by either current
application and had already drifted from `origin/develop`.
