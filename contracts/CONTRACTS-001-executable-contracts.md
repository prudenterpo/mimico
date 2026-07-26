# CONTRACTS-001 - Executable Contracts

Status: Accepted  
Date: 2026-07-25

## Overview

This document defines the contract strategy for Mimico V1. Contracts exist so frontend, backend, tests, and AI agents share the same machine-verifiable API and event surface.

The domain model says what is true. Contracts say how systems exchange that truth.

## Why This Exists

Without executable contracts, agents can implement frontend and backend using plausible but different payload names, event names, statuses, and error shapes. That creates integration drift.

For Mimico V1, contracts must make drift visible before code reaches implementation or review.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `harness/HARNESS-001-agent-execution.md`

## Contract Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| REST OpenAPI | `contracts/openapi/mimico-v1.yaml` | Defines HTTP endpoints, request bodies, response bodies, and errors. |
| WebSocket AsyncAPI | `contracts/asyncapi/mimico-realtime-v1.yaml` | Defines STOMP/WebSocket commands, topics, queues, and event payloads. |
| JSON Schemas | `contracts/schemas/*.schema.json` | Defines shared payload and event shapes for validation and tests. |

## Contract Rules

- Contracts are canonical for new integration work.
- Existing backend/frontend code may differ temporarily, but mismatches must become tasks.
- New event names must come from `GLOSSARY-001`.
- New state values must come from `DOMAIN-001`.
- Public board positions use `0` for pre-board and `1..52` for board tiles.
- Errors use a stable object shape, not raw strings.
- Date/time fields use ISO-8601 strings.
- IDs use UUID strings.
- Team values are `A` or `B`.

## REST Surface

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Lobby

- `GET /api/lobby/online-users`

### Tables

- `POST /api/tables`
- `GET /api/tables/{tableId}`

### Matches

- `POST /api/matches/start`
- `GET /api/matches/table/{tableId}`
- `POST /api/matches/{matchId}/forfeit`

## WebSocket Surface

Transport target:

- STOMP over WebSocket

### Client Commands

- `/app/lobby/join`
- `/app/lobby/chat`
- `/app/table/invite`
- `/app/table/invite/accept`
- `/app/table/invite/reject`
- `/app/table/{tableId}/chat`
- `/app/table/teams/assign`
- `/app/table/match/start`
- `/app/table/leave`
- `/app/match/{matchId}/initial-turn/select`
- `/app/match/{matchId}/initial-turn/roll`
- `/app/match/{matchId}/dice/roll`
- `/app/match/{matchId}/word/draw`
- `/app/match/{matchId}/word/select`
- `/app/match/{matchId}/chat`
- `/app/match/abandon`

### Server Topics And Queues

- `/topic/lobby/users`
- `/topic/lobby/chat`
- `/topic/table/{tableId}/chat`
- `/topic/table/{tableId}/players`
- `/topic/table/{tableId}/teams`
- `/topic/table/{tableId}/match-started`
- `/topic/table/{tableId}/match-ended`
- `/topic/table/{tableId}/closed`
- `/topic/match/{matchId}/initial-turn`
- `/topic/match/{matchId}/state`
- `/topic/match/{matchId}/dice`
- `/topic/match/{matchId}/round`
- `/topic/match/{matchId}/chat`
- `/topic/match/{matchId}/correct-guess`
- `/topic/match/{matchId}/timeout`
- `/topic/match/{matchId}/paused`
- `/topic/match/{matchId}/resumed`
- `/user/queue/invite`
- `/user/queue/word-card`
- `/user/queue/game-state`
- `/user/queue/error`

## Shared Envelope Shapes

Server event envelope:

```json
{
  "type": "MATCH_STATE_UPDATED",
  "data": {},
  "occurredAt": "2026-07-25T18:00:00Z"
}
```

Error envelope:

```json
{
  "code": "MATCH_NOT_FOUND",
  "message": "Match not found.",
  "details": {},
  "correlationId": "optional-correlation-id"
}
```

## Current Executable Drafts

The initial contract files are intentionally incomplete but machine-shaped:

- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/error.schema.json`
- `contracts/schemas/team-assignment.schema.json`
- `contracts/schemas/match-state.schema.json`
- `contracts/schemas/realtime-event-envelope.schema.json`

They establish canonical naming before the detailed functional specs fill every endpoint and event.

## Known Code Mismatches

| Current Code Behavior | Contract Target |
| --- | --- |
| `StartMatchRequestDTO` accepts only `playerIds`. | `POST /matches/start` must accept explicit `teamAssignments`. |
| WebSocket uses `/sorteio` paths and event names. | New contract uses `/initial-turn` and `INITIAL_TURN_*` names. |
| Some errors are raw strings or `{ message }`. | Errors should use `ErrorResponse` shape with stable `code`. |
| Some events use `type` names not in glossary, such as `WORD_CARD` or `ROUND_TIMEOUT`. | Events should use canonical event names, such as `WORD_CARD_DRAWN` and `ROUND_TIMED_OUT`. |
| Match state uses `currentTurn`. | Contract uses `currentTeam`. |
| Table auto-starts from ready state in current service. | Contract requires explicit host `START_MATCH` after team assignment. |

## Contract Readiness Rules

- A functional spec can reference this document while it is Draft.
- Implementation tasks that touch integration require the relevant OpenAPI/AsyncAPI/schema section to be complete.
- Contract tests must validate against contract files, not prose.
- Any accepted contract change that affects both repos must create coordinated backend and frontend tasks.

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, functional specs, tests, and CI gates.

| ID | Decision |
| --- | --- |
| `CONTRACTS-AD-001` | All V1 server WebSocket events use the standard envelope `{ type, data, occurredAt }`. |
| `CONTRACTS-AD-002` | Public REST endpoints use `/api` as the base path. |
| `CONTRACTS-AD-003` | User-specific STOMP destinations are documented as logical `/user/queue/*` destinations. |
| `CONTRACTS-AD-004` | Legacy `/sorteio` paths are not part of the V1 contract; implementation should migrate to `/initial-turn`. |
