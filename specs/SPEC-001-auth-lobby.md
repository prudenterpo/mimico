# SPEC-001 - Auth and Lobby

Status: Accepted  
Date: 2026-07-25

## Overview

This functional spec defines the authenticated entry flow for Mimico V1: register, login, restore session, logout, lobby presence, online users, lobby chat, invite reception, and the path to table creation.

This document exists because every playable flow starts here. If auth, session restoration, or lobby WebSocket state is unreliable, table setup and match gameplay will inherit unstable state.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `harness/HARNESS-001-agent-execution.md`

## Scope

In scope:

- user registration
- user login
- authenticated session persistence
- session restoration on page reload
- logout
- lobby access protection
- WebSocket connection after authentication
- online users list
- lobby chat
- receiving table invites while in the lobby
- responsive lobby experience on desktop and mobile

Out of scope:

- table team assignment
- table ready/start behavior
- match gameplay
- reconnection during an active match
- video transport
- public guest access
- OAuth login

## Actors

- Anonymous visitor
- Authenticated user
- Online lobby user
- Invited user

## User Stories

### SPEC-001-US-001 - Register

As an anonymous visitor, I can create an account with email, nickname, and password so I can play Mimico.

Acceptance criteria:

- user can open register page from home or login page
- email must be valid
- nickname must be 5 to 20 characters
- nickname allows letters, numbers, hyphen, and underscore
- password must satisfy backend password policy
- duplicate email or nickname returns a clear error
- successful registration logs the user in or routes them into the authenticated flow

### SPEC-001-US-002 - Login

As an existing user, I can log in with email and password.

Acceptance criteria:

- valid credentials return a JWT and user identity
- invalid credentials return a stable auth error
- frontend stores the token securely enough for V1 browser use
- after login, user lands in the lobby

### SPEC-001-US-003 - Restore Session

As a returning user, I can reload the browser and remain authenticated if my token is still valid.

Acceptance criteria:

- frontend reads existing token on startup
- frontend calls `GET /api/auth/me`
- valid token restores user state
- invalid or expired token is cleared
- user is routed to login when accessing lobby without valid auth

### SPEC-001-US-004 - Logout

As an authenticated user, I can log out.

Acceptance criteria:

- frontend disconnects WebSocket
- frontend clears token and in-memory auth state
- backend invalidates session if supported
- user returns to unauthenticated flow
- lobby state is cleared locally

### SPEC-001-US-005 - Lobby Presence

As an authenticated user, I can enter the lobby and see who is online.

Acceptance criteria:

- lobby connects to WebSocket after auth is ready
- lobby subscribes to online user updates
- current user appears online to other users
- online user list updates when users connect or disconnect
- mobile has an accessible way to view online users

### SPEC-001-US-006 - Lobby Chat

As an authenticated lobby user, I can send and receive global lobby chat messages.

Acceptance criteria:

- messages have sender identity, text, and timestamp
- empty messages cannot be sent
- messages are capped at 500 characters
- sent messages appear without page refresh
- received messages preserve sender identity
- lobby chat is not persisted as long-term history in V1

### SPEC-001-US-007 - Receive Table Invite

As an online lobby user, I can receive a table invite and choose to accept or reject it.

Acceptance criteria:

- invite appears as a visible time-limited notification
- invite includes table name and host identity
- invite expires after 60 seconds
- accept transitions user toward the table flow
- reject dismisses the invite and notifies table state

## Functional Flow

### Register Flow

1. Anonymous visitor opens `/register`.
2. User submits nickname, email, password, and password confirmation.
3. Frontend validates local fields.
4. Frontend sends `POST /api/auth/register`.
5. Backend validates request and creates account.
6. Frontend logs in automatically or uses returned auth state if available.
7. User lands in `/lobby`.

### Login Flow

1. Anonymous visitor opens `/login`.
2. User submits email and password.
3. Frontend sends `POST /api/auth/login`.
4. Backend returns token and user profile.
5. Frontend stores token and user state.
6. User lands in `/lobby`.

### Lobby Entry Flow

1. User opens `/lobby`.
2. Frontend restores auth if needed.
3. If auth fails, route to `/login`.
4. If auth succeeds, connect STOMP WebSocket.
5. Frontend subscribes to lobby topics and user queues.
6. Frontend publishes `/app/lobby/join`.
7. Server emits `ONLINE_USERS_UPDATED`.

### Lobby Chat Flow

1. User types a message.
2. Frontend blocks empty message.
3. Frontend publishes `/app/lobby/chat`.
4. Server accepts authenticated message.
5. Server broadcasts `LOBBY_MESSAGE_POSTED`.
6. All lobby clients append the message.

