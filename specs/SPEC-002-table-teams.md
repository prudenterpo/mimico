# SPEC-002 - Table and Team Setup

Status: Accepted  
Date: 2026-07-25

## Overview

This functional spec defines private table creation, invite handling, accepted table players, table chat, manual team assignment, and explicit match start.

This document exists because table setup is the bridge between the lobby and the match. It must produce a valid `Table`, valid `TeamAssignment`, and a match-ready state before gameplay can safely begin.

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

- create private table
- invite exactly 3 other online users
- accept or reject invite
- show accepted, pending, rejected, and expired invite/player states
- table chat before match and between matches
- host manual team assignment
- table readiness derived from players plus teams
- explicit host match start
- route all players to match setup after successful start
- mobile and desktop table setup UX

Out of scope:

- lobby auth and global chat
- initial turn dice selection after match creation
- gameplay rounds
- video call
- active-match reconnection
- public tables
- guest users

## Actors

- Host
- Invited user
- Accepted table player

## User Stories

### SPEC-002-US-001 - Create Table

As an authenticated lobby user, I can create a private table and become host.

Acceptance criteria:

- table name is required
- table name must be 3 to 100 characters
- frontend calls `POST /api/tables`
- backend returns canonical `tableId`
- frontend does not generate authoritative table IDs locally
- creator becomes host and first accepted player
- after table creation, host can invite exactly 3 other users

### SPEC-002-US-002 - Send Invites

As host, I can invite 3 online users to my table.

Acceptance criteria:

- host cannot invite self
- host cannot invite more than 3 users for V1 table
- host cannot invite offline users
- invite expires after 60 seconds
- invited user receives a visible invite notification
- table player list shows pending invite status

### SPEC-002-US-003 - Accept Or Reject Invite

As an invited user, I can accept or reject a table invite.

Acceptance criteria:

- accepting a valid invite adds user to table
- accepting an expired invite shows clear error
- rejecting invite marks invite as rejected for host/table state
- accepted user is routed to the table
- rejected user remains in lobby

### SPEC-002-US-004 - Table Chat

As a table player, I can chat with the other table players before the match and between matches.

Acceptance criteria:

- only accepted table players can send table chat
- messages have sender, text, and timestamp
- empty messages cannot be sent
- messages are capped at 500 characters
- chat is not persisted as long-term history in V1

### SPEC-002-US-005 - Manual Team Assignment

As host, I can manually assign exactly 4 accepted players into two teams of two.

Acceptance criteria:

- host can move players between Team A and Team B
- each team must contain exactly 2 players
- every accepted player appears in exactly one team
- non-host players can see teams but cannot edit them
- team changes broadcast to all table players
- table state becomes `TABLE_READY_TO_START` only when exactly 4 players and valid teams exist

### SPEC-002-US-006 - Start Match

As host, I can start the match only when the table is ready.

Acceptance criteria:

- start button is visible only to host
- start button is disabled until table is `TABLE_READY_TO_START`
- non-host cannot start match
- backend validates player count and team assignment again
- successful start creates a new `Match`
- table moves to `TABLE_IN_MATCH`
- all table players receive `MATCH_STARTED`
- all table players are routed to match setup or game screen

### SPEC-002-US-007 - Leave Or Close Table

As a table player, I can leave the table before match start.

Acceptance criteria:

- if non-host leaves before match start, table updates player list and team assignment becomes invalid if needed
- if host leaves before match start, table closes for V1
- accepted and pending invites are cleaned up when table closes
- all affected players are notified

## Functional Flow

### Create And Invite Flow

1. Host opens create-table modal from lobby.
2. Host enters table name and selects exactly 3 online users.
3. Frontend sends `POST /api/tables`.
4. Backend creates table and returns `tableId`.
5. Frontend routes host to `/table/{tableId}`.
6. Frontend sends invites using canonical table ID.
7. Invited users receive `TABLE_INVITE_RECEIVED`.
8. Table receives `TABLE_PLAYERS_UPDATED` as invite/player statuses change.

### Accept Invite Flow

1. Invited user receives invite in lobby.
2. User accepts before expiration.
3. Frontend sends accept command.
4. Backend validates invite exists and table can accept player.
5. Backend adds user to table.
6. Backend broadcasts `TABLE_PLAYERS_UPDATED`.
7. Accepted user routes to `/table/{tableId}`.

### Team Assignment Flow

1. Table has 4 accepted players.
2. Host edits teams manually.
3. Frontend sends `ASSIGN_TEAMS`.
4. Backend validates exact two players per team and no duplicates.
5. Backend stores or caches assignment.
6. Backend broadcasts `TABLE_TEAMS_UPDATED`.
7. If table now has exactly 4 accepted players and valid teams, table state becomes `TABLE_READY_TO_START`.

### Start Match Flow

1. Host clicks start.
2. Frontend sends start command or REST start request according to final implementation choice.
3. Backend validates host, table state, player count, and team assignment.
4. Backend creates match and match players from explicit team assignment.
5. Backend broadcasts `MATCH_STARTED`.
6. All players navigate to match setup.

