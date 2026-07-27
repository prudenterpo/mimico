# TASK-130 - Backend Table, Invites, Manual Teams, and Explicit Start

Status: Draft for Approval
Target repo: backend `api-mimico`
Autonomy level: Level 1 - Single Task

## Agent Entry Instructions

Execute this task file directly. Before editing files, read and follow `harness/AGENT-ENTRY-INSTRUCTIONS.md`.

## Objective

Implement the backend table setup path for Mimico V1: private table creation, invites, accepted/rejected/expired invite state, table chat, manual team assignment, table readiness, explicit host match start, and pre-match table close/leave behavior.

This task must produce canonical table and match-start state for later gameplay tasks.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Completed Wave 1, including `TASK-010`, `TASK-020`, and `TASK-030`
- Completed or locally available `TASK-110`
- `CONTRACT-GAP-001` and `CONTRACT-GAP-002` resolved in local commit `affa173`

## Source Documents

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/error.schema.json`
- `contracts/schemas/team-assignment.schema.json`
- `contracts/schemas/realtime-event-envelope.schema.json`
- `docs/CONTRACT-EXPANSION-BACKLOG-001.md`
- `specs/SPEC-001-auth-lobby.md`, for invite reception dependency
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-004-video-chat.md`, only for chat-context separation
- `specs/SPEC-007-deploy-observability.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `tasks/TASK-110.md`

## Scope

- Implement or align `POST /api/tables`.
- Implement or align `GET /api/tables/{tableId}`.
- Implement or align `POST /api/matches/start` with explicit `teamAssignments`.
- Generate canonical authoritative `tableId` on the backend.
- Add host as the first accepted table player.
- Validate table name length and required value.
- Implement invite sending through `/app/table/invite`.
- Validate host-only invite sending, no self-invite, no offline invite, no duplicate invite, and V1 maximum of 3 invited users.
- Expire invites after 60 seconds.
- Implement invite accept and reject commands.
- Broadcast `TABLE_INVITE_RECEIVED`, `TABLE_PLAYERS_UPDATED`, `TABLE_TEAMS_UPDATED`, `TABLE_MESSAGE_POSTED`, `MATCH_STARTED`, and `TABLE_CLOSED` through the canonical envelope.
- Implement table chat through `/app/table/{tableId}/chat`.
- Restrict table chat to accepted table players.
- Validate manual team assignment through `/app/table/teams/assign`.
- Derive `TABLE_READY_TO_START` only when exactly 4 players are accepted and teams are valid.
- Require host-only explicit start through `/app/table/match/start` or `POST /api/matches/start`, following the accepted contract.
- Create a new `Match` and match-player team snapshot on successful start.
- Move table to `TABLE_IN_MATCH` and notify all table players.
- Implement leave/close behavior before match start, including host close for V1.
- Add backend tests defined by `TEST-FIRST-130` once that pack is approved.

## Out Of Scope

- Frontend table setup implementation.
- Initial turn selection, dice, word selection, guessing, timers, board movement, win handling, or rematch gameplay.
- Video/WebRTC, media readiness, active-match reconnection, or deploy provider work.
- Public tables, guest users, host transfer, matchmaking, or long-term chat persistence.
- Generated API clients or generated shared types.
- Weakening accepted table/team/match invariants.

## Acceptance Criteria

- `POST /api/tables` creates a private table with backend-generated `tableId`.
- Host is accepted automatically and cannot be invited.
- Host can invite exactly 3 other online users for V1.
- Invalid invite cases return canonical errors.
- Invite expiration is enforced at 60 seconds.
- Accepting a valid invite adds the user to the table and broadcasts updated player state.
- Rejecting an invite marks the invite rejected and broadcasts updated state.
- Table chat accepts only authenticated accepted table players.
- Table chat messages are capped at 500 characters and use `TABLE_MESSAGE_POSTED`.
- Manual team assignment enforces exactly 2 players on Team A and 2 players on Team B.
- Duplicate, missing, non-table, or wrong-size team assignments fail with canonical errors.
- Non-host users cannot assign teams or start matches.
- Table becomes `TABLE_READY_TO_START` only with exactly 4 accepted players and valid teams.
- Explicit host start creates a `Match` from the table and explicit team assignment.
- `MATCH_STARTED` is published to all table players.
- Host leave before match start closes the table and publishes `TABLE_CLOSED`.
- Backend tests cover the approved `TEST-FIRST-130` behaviors.
- Root contracts still validate.

## Required Tests

This task will later receive `TEST-FIRST-130`.

Required coverage intent:

- create table validation and host membership
- invite offline/self/duplicate/too-many cases
- invite expiration, accept, and reject behavior
- table player status broadcasts
- table chat authorization and validation
- manual team assignment valid and invalid cases
- derived table readiness
- non-host cannot assign teams or start match
- explicit start creates match players with Team A/Team B snapshots
- table close/leave behavior before match start
- relevant REST and WebSocket payloads match contracts

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`:

```bash
./mvnw test
```

Run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

If backend CI was created by `TASK-030`, verify the same backend command used by CI.

## Allowed Files Or Areas

- `api-mimico/pom.xml`, only for test dependency/profile adjustments needed by this task
- `api-mimico/src/main/java/`, limited to table, invite, team assignment, match-start, WebSocket, DTO, service, repository, domain mapping, and error handling needed for this scope
- `api-mimico/src/main/resources/`, only for test-safe or table/match-start configuration
- `api-mimico/src/test/`, limited to tests and fixtures for this scope
- `api-mimico/README.md` or backend-local docs, only for verification notes

## Stop Conditions

Stop and ask for review if:

- match state persistence strategy beyond match-start snapshot is required
- `POST /api/matches/start` contract conflicts with existing backend model in a way that needs a Tech Design
- new event names, table states, invite statuses, or team values are needed
- generated clients/types become necessary
- table changes require frontend changes in the same PR
- active-match reconnection or gameplay behavior becomes necessary
- root contracts need to change beyond accepted `CONTRACT-GAP-001/002` resolution


## Expected Commit / PR Notes

- Commit from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`.
- Suggested branch: `feature/task-130-backend-table-setup`.
- PR should mention `SPEC-002`, list backend and root contract verification commands, and call out that gameplay beyond match creation is not implemented.