### Invite Reception Flow

1. Host sends invite from table flow.
2. Invited lobby user receives `TABLE_INVITE_RECEIVED` on `/user/queue/invite`.
3. Frontend shows invite notification with countdown.
4. User accepts or rejects.
5. Accept/reject command is sent to server.
6. User is routed based on resulting table state.

## REST Contract Usage

Must follow:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/lobby/online-users`

Response and error shapes must follow `CONTRACTS-001`.

## WebSocket Contract Usage

Client commands:

- `/app/lobby/join`
- `/app/lobby/chat`

Server events:

- `ONLINE_USERS_UPDATED`
- `LOBBY_MESSAGE_POSTED`
- `TABLE_INVITE_RECEIVED`

All server events must use:

```json
{
  "type": "EVENT_NAME",
  "data": {},
  "occurredAt": "2026-07-25T18:00:00Z"
}
```

## UI Requirements

### Desktop

- lobby shows online users in a persistent side panel
- lobby shows global chat as the primary area
- create-table entry point is visible
- logout is accessible from header
- invite notification is visible without covering main chat controls

### Mobile

- online users are reachable through a compact control or modal
- chat remains the primary visible area
- message input remains reachable without layout overlap
- create-table entry point is visible
- invite notification is readable and actionable

## State Requirements

Frontend auth state:

- `user`
- `token`
- `isAuthenticated`

Frontend lobby state:

- `onlineUsers`
- `chatMessages`
- `pendingInvite`
- WebSocket connection status

Backend presence state:

- online users should reflect active authenticated WebSocket sessions
- user disconnect should update presence
- user logout should remove online presence

## Validation And Errors

Registration errors:

- invalid email
- invalid nickname
- weak password
- duplicate email
- duplicate nickname

Login errors:

- invalid credentials
- disabled or missing user, if applicable

Lobby errors:

- unauthenticated WebSocket command
- malformed chat message
- message too long
- invite not found or expired

All errors should use the canonical error envelope from `CONTRACTS-001`.

## Testing Requirements

### Backend

- registration validation unit/integration tests
- duplicate email/nickname tests
- login success and failure tests
- `/auth/me` with valid and invalid token
- online user tracking on WebSocket connect/disconnect
- lobby chat rejects unauthenticated or malformed messages

### Frontend

- register form validation
- login form validation
- token restore success/failure
- protected lobby redirect behavior
- lobby renders online users
- lobby sends and receives chat messages through mocked STOMP client
- invite toast accept/reject behavior
- mobile layout smoke for lobby

### Contract

- REST requests/responses match OpenAPI
- lobby WebSocket events match AsyncAPI and event envelope schema
- error responses match `error.schema.json`

### E2E Smoke

- register four test users
- login one user
- enter lobby
- see online users
- send lobby chat message
- receive table invite notification

## Accessibility Requirements

- form fields have accessible labels
- validation errors are visible and associated with fields
- invite notification actions are keyboard reachable
- lobby chat input can be submitted with keyboard
- mobile users can access online list without hover-only interaction

## Observability Requirements

Backend should log:

- registration success/failure without password
- login failure reason category, not raw password
- WebSocket connect/disconnect user ID
- lobby chat rejection reason
- invite delivery failure

Frontend should surface:

- login/register errors
- WebSocket connection failure
- invite expiration

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| Frontend calls `/auth/*` without `/api` base path. | Public contract uses `/api/auth/*`; deployment or client config must align. |
| Lobby WebSocket event uses `ONLINE_USERS_UPDATE`. | Contract uses `ONLINE_USERS_UPDATED`. |
| Lobby chat appears to pass raw DTO shape without standard envelope. | Contract requires `{ type, data, occurredAt }`. |
| Some frontend STOMP callbacks expect mixed message shapes. | Frontend should normalize standard event envelopes. |
| Store has table subscriptions mixed into global lobby connection. | Later specs may split lobby/table subscriptions more clearly. |
| `Invite.invitedUserId` frontend type is `number`. | IDs must be UUID strings. |
| Debug logs expose token presence in browser console. | Token logging should be removed before V1. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks and tests.

| ID | Decision |
| --- | --- |
| `SPEC-001-AD-001` | Successful registration logs the user in automatically and routes them to the lobby. |
| `SPEC-001-AD-002` | Lobby chat is not persisted in V1; only the current browser session shows messages received while connected. |
| `SPEC-001-AD-003` | Online user list includes the current user and may visually indicate "you". |
| `SPEC-001-AD-004` | Unauthenticated lobby access redirects to login. |
