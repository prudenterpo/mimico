# Implementation inventory — Mimico

## Evidence baseline

This inventory was refreshed on 2026-10-05 after fetching both application
repositories. It records a point-in-time navigation baseline, not live status.
Always refresh `origin/develop` before relying on it.

| Repository | Baseline | Evidence |
|---|---|---|
| `api-mimico` | `474a2f0` on `origin/develop` | Table HTTP path, Postgres status, and invite host lookup, on top of authenticated match signaling. |
| `mimico-game` | `5e783fd` on `origin/develop` | Four-client fake-camera Playwright smoke on top of authenticated match video. |

`origin/develop` is the implementation baseline. The repository now owns a
Playwright four-browser path through lobby, invite, teams, start, and four
fake-camera tiles. It is not a complete match.

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

Verified from `mimico-game@5e783fd`:

- registration, login, lobby, invitation, table, team assignment, and start UI;
- server-backed gameplay store and typed authoritative match state;
- initial roll, turn eligibility, dice, private word card, word selection, guess
  chat, board positions, round clock, finish, forfeit, and return-to-table flow;
- refresh recovery and paused-match restoration;
- reconnecting and paused UI states;
- responsive gameplay components for board, clock, and pause feedback;
- a separate media store and `RTCPeerConnection` mesh over the existing STOMP
  connection;
- permission, failed-media, mute, camera, and mime-primary tiles on the game
  page;
- mime-media unavailable/available reporting during guessing;
- local track stop on leave and on page unload.

Application code does not import PeerJS. The empty `src/lib/peer.ts` file is
gone. The `peerjs` package may still be listed as a dependency.

The branch contains 49 Vitest declarations plus `e2e/four-client-video.spec.ts`
(`npm run test:e2e`). The Vitest count does not replace the Playwright result.

## Integrated four-browser smoke (2026-10-04)

Four isolated Chromium profiles ran against PostgreSQL 16, Redis 7, a local
backend that contained the table fixes now on `474a2f0`, and a frontend media
branch that is now on `mimico-game` `origin/develop`.

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
- TURN or real cameras.

## Repository four-browser harness (2026-10-05)

`mimico-game` PR 9 is on `origin/develop` (`5e783fd`). Four isolated Chromium
contexts with `--use-fake-device-for-media-stream` run against `api-mimico`
`origin/develop`, PostgreSQL 16, and Redis 7. The dedicated workflow
`e2e-four-client.yml` had a green `four-client-video-smoke` on the PR.

What it proves, matching `e2e/README.md`:

- four browsers authenticate on one table;
- three guests receive `TABLE_INVITE_RECEIVED` and accept;
- the host assigns 2+2 and starts;
- all four open `/game/{tableId}`;
- each page shows four media tiles with a fake-camera stream.

What it still does not prove: sorteio, palpite, roubo, timeout, abandono,
vitória natural, rematch, disconnect/reconnect, mime-media pause in the
browser, TURN.

## Gaps confirmed by inspection and the smoke

### Video and the lobby-to-tiles harness are on the frontend baseline

- Producer and consumer agree on authenticated signaling and mime-media pause.
- Unit tests cover the mesh, permission denial, mime pause/resume, and the
  primary mime tile.
- Playwright covers lobby through four tiles. It does not close the
  workstream.

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

The repository harness now exercises that merged table contract.

### Remaining integrated gaps

- Rematch with the same four clients is not proven.
- Sorteio, a full round, timeout, abandonment, disconnect, and mime-media
  pause/resume are not in Playwright.
- TURN is unresolved.

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
