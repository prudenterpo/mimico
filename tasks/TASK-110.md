# TASK-110 - Backend Auth, Session, Lobby Presence, and Lobby Chat

Status: Draft for Approval
Target repo: backend `api-mimico`
Autonomy level: Level 1 - Single Task

## Objective

Implement the backend authenticated entry and lobby foundation for Mimico V1: register, login, session restoration, logout, online-user presence, and lobby chat.

This task must make backend behavior follow canonical V1 auth/lobby contracts before table setup work depends on it.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Completed Wave 1, including `TASK-010`, `TASK-020`, and `TASK-030`
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
- `contracts/schemas/realtime-event-envelope.schema.json`
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-004-video-chat.md`, only for chat-context separation
- `specs/SPEC-007-deploy-observability.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `tasks/TASK-030.md`

## Scope

- Implement or align `POST /api/auth/register`.
- Implement or align `POST /api/auth/login`.
- Implement or align `POST /api/auth/logout`.
- Implement or align `GET /api/auth/me`.
- Implement or align `GET /api/lobby/online-users`.
- Ensure auth errors use canonical `ErrorResponse`.
- Ensure JWT/session restoration supports authenticated frontend reload.
- Ensure authenticated WebSocket connection can publish `/app/lobby/join`.
- Track online lobby users from authenticated WebSocket sessions.
- Broadcast `ONLINE_USERS_UPDATED` through the canonical event envelope.
- Implement lobby chat command `/app/lobby/chat`.
- Broadcast `LOBBY_MESSAGE_POSTED` through the canonical event envelope.
- Reject unauthenticated, empty, malformed, or over-500-character lobby chat.
- Add backend tests defined by `TEST-FIRST-110` once that pack is approved.

## Out Of Scope

- Frontend auth/lobby implementation.
- Table creation, invites, table chat, manual teams, or match start.
- Gameplay, round chat, guesses, video, reconnection, or deploy provider work.
- OAuth, guest access, password reset, email verification, or persistent long-term lobby chat history.
- Generated API clients or generated shared types.
- Weakening accepted OpenAPI, AsyncAPI, schemas, glossary terms, or domain invariants.

## Acceptance Criteria

- Auth endpoints follow `contracts/openapi/mimico-v1.yaml`.
- Register validates email, nickname, and password according to accepted policy or existing documented backend policy.
- Duplicate email and duplicate nickname return stable canonical errors.
- Login returns a token and user identity for valid credentials.
- Invalid credentials return a stable canonical auth error.
- `GET /api/auth/me` restores valid token state and rejects invalid/expired tokens.
- Logout invalidates server-side session state if supported and does not leave stale lobby presence.
- Online-user list reflects authenticated WebSocket join/disconnect/logout behavior.
- Lobby WebSocket events use `{ type, data, occurredAt }`.
- Lobby chat preserves sender identity, text, and timestamp.
- Lobby chat is not treated as table chat or round guess chat.
- Backend tests cover the approved `TEST-FIRST-110` behaviors.
- No root or frontend files are changed except for task-status documentation if explicitly approved.

## Required Tests

This task will later receive `TEST-FIRST-110`.

Required coverage intent:

- registration validation and duplicate identity cases
- login success and failure
- `/api/auth/me` with valid and invalid token
- logout/session cleanup behavior
- `GET /api/lobby/online-users`
- authenticated WebSocket lobby join updates presence
- disconnect/logout removes presence
- lobby chat rejects unauthenticated, empty, malformed, and overlong messages
- `ONLINE_USERS_UPDATED` and `LOBBY_MESSAGE_POSTED` match the event envelope

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
- `api-mimico/src/main/java/`, limited to auth, security/session, lobby, WebSocket config/handlers, DTOs, services, repositories, and error handling needed for this scope
- `api-mimico/src/main/resources/`, only for test-safe or auth/lobby configuration
- `api-mimico/src/test/`, limited to tests and fixtures for this scope
- `api-mimico/README.md` or backend-local docs, only for verification notes

## Stop Conditions

Stop and ask for review if:

- authentication/session model changes require a Tech Design
- accepted OpenAPI or AsyncAPI conflicts with current specs
- a new command, event name, state, or error code is needed but missing from accepted artifacts
- generated clients/types appear necessary
- test setup requires production secrets or external services
- table, gameplay, video, reconnection, root contract, or frontend changes become necessary

## Expected Commit / PR Notes

- Commit from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`.
- Suggested branch: `feature/task-110-backend-auth-lobby`.
- PR should mention `SPEC-001`, list backend and root contract verification commands, and state that frontend/table/gameplay behavior was not implemented.
