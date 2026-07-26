# TEST-FIRST-130 - Backend Table, Invites, Manual Teams, and Explicit Start

Status: Draft for Approval
Linked task IDs:

- `TASK-130`

## Behavior Under Test

The backend must implement the canonical table setup bridge from lobby to match setup as required by `SPEC-002`.

The tests must prove:

- authenticated users can create private tables
- backend generates authoritative table IDs
- host is automatically accepted as the first table player
- host can invite exactly 3 other online users
- invite accept/reject/expiration updates table state
- accepted table players can use table chat
- manual team assignment is host-only and validates exactly 2 players per team
- table readiness is derived from exactly 4 accepted players plus valid teams
- match start is explicit and host-only
- match start creates a match and immutable team snapshot for later gameplay
- table WebSocket events use canonical event envelope and event names, including `TABLE_MESSAGE_POSTED` and `TABLE_CLOSED`

## Fixtures Required

Create backend-local test fixtures only.

Required fixture concepts:

- four valid authenticated users
- one host user
- three online invitee users
- one offline user
- one valid table name
- invalid table names below 3 and above 100 characters
- pending invite
- accepted invite
- rejected invite
- expired invite
- table with host only
- table with four accepted players
- valid Team A and Team B assignment with exactly two players each
- invalid team assignments: duplicate player, missing player, non-table player, wrong team size, unknown team value
- valid table chat message
- invalid table chat messages: unauthenticated, non-player, empty, over 500 characters

Fixture rules:

- use fake UUIDs, users, emails, tokens, and timestamps
- do not use production credentials or external services
- use canonical teams `A` and `B`
- use canonical table states from `DOMAIN-001`
- use canonical invite statuses from `DOMAIN-001`
- use canonical event names from `GLOSSARY-001`
- ensure table chat fixtures are separate from lobby chat and future round guess chat

## Tests To Add Or Update

Add backend tests for table REST behavior:

- `POST /api/tables` requires authentication
- create table rejects missing, too-short, and too-long names
- create table succeeds and returns backend-generated `tableId`
- created table includes host as accepted player
- `GET /api/tables/{tableId}` returns canonical table state for accepted players
- `GET /api/tables/{tableId}` rejects unauthenticated or unauthorized users as appropriate
- `POST /api/matches/start` uses explicit `teamAssignments`
- start match rejects plain `playerIds` legacy shape if still reachable

Add backend tests for invite behavior:

- host can invite an online user
- host cannot invite self
- host cannot invite offline user
- host cannot invite more than 3 users for V1
- duplicate invite is rejected
- accepting a valid invite adds the user to the table
- accepting an expired invite fails with canonical error
- rejecting an invite marks it rejected
- accepted/rejected/expired updates broadcast `TABLE_PLAYERS_UPDATED`

Add backend tests for table chat:

- accepted table player can publish `/app/table/{tableId}/chat`
- unauthenticated user cannot publish table chat
- non-table user cannot publish table chat
- empty and overlong table chat are rejected
- accepted table chat broadcasts `TABLE_MESSAGE_POSTED`

Add backend tests for teams/readiness/start:

- host can assign valid Team A and Team B
- non-host cannot assign teams
- duplicate player assignment is rejected
- missing accepted player is rejected
- non-table player is rejected
- invalid team size is rejected
- unknown team value is rejected
- table remains `TABLE_WAITING` when players or teams are incomplete
- table becomes `TABLE_READY_TO_START` only with exactly 4 accepted players and valid teams
- non-host cannot start match
- host cannot start match before readiness
- host start creates a new `Match`
- match players preserve explicit team assignment
- table moves to `TABLE_IN_MATCH`
- `MATCH_STARTED` is published to table players

Add backend tests for leave/close:

- non-host leave before match start updates player list and invalidates teams when needed
- host leave before match start closes the table for V1
- table close cleans pending invites
- close publishes `TABLE_CLOSED`

Contract-oriented assertions:

- table events use `{ type, data, occurredAt }`
- event names match AsyncAPI and glossary
- team assignment payloads match `team-assignment.schema.json`
- errors use canonical `ErrorResponse`

## Expected Failing State Before Implementation

Before `TASK-130` implementation, one or more of these may be true:

- current table code may use legacy names or auto-start behavior
- `POST /api/matches/start` may accept only `playerIds`
- table chat may be absent or not contracted
- `TABLE_CLOSED` may not be emitted from backend code
- manual team assignment may be absent or not host-only
- invite expiration may be missing or timer-dependent
- match-player team snapshot may be absent

Expected first failures should be legacy contract mismatches, missing table state transitions, or missing WebSocket event behavior. The executor must not weaken contracts to make legacy code pass.

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

- timer-based invite expiration cannot be tested without sleeps, and the executor adds deterministic clock/service-level tests instead
- full STOMP integration is unavailable, and service/controller/event-construction tests still prove command authorization and envelope payloads
- existing backend baseline failures are already classified by `TASK-030`
- match creation can stop at `MATCH_SETUP` because gameplay state machine work belongs to Wave 3

Deferral is not allowed for:

- accepting auto-start instead of explicit host start
- accepting `playerIds` instead of explicit `teamAssignments`
- allowing non-host team assignment or match start
- skipping invalid team-assignment cases
- merging lobby chat, table chat, and round guess chat behavior
- emitting table events without canonical envelope
- changing accepted contracts or specs to preserve legacy code
