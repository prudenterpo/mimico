# Implementation inventory — Mimico

## Evidence baseline

This inventory was refreshed on 2026-10-04 after fetching both application
repositories and running one local PostgreSQL + Redis four-browser smoke. It
records a point-in-time navigation baseline, not live status. Always refresh
`origin/develop` before relying on it.

| Repository | Baseline | Evidence |
|---|---|---|
| `api-mimico` | `c7c845f` on `origin/develop` | “Add authenticated match signaling and mime media pause.” |
| `mimico-game` | `175822e` on `origin/develop` | “Restore paused matches from the server.” |

`origin/develop` is the implementation baseline. A later unmerged frontend
branch and local backend patches were used only for the integrated smoke
described below. They are not the current application baseline.

## Backend capabilities

Verified from `api-mimico@c7c845f`:

- registration, login, logout, authenticated profile;
- lobby presence and chat over WebSocket;
- table creation, invitation decisions, membership, table chat, manual teams,
  explicit host start, and leave flow;
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

The branch contains 111 JUnit `@Test` declarations. This count is navigation
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

Video UI is not on `origin/develop`. It exists on the unmerged frontend branch
`feature/frontend-media-session-462b` (`fdc5050`): a separate media store, an
`RTCPeerConnection` mesh over the existing STOMP connection, permission and
mime-media reporting, and game-page tiles. Application code on that branch does
not open a PeerJS socket.

## Integrated four-browser smoke (2026-10-04)

Four isolated Chromium profiles ran against PostgreSQL 16, Redis 7, the local
backend, and the unmerged frontend media branch.

What passed after local backend patches:

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

- `origin/develop` still has unused `src/lib/peer.ts` and no game-page media.
- The backend signaling contract is on `origin/develop`; the consumer is not.
- Permission denial, ICE failure, cleanup, and media-driven pause are not
  proven on the merged frontend.

### Producer defects block a real four-player table

A PostgreSQL run against current `origin/develop` code failed before invites
could be delivered. H2 tests did not catch these:

- `TableController` is mapped at `/tables` while the frontend calls
  `/api/tables`;
- `game_tables_status_check` still allows only `WAITING`, `IN_PROGRESS`, and
  `FINISHED`, so inserting `TABLE_WAITING` fails;
- `sendInvite` reads the lazy `GameTableEntity.host` after the persistence
  session closed, so Redis recorded pending invites but STOMP never delivered
  `TABLE_INVITE_RECEIVED`.

Those three fixes exist only as a local `api-mimico` branch
`feature/api-tables-path-075d`. They are not on `origin/develop`.

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
