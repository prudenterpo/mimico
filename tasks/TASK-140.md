# TASK-140 - Frontend Table Setup and Team Assignment

Status: Draft for Approval
Target repo: frontend `mimico-game`
Autonomy level: Level 1 - Single Task

## Objective

Implement the frontend table setup path for Mimico V1: creating a private table, selecting invitees, accepting or rejecting invites, rendering table player/invite state, table chat, host manual team assignment, readiness, explicit start, and routing players to match setup after `MATCH_STARTED`.

This task consumes backend table behavior from `TASK-130` and stops at the match setup boundary.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Completed Wave 1, including `TASK-010`, `TASK-020`, and `TASK-040`
- Completed or locally available `TASK-120`
- Completed or locally available `TASK-130`
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
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-004-video-chat.md`, only for chat-context separation
- `specs/SPEC-006-mobile-desktop-experience.md`
- `docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `tasks/TASK-120.md`
- `tasks/TASK-130.md`

## Scope

- Add create-table entry point from lobby.
- Implement create-table UI with table name and exactly 3 invited online users.
- Call `POST /api/tables` and route host to `/table/{tableId}` using the backend-generated ID.
- Send table invites through the accepted WebSocket command.
- Complete invite accept/reject actions from lobby notification.
- Route accepted invited users to `/table/{tableId}`.
- Render table player and invite statuses: accepted, pending, rejected, and expired.
- Subscribe to table player, team, chat, match-started, and closed destinations.
- Parse table events through the canonical event envelope.
- Implement table chat through `/app/table/{tableId}/chat`.
- Keep table chat separate from lobby chat and future round guess chat.
- Implement host manual team assignment controls.
- Render teams read-only for non-host players.
- Show readiness state and disabled reason for host.
- Enable explicit start only for host when table is ready.
- Route all players to match setup or game screen after `MATCH_STARTED`, without implementing gameplay behavior.
- Render `TABLE_CLOSED` state and return affected players to lobby where appropriate.
- Add frontend tests defined by `TEST-FIRST-140` once that pack is approved.

## Out Of Scope

- Backend implementation.
- Auth/lobby changes beyond wiring invite accept/reject from `TASK-120`.
- Gameplay UI, initial turn selection, dice, words, guessing, timers, board, win, or rematch.
- Video/WebRTC, active-match reconnection, deploy provider work, or multi-user E2E.
- Full visual-system rewrite beyond table setup requirements.
- Generated API clients or generated shared types.
- Changing root contracts or accepted specs.

## Acceptance Criteria

- Host can create a table only with a valid name and exactly 3 selected online users.
- Frontend uses backend-generated `tableId`; it does not create authoritative table IDs locally.
- Invited users can accept or reject visible invite notifications before expiration.
- Accepted invite routes the user to the table.
- Rejected invite keeps the user in the lobby and updates visible state.
- Table screen renders accepted, pending, rejected, and expired statuses.
- Table chat sends and receives messages without page refresh.
- Host can assign exactly 4 accepted players into Team A and Team B.
- Non-host users can see teams but cannot edit them.
- Start control is visible only to host and disabled until table readiness.
- Disabled start reason is visible to host.
- `MATCH_STARTED` routes all players to the accepted match setup/game boundary.
- `TABLE_CLOSED` is visible and exits affected users cleanly.
- Mobile table setup keeps players/teams and chat reachable without layout overlap.
- Desktop table setup shows players/teams and chat in the accepted product-design hierarchy.
- Team controls are keyboard reachable and team membership is not communicated by color alone.
- Frontend tests cover the approved `TEST-FIRST-140` behaviors.

## Required Tests

This task will later receive `TEST-FIRST-140`.

Required coverage intent:

- create-table form validation
- exactly 3 invitee selection
- create table uses backend `tableId`
- invite accept and reject flows with mocked API/STOMP
- table event envelope parsing
- table player status rendering
- table chat client validation and event handling
- host team assignment valid and invalid UI states
- non-host read-only team view
- start button visibility, disabled state, and command behavior
- `MATCH_STARTED` route behavior
- `TABLE_CLOSED` handling
- mobile table layout smoke where the approved harness supports it

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`:

```bash
npm run build
npm test
```

If dependencies are missing or changed, run:

```bash
npm ci
```

Run from `/Users/rodrigooliveira/personalProjects/mimico` if frontend contract fixtures or event-shape assumptions are touched:

```bash
npm run contracts:validate
```

## Allowed Files Or Areas

- `mimico-game/package.json`, only for scripts/dependencies needed by tests or table integration
- `mimico-game/package-lock.json` or existing lockfile
- `mimico-game/src/`, limited to table setup, invite handling, table API/STOMP client, table state, table UI, tests, and fixtures
- `mimico-game/app/`, limited to lobby-to-table routing and table routes/layouts
- `mimico-game/test/`, `mimico-game/tests/`, or equivalent
- `mimico-game/README.md`, only for verification notes

## Stop Conditions

Stop and ask for review if:

- frontend state architecture overhaul is required before proceeding
- generated API clients/types become necessary
- `TASK-130` behavior or accepted contracts are not available
- table setup cannot route to match setup without implementing gameplay
- mobile layout requirements require broader visual-system work from Wave 6
- root contracts or backend code need to change
- video, reconnection, or gameplay state becomes necessary

## Expected Commit / PR Notes

- Commit from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`.
- Suggested branch: `feature/task-140-frontend-table-setup`.
- PR should mention `SPEC-002`, `SPEC-006`, `PRODUCT-DESIGN-001`, list frontend verification commands, and note the dependency on `TASK-130`.
