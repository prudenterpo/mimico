# CONTRACT-EXPANSION-BACKLOG-001 - Contract Readiness Gaps

Status: Draft
Date: 2026-07-26

## Purpose

This backlog identifies accepted contract gaps that must be resolved before Wave 2 through Wave 5 implementation tasks depend on them.

It does not implement backend or frontend behavior. It does not make architecture choices for video/WebRTC, reconnection persistence, generated clients, or multi-repo E2E.

## Source Documents

- `docs/TASK-GRAPH-001.md`
- `tasks/TASK-020.md`
- `test-first/TEST-FIRST-020.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/*.schema.json`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`

## Classification

- `ready-for-contract-edit`: accepted specs, glossary, and domain provide enough information to update OpenAPI, AsyncAPI, schemas, and samples.
- `requires-tech-design`: implementation-facing contract shape depends on an accepted Tech Design.
- `blocked-by-spec-conflict`: accepted artifacts disagree and need human/spec review before contract editing.

## Gap Backlog

| ID | Gap | Source References | Affected Contracts / Schemas | Classification | Blocks | Future Owner / Task |
| --- | --- | --- | --- | --- | --- | --- |
| `CONTRACT-GAP-001` | Table chat command and event are required but not present in AsyncAPI. Table chat must be separate from lobby chat and round guess chat. | `SPEC-002` Table Chat; `SPEC-004` Contract Usage and known code mismatches | `contracts/asyncapi/mimico-realtime-v1.yaml`; likely event envelope sample | `ready-for-contract-edit` | Wave 2 table setup, Wave 2 frontend table chat | Root contract edit before `TASK-130`/`TASK-140` |
| `CONTRACT-GAP-002` | Table close/cancel event naming is inconsistent: `SPEC-002` names `TABLE_CANCELLED`, while glossary/domain define the `TABLE_CLOSED` state and current contract prose lists `/topic/table/{tableId}/cancelled`. | `SPEC-002` WebSocket events; `GLOSSARY-001` Table States; `DOMAIN-001` Table State Machine; `CONTRACTS-001` WebSocket surface | `specs/GLOSSARY-001-glossary-and-invariants.md`; `contracts/asyncapi/mimico-realtime-v1.yaml`; possibly `contracts/CONTRACTS-001-executable-contracts.md` | `blocked-by-spec-conflict` | Wave 2 leave/close table implementation | Human/spec review before contract edit |
| `CONTRACT-GAP-003` | Gameplay event channels and payloads are incomplete for accepted `SPEC-003` events beyond `MATCH_STATE_UPDATED` and `GUESS_RECEIVED`. | `SPEC-003` WebSocket Contract Usage; `GLOSSARY-001` Canonical Events; `DOMAIN-001` Round Effects | `contracts/asyncapi/mimico-realtime-v1.yaml`; `contracts/schemas/match-state.schema.json`; event envelope samples | `ready-for-contract-edit` | Wave 3 backend gameplay and frontend gameplay UI | Root contract edit before `TASK-220`/`TASK-230` |
| `CONTRACT-GAP-004` | `MATCH_PAUSED` event needs a canonical schema including disconnected player identity, pause reason, reconnect deadline, and preserved timer context. | `SPEC-005-US-001`; `SPEC-005` Contract Usage; `DOMAIN-001` Reconnection Model | `contracts/asyncapi/mimico-realtime-v1.yaml`; `contracts/schemas/match-state.schema.json`; possibly new pause event schema; event envelope sample | `requires-tech-design` | Wave 4 reconnection backend/frontend | `TASK-310` first, then root contract edit before `TASK-320`/`TASK-330` |
| `CONTRACT-GAP-005` | `PLAYER_RECONNECTED` event needs a canonical schema and destination semantics. | `SPEC-005-US-002`; `SPEC-005` Contract Usage; `GLOSSARY-001` Canonical Events | `contracts/asyncapi/mimico-realtime-v1.yaml`; possible reconnect event schema; event envelope sample | `requires-tech-design` | Wave 4 reconnection backend/frontend | `TASK-310` first, then root contract edit before `TASK-320`/`TASK-330` |
| `CONTRACT-GAP-006` | Restored state user event is named in `SPEC-005` as `MATCH_STATE_RESTORED`, but `GLOSSARY-001` does not list that canonical event. The current contract only has logical `/user/queue/game-state`. | `SPEC-005` Contract Usage; `GLOSSARY-001` Canonical Events; `CONTRACTS-001` Server Topics and Queues | `specs/GLOSSARY-001-glossary-and-invariants.md`; `contracts/asyncapi/mimico-realtime-v1.yaml`; `contracts/schemas/match-state.schema.json` | `blocked-by-spec-conflict` | Wave 4 refresh recovery | Human/spec review before contract edit |
| `CONTRACT-GAP-007` | `match-state.schema.json` has only singular `disconnectedUserId`, while `SPEC-005-AD-002` requires tracking multiple disconnected players. | `SPEC-005-AD-002`; `SPEC-005` State Requirements; `DOMAIN-001` Reconnection Model | `contracts/schemas/match-state.schema.json`; samples; AsyncAPI pause/state events | `requires-tech-design` | Wave 4 reconnection fairness | `TASK-310` first, then root contract edit |
| `CONTRACT-GAP-008` | Reconnect deadline and pause reason are required by `SPEC-005`, but `match-state.schema.json` does not yet expose `reconnectDeadline` or `pauseReason`. | `SPEC-005-US-001`; `SPEC-005` State Requirements; `DOMAIN-001` MatchState required attributes | `contracts/schemas/match-state.schema.json`; pause event schema; samples | `requires-tech-design` | Wave 4 paused/reconnecting UI and backend pause state | `TASK-310` first, then root contract edit |
| `CONTRACT-GAP-009` | `remainingRoundSecondsOnPause` exists in schema, but pause/resume event payload expectations and timer resume fields are not fully specified. | `SPEC-005` Disconnect/Reconnect flows; `DOMAIN-001` Reconnection Model | `contracts/schemas/match-state.schema.json`; AsyncAPI pause/resume/state events; samples | `requires-tech-design` | Wave 4 timer fairness | `TASK-310` first, then root contract edit |
| `CONTRACT-GAP-010` | `RECONNECTION_FORFEIT` exists in OpenAPI `MatchEnded`, but AsyncAPI match-ended/forfeit event schema is missing. | `SPEC-005-US-003`; `SPEC-005` Contract Testing Requirements; `contracts/openapi/mimico-v1.yaml` | `contracts/asyncapi/mimico-realtime-v1.yaml`; possible match-ended event schema/sample | `ready-for-contract-edit` | Wave 4 reconnection timeout UI/backend event tests | Root contract edit before `TASK-320`/`TASK-330` |
| `CONTRACT-GAP-011` | Media readiness event is required by `SPEC-004`, but final event names, destinations, and payloads are not in AsyncAPI. | `SPEC-004-US-006`; `SPEC-004` Contract Usage; `SPEC-006` table setup media readiness UX | `contracts/asyncapi/mimico-realtime-v1.yaml`; possible media readiness schema | `requires-tech-design` | Wave 5 video/media readiness | `TASK-410` first, then `TASK-420` |
| `CONTRACT-GAP-012` | Video signaling events are required for real media implementation, but architecture and provider strategy are intentionally undecided. | `SPEC-004` Out of Scope and Contract Usage; `SPEC-004-AD-004`; `TASK-GRAPH-001` Wave 5 | `contracts/asyncapi/mimico-realtime-v1.yaml`; future signaling schemas | `requires-tech-design` | Wave 5 video/WebRTC implementation | `TASK-410`, then `TASK-420` |
| `CONTRACT-GAP-013` | Media failure pause reason `MIME_MEDIA_FAILED` is accepted, but server-mediated media failure command/event and pause payload are not contracted. | `SPEC-005-US-006`; `SPEC-005` Allowed pause reasons; `SPEC-004-AD-002` | `contracts/asyncapi/mimico-realtime-v1.yaml`; pause event schema; `match-state.schema.json` | `requires-tech-design` | Wave 5 media failure recovery, Wave 4 pause model if shared | `TASK-410` plus `TASK-310` alignment before `TASK-420` |

## Blocking Summary By Wave

### Wave 2 - Auth, Lobby, Table Setup

Blocking gaps:

- `CONTRACT-GAP-001`
- `CONTRACT-GAP-002`

Readiness:

- Table chat is ready for contract edit.
- Table cancelled/closed naming needs human/spec review first.

### Wave 3 - Core Gameplay

Blocking gaps:

- `CONTRACT-GAP-003`

Readiness:

- Gameplay event expansion is ready for contract edit, provided it uses existing glossary/domain names.

### Wave 4 - Reconnection And Recovery

Blocking gaps:

- `CONTRACT-GAP-004`
- `CONTRACT-GAP-005`
- `CONTRACT-GAP-006`
- `CONTRACT-GAP-007`
- `CONTRACT-GAP-008`
- `CONTRACT-GAP-009`
- `CONTRACT-GAP-010`

Readiness:

- Match-ended forfeit event can be contract-edited from accepted specs.
- Pause/reconnect persistence and timer fields should wait for `TASK-310`.
- Restored state event naming needs glossary/spec review.

### Wave 5 - Video, Media, And Chat Completion

Blocking gaps:

- `CONTRACT-GAP-011`
- `CONTRACT-GAP-012`
- `CONTRACT-GAP-013`

Readiness:

- Video signaling and media readiness must wait for `TASK-410`.
- Media failure pause must align with both `TASK-310` and `TASK-410`.

## Recommended Next Contract Work

1. Resolve `CONTRACT-GAP-002` and `CONTRACT-GAP-006` with human/spec review because they involve naming conflicts.
2. Create a focused contract edit task for Wave 2 table chat after `CONTRACT-GAP-002` is resolved or explicitly deferred.
3. Keep reconnection schema edits blocked until `TASK-310` is accepted.
4. Keep media readiness and video signaling blocked until `TASK-410` is accepted.

## Verification

This backlog was reviewed against the accepted specs and contracts. If contract files are edited later, run:

```bash
npm run contracts:validate
```
