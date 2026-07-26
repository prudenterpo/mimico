# TASK-120 - Frontend Auth and Lobby Integration

Status: Draft for Approval
Target repo: frontend `mimico-game`
Autonomy level: Level 1 - Single Task

## Objective

Implement the frontend authenticated entry and lobby experience for Mimico V1: register, login, session restoration, logout, protected lobby access, online users, lobby chat, and invite reception shell.

This task consumes the backend auth/lobby behavior from `TASK-110` and prepares the user path into table setup without implementing table setup itself.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Completed Wave 1, including `TASK-010`, `TASK-020`, and `TASK-040`
- Completed or locally available `TASK-110` backend auth/lobby behavior
- `CONTRACT-GAP-001` and `CONTRACT-GAP-002` resolved in local commit `affa173`

## Source Documents

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/error.schema.json`
- `contracts/schemas/realtime-event-envelope.schema.json`
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-004-video-chat.md`, only for chat-context separation
- `specs/SPEC-006-mobile-desktop-experience.md`
- `docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `tasks/TASK-040.md`
- `tasks/TASK-110.md`

## Scope

- Implement or align register, login, and logout UI flows.
- Implement token storage and startup session restoration through `GET /api/auth/me`.
- Protect lobby routes from unauthenticated access.
- Clear auth, WebSocket, and lobby state on logout or invalid token.
- Connect STOMP/WebSocket only after auth is ready.
- Publish `/app/lobby/join` after authenticated lobby entry.
- Subscribe to canonical lobby online-users and lobby-chat destinations.
- Parse server events through the canonical event envelope.
- Render online users and lobby chat on desktop and mobile.
- Send lobby chat through `/app/lobby/chat`.
- Block empty and over-500-character lobby chat client-side.
- Show received `TABLE_INVITE_RECEIVED` as a time-limited notification shell with accept/reject actions wired only as far as contracts allow before `TASK-140`.
- Add frontend tests defined by `TEST-FIRST-120` once that pack is approved.

## Out Of Scope

- Backend implementation.
- Table creation, invite sending, invite accept/reject completion, table screen, manual teams, or match start.
- Gameplay, round chat, video, reconnection, deploy provider work, or multi-user E2E.
- Generated API clients or generated shared types.
- Full visual polish pass beyond the screen requirements needed for the accepted auth/lobby flow.
- Changing root contracts or accepted specs.

## Acceptance Criteria

- Anonymous users can reach register and login flows.
- Successful login routes users to `/lobby`.
- Valid stored token restores user state through `GET /api/auth/me`.
- Invalid or expired token is cleared and protected lobby access routes to login.
- Logout disconnects WebSocket, clears token/state, and returns to unauthenticated flow.
- Lobby connects after auth is ready and receives online-user updates.
- Lobby chat sends and receives messages without page refresh.
- Lobby chat is separate from table chat and round guess chat.
- Invite notification includes table name, host identity, visible countdown, and accept/reject affordances.
- Mobile lobby keeps chat usable and online users accessible without layout overlap.
- Desktop lobby shows online users in a persistent side panel.
- Error states use canonical backend `ErrorResponse` where available.
- Frontend tests cover the approved `TEST-FIRST-120` behaviors.
- No root or backend files are changed except for task-status documentation if explicitly approved.

## Required Tests

This task will later receive `TEST-FIRST-120`.

Required coverage intent:

- register/login form validation
- login success routes to lobby
- invalid login displays stable error
- token restore success and failure
- protected lobby redirect behavior
- logout clears auth and lobby state
- mocked STOMP lobby join, online-users event, and lobby-message event handling
- lobby chat client validation
- invite notification countdown and accept/reject shell behavior
- mobile lobby layout smoke where the approved harness supports it

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

- `mimico-game/package.json`, only for scripts/dependencies needed by tests or client integration
- `mimico-game/package-lock.json` or existing lockfile
- `mimico-game/src/`, limited to auth, API client, WebSocket/STOMP client, lobby state, lobby UI, invite notification shell, tests, and fixtures
- `mimico-game/app/`, limited to auth/lobby routes and layouts
- `mimico-game/test/`, `mimico-game/tests/`, or equivalent
- `mimico-game/README.md`, only for verification notes

## Stop Conditions

Stop and ask for review if:

- frontend state architecture overhaul is required before proceeding
- generated API clients/types become necessary
- accepted backend contracts are missing or conflict with `TASK-110`
- table accept/reject behavior cannot be represented without implementing `TASK-140`
- WebSocket authentication requires backend contract changes
- root contracts or backend code need to change
- visual requirements require a broader design-system task

## Expected Commit / PR Notes

- Commit from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`.
- Suggested branch: `feature/task-120-frontend-auth-lobby`.
- PR should mention `SPEC-001`, `SPEC-006`, `PRODUCT-DESIGN-001`, list frontend verification commands, and note the dependency on `TASK-110`.