## REST Contract Usage

Must follow:

- `POST /api/tables`
- `GET /api/tables/{tableId}`
- `POST /api/matches/start`

`POST /api/matches/start` must use explicit `teamAssignments`, not a plain `playerIds` array.

## WebSocket Contract Usage

Client commands:

- `/app/table/invite`
- `/app/table/invite/accept`
- `/app/table/invite/reject`
- `/app/table/teams/assign`
- `/app/table/match/start`
- `/app/table/leave`

Server events:

- `TABLE_INVITE_RECEIVED`
- `TABLE_PLAYERS_UPDATED`
- `TABLE_TEAMS_UPDATED`
- `MATCH_STARTED`
- `TABLE_CANCELLED`

All server events must use the standard event envelope from `CONTRACTS-001`.

## UI Requirements

### Desktop

- table screen shows players and teams side-by-side with chat
- host has clear team editing controls
- non-host sees read-only teams
- start match control is visually tied to readiness state
- pending/rejected/expired invite status is visible

### Mobile

- players/teams and chat are reachable without layout overlap
- host can assign teams with touch-friendly controls
- start match control remains visible after readiness
- chat input remains usable with keyboard open

## State Requirements

Table client state:

- `tableId`
- `name`
- `hostUserId`
- `status`
- `players`
- `pendingInvites`
- `rejectedInvites`
- `teamAssignments`
- `tableChatMessages`

Backend table state:

- canonical table ID generated by backend
- accepted players include host
- pending invites expire after 60 seconds
- team assignment is explicit and validated
- table status derives from domain state machine

## Validation And Errors

Table errors:

- table not found
- not table host
- table closed
- table already in match
- invalid table name

Invite errors:

- invited user offline
- invited user already invited
- invited user already in table
- invite expired
- table full

Team assignment errors:

- duplicate player
- missing accepted player
- player not in table
- invalid team size
- unknown team value

Start errors:

- not host
- table not ready
- invalid teams
- wrong player count

All errors should use canonical `ErrorResponse`.

## Testing Requirements

### Backend

- create table adds host as accepted player
- invite offline user fails
- invite expires after 60 seconds
- accept valid invite adds player
- accept expired invite fails
- reject invite updates state
- team assignment rejects duplicates
- team assignment rejects players not in table
- table becomes ready only with exactly 4 players and valid teams
- non-host cannot assign teams
- non-host cannot start match
- start match creates match players with explicit teams

### Frontend

- create table requires name and exactly 3 selected users
- create table uses backend-generated table ID
- invite notification accept/reject works
- host can assign players to teams
- non-host cannot edit teams
- start button only enabled for host when ready
- table player statuses render correctly
- mobile table layout smoke

### Contract

- `POST /api/tables` request/response matches OpenAPI
- `POST /api/matches/start` accepts explicit team assignment
- table WebSocket events match AsyncAPI envelope
- table errors match `error.schema.json`

### E2E Smoke

- login 4 users
- user 1 creates table and invites users 2, 3, 4
- users 2, 3, 4 accept
- host assigns teams manually
- host starts match
- all users arrive in match setup

## Accessibility Requirements

- team assignment controls are keyboard reachable
- selected team state is announced or visibly clear
- invite status is visible without color alone
- start disabled reason is visible to host
- chat input has accessible label

## Observability Requirements

Backend should log:

- table created
- invite sent/accepted/rejected/expired
- team assignment success/failure reason
- match start success/failure reason
- table closed

Frontend should surface:

- invite delivery errors
- expired invite message
- team assignment validation errors
- start match validation errors
- lost WebSocket connection during table setup

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| Frontend generates `tableId` locally with `crypto.randomUUID()`. | Backend must generate authoritative table ID via `POST /api/tables`. |
| Store sends invites without creating table through REST. | Table creation and invite sending must be sequenced. |
| Table screen uses ready toggles and auto-start logic. | V1 requires explicit host start after manual team assignment. |
| Current table teams are inferred by slicing player list. | Teams must come from explicit host assignment. |
| Current backend auto-start can trigger when 4 ready players exist. | Backend must require host start command. |
| `StartMatchRequestDTO` accepts `playerIds`. | Start match must accept `teamAssignments`. |
| Table chat command appears in frontend but not clearly implemented in backend contract. | Table chat must be added to AsyncAPI or removed from V1 table setup. |
| Existing table status enum lacks `BETWEEN_MATCHES`. | Backend status model must align with domain states or adapt at contract boundary. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks and tests.

| ID | Decision |
| --- | --- |
| `SPEC-002-AD-001` | Host chooses invitees during table creation for V1 speed. |
| `SPEC-002-AD-002` | V1 does not use a ready toggle; explicit host start plus valid teams is enough. |
| `SPEC-002-AD-003` | If a non-host leaves before match start, host may invite a replacement. |
| `SPEC-002-AD-004` | Table chat is included in V1 before the match and between matches. |
