# TEST-FIRST-110 - Backend Auth, Session, Lobby Presence, and Lobby Chat

Status: Draft for Approval
Linked task IDs:

- `TASK-110`

## Behavior Under Test

The backend must expose the authenticated entry and lobby behavior required by `SPEC-001` using canonical REST, WebSocket, error, and event-envelope contracts.

The tests must prove:

- users can register, login, restore session, and logout through `/api/auth/*`
- invalid auth inputs return canonical `ErrorResponse`
- authenticated users can enter the lobby and be visible online
- online presence updates when users join, disconnect, or logout
- lobby chat accepts valid authenticated messages and rejects invalid messages
- `ONLINE_USERS_UPDATED` and `LOBBY_MESSAGE_POSTED` use `{ type, data, occurredAt }`
- lobby chat remains separate from table chat and future round guess chat

## Fixtures Required

Create backend-local test fixtures only.

Required fixture concepts:

- one valid register request
- one invalid email request
- one invalid nickname request
- one weak-password request if backend policy is executable
- duplicate email and duplicate nickname users
- one valid login request
- one invalid login request
- one authenticated lobby user
- two or more online lobby users for presence updates
- one valid lobby chat message
- empty, malformed, and over-500-character lobby chat messages

Fixture rules:

- use fake emails, nicknames, UUIDs, tokens, and timestamps
- do not include real passwords, JWT secrets, production URLs, or production credentials
- use canonical event names from `GLOSSARY-001`
- use canonical `ErrorResponse` fields from `contracts/schemas/error.schema.json`
- WebSocket event assertions must inspect the envelope and the event `type`

## Tests To Add Or Update

Add backend tests for auth REST behavior:

- `POST /api/auth/register` succeeds with valid email, nickname, and password
- register rejects invalid email
- register rejects invalid nickname
- register rejects weak password according to backend policy
- register rejects duplicate email
- register rejects duplicate nickname
- `POST /api/auth/login` succeeds with valid credentials and returns token plus user identity
- login rejects invalid credentials with canonical error shape
- `GET /api/auth/me` succeeds with a valid token
- `GET /api/auth/me` rejects missing, invalid, or expired token
- `POST /api/auth/logout` succeeds for an authenticated user and clears supported session/presence state

Add backend tests for lobby REST and WebSocket behavior:

- `GET /api/lobby/online-users` requires authentication
- authenticated lobby join adds the user to online users
- lobby disconnect removes the user from online users
- logout removes the user from online users if they were present
- lobby join broadcasts `ONLINE_USERS_UPDATED`
- `/app/lobby/chat` accepts a valid authenticated message
- lobby chat rejects unauthenticated commands
- lobby chat rejects empty, malformed, and overlong text
- accepted lobby chat broadcasts `LOBBY_MESSAGE_POSTED`
- lobby events use the standard event envelope and canonical event names

Contract-oriented assertions:

- REST errors include `code`, `message`, `details`, and optional `correlationId`
- lobby event payloads do not use raw strings or legacy event names
- lobby chat tests do not publish to table or match/guess destinations

## Expected Failing State Before Implementation

Before `TASK-110` implementation, one or more of these may be true:

- one or more auth endpoints are absent or return non-canonical payloads
- auth errors may not match `ErrorResponse`
- `/api/auth/me` may not restore token state
- lobby presence may be absent, in-memory only, or disconnected from authenticated WebSocket sessions
- lobby chat may be absent or may not use the canonical envelope
- old tests may encode legacy behavior not accepted for V1

The first expected failures should be missing endpoints, mismatched payloads, or absent WebSocket event behavior. The executor must classify existing passing tests as evidence only, not authority over accepted specs.

## Required Verification Command

Run from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`:

```bash
./mvnw test
```

Run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Deferral Rules

Deferral is allowed when:

- WebSocket integration testing needs infrastructure unavailable in the current backend harness, and unit/controller/service tests still cover command validation and event construction
- password policy is not documented enough to assert exact weak-password cases, and the executor documents the current backend policy
- session invalidation is unsupported by the accepted backend model and logout can only clear client-side token plus presence state
- existing baseline tests fail for reasons already classified by `TASK-030`

Deferral is not allowed for:

- skipping canonical error-shape assertions for auth failures
- accepting unauthenticated lobby commands
- emitting lobby events without `{ type, data, occurredAt }`
- treating table chat or round guess chat as lobby chat
- changing accepted contracts or specs to make tests pass
