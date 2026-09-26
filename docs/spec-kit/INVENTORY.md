# Implementation inventory — Mimico

## Evidence baseline

This inventory was refreshed on 2026-09-26 after fetching both application
repositories. It records a point-in-time navigation baseline, not live status.
Always refresh `origin/develop` before relying on it.

| Repository | Baseline | Evidence |
|---|---|---|
| `api-mimico` | `0514c42` on `origin/develop` | “Implement Wave 3 gameplay state machine.” |
| `mimico-game` | `175822e` on `origin/develop` | “Restore paused matches from the server.” |

The nested local checkouts were behind these refs and were not used as the
current implementation source.

## Backend capabilities

Verified from `api-mimico@0514c42`:

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
- state, private-card, and match-end event publication.

The branch contains 97 JUnit `@Test` declarations. This count is navigation
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

## Gaps confirmed by code inspection

### Video is not implemented end to end

- `src/lib/peer.ts` exists in the frontend but has no consumer in the current
  gameplay flow.
- The backend has no WebRTC signaling command, topic, or service.
- The gameplay page does not render real local or remote media streams.
- Permission denial, peer failure, ICE failure, cleanup, and media-driven pause
  are not proven.

### Integrated proof is missing

- No four-browser E2E harness proves a complete match.
- Backend and frontend tests do not by themselves prove STOMP destination and
  payload compatibility in a running environment.
- Rematch presentation exists, but a complete second match with the same four
  clients is not proven.
- PostgreSQL migration and gameplay concurrency require a production-shaped
  integration check; H2-based context tests are insufficient evidence.

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
