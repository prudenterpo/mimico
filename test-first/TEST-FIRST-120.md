# TEST-FIRST-120 - Frontend Auth and Lobby Integration

Status: Draft for Approval
Linked task IDs:

- `TASK-120`

## Behavior Under Test

The frontend must provide the authenticated entry and lobby experience required by `SPEC-001` while consuming canonical backend REST and WebSocket contracts.

The tests must prove:

- register and login forms validate user input before submission
- valid login stores auth state and routes to the lobby
- startup session restoration calls `GET /api/auth/me`
- invalid stored token is cleared and protected lobby access routes to login
- logout disconnects WebSocket and clears auth/lobby state
- lobby connects to STOMP only after auth is ready
- online-user and lobby-chat events are parsed through the canonical event envelope
- lobby chat client validation rejects empty and overlong messages
- `TABLE_INVITE_RECEIVED` can be displayed as a time-limited notification shell
- desktop and mobile lobby structure preserves the accepted hierarchy without requiring live backend services

## Fixtures Required

Create frontend-local mocked fixtures only.

Required fixture concepts:

- valid auth user
- valid login response with fake token
- invalid login `ErrorResponse`
- valid `/api/auth/me` response
- invalid or expired token response
- online-users event envelope
- lobby-message event envelope
- table-invite-received event envelope
- lobby chat message under 500 characters
- empty and over-500-character lobby chat inputs

Fixture rules:

- do not use real emails, passwords, JWTs, production URLs, or live WebSocket services
- use fake UUIDs and ISO-8601 timestamps
- use canonical event names from `GLOSSARY-001`
- use only the fields accepted by OpenAPI, AsyncAPI, and shared schemas
- mocks must make unknown/malformed event envelope behavior observable

## Tests To Add Or Update

Add frontend component/store/client tests for auth:

- register form blocks invalid email
- register form blocks invalid nickname
- register form blocks password confirmation mismatch if the UI asks for confirmation
- login form blocks empty credentials
- login success stores token/user state and routes to `/lobby`
- invalid login displays a stable error from `ErrorResponse`
- startup with a valid stored token calls `GET /api/auth/me` and restores user state
- startup with an invalid token clears token/user state
- unauthenticated access to `/lobby` routes to login
- logout clears token, user, lobby state, and WebSocket connection state

Add frontend component/store/client tests for lobby:

- lobby does not connect STOMP before auth is ready
- lobby publishes `/app/lobby/join` after authenticated entry
- online-users event updates visible online users
- lobby-message event appends a chat message
- malformed event envelopes are rejected or safely ignored
- lobby chat blocks empty text
- lobby chat blocks text over 500 characters
- valid lobby chat publishes `/app/lobby/chat`
- invite event renders table name, host identity, countdown, and accept/reject controls
- invite dismiss/reject shell updates local visible state without implementing table setup

Add responsive smoke where supported by the approved harness:

- desktop lobby exposes chat as the primary area and online users as persistent side panel
- mobile lobby keeps chat primary and online users reachable through compact UI
- invite notification does not cover the chat input in the tested layout

## Expected Failing State Before Implementation

Before `TASK-120` implementation, one or more of these may be true:

- auth forms are absent, legacy, or not contract-aligned
- `GET /api/auth/me` restore flow is absent
- protected lobby routing is absent or incomplete
- STOMP connection may be mocked, legacy, or not event-envelope based
- lobby chat and invite shell may not exist
- frontend tests for auth/lobby may be absent before this task

Expected first failures should come from missing tests, missing UI/state behavior, or contract-shape mismatches. The executor must not start live backend services for these tests.

## Required Verification Command

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

## Deferral Rules

Deferral is allowed when:

- the frontend harness from `TASK-040` cannot support viewport smoke yet, and component/store/client tests still cover functional behavior
- accept/reject invite completion depends on `TASK-140`, and this task keeps only the visible notification shell
- WebSocket browser APIs require test shims that are documented and isolated
- existing build failure is unrelated and already classified by `TASK-040`

Deferral is not allowed for:

- depending on a live backend in unit/component tests
- storing real credentials or real tokens in fixtures
- parsing lobby events without checking the canonical envelope
- implementing table setup behavior inside this task
- silently accepting malformed auth errors or unknown event shapes
