# TEST-FIRST-140 - Frontend Table Setup and Team Assignment

Status: Draft for Approval
Linked task IDs:

- `TASK-140`

## Behavior Under Test

The frontend must implement the canonical table setup user flow from lobby to match setup as required by `SPEC-002` and `SPEC-006`.

The tests must prove:

- host can create a private table from the lobby with exactly 3 selected online users
- frontend uses the backend-generated `tableId`
- invited users can accept or reject table invites
- accepted users route to `/table/{tableId}`
- table screen renders accepted, pending, rejected, and expired states
- table chat is separate from lobby chat and future round guess chat
- host can manually assign teams
- non-host players see read-only teams
- start control is host-only and disabled until readiness
- `MATCH_STARTED` routes players to the match setup/game boundary without implementing gameplay
- `TABLE_CLOSED` exits affected users cleanly
- mobile and desktop table layout behavior matches the accepted product-design direction enough for Wave 2

## Fixtures Required

Create frontend-local mocked fixtures only.

Required fixture concepts:

- current host user
- three online invitee users
- one non-host accepted table player
- valid create-table response with backend-generated `tableId`
- create-table validation errors using `ErrorResponse`
- table snapshot with host only
- table snapshot with pending invites
- table snapshot with rejected and expired invites
- table snapshot with four accepted players
- valid Team A and Team B assignment
- invalid/incomplete team assignment UI state
- table-player update event envelope
- table-team update event envelope
- table-message event envelope
- match-started event envelope
- table-closed event envelope

Fixture rules:

- do not use real credentials, real tokens, production URLs, or live backend/WebSocket connections
- use fake UUIDs and ISO-8601 timestamps
- use canonical teams `A` and `B`
- use canonical table states from `DOMAIN-001`
- use canonical event names from `GLOSSARY-001`
- table chat fixtures must not reuse lobby chat or match guess event names

## Tests To Add Or Update

Add frontend tests for create-table and invite flows:

- create-table entry point is visible from lobby for authenticated user
- table name is required
- table name below 3 characters is blocked
- table name above 100 characters is blocked
- exactly 3 invitees must be selected
- host cannot select self as invitee
- create-table calls `POST /api/tables`
- host route uses returned `tableId`, not locally generated ID
- invite accept sends the accepted command and routes to `/table/{tableId}`
- invite reject sends the rejected command and keeps the user in lobby
- expired invite displays a clear error or expired state

Add frontend tests for table state and chat:

- table screen subscribes to players, teams, chat, match-started, and closed destinations
- table player statuses render accepted, pending, rejected, and expired users
- malformed table event envelopes are rejected or safely ignored
- valid table chat publishes `/app/table/{tableId}/chat`
- empty table chat is blocked
- over-500-character table chat is blocked
- `TABLE_MESSAGE_POSTED` appends to table chat only

Add frontend tests for teams and start:

- host can move accepted players between Team A and Team B
- host cannot create a UI state with duplicate players if controls can prevent it
- incomplete teams keep readiness false
- non-host sees read-only team assignment
- start control is visible only to host
- start control is disabled until table is ready
- disabled start reason is visible to host
- ready table enables host start command
- `MATCH_STARTED` routes all tested users to the match setup/game boundary
- gameplay controls are not rendered by this task

Add frontend tests for close and responsive behavior:

- `TABLE_CLOSED` renders a closed/exit state and returns user to lobby where appropriate
- desktop table layout shows players/teams and chat in the accepted hierarchy
- mobile table layout keeps players/teams and chat reachable without overlap
- team assignment controls are keyboard reachable where the harness can assert it
- selected team state is visible without color alone

## Expected Failing State Before Implementation

Before `TASK-140` implementation, one or more of these may be true:

- table route or screen may be absent
- create-table may use legacy client-generated IDs or incomplete invite selection
- invite accept/reject may be only a shell from `TASK-120`
- table WebSocket event handling may be absent
- manual team assignment UI may be absent
- start control may not be host/readiness aware
- mobile table layout smoke may not exist

Expected first failures should come from missing table UI/state behavior or contract-shape mismatches. The executor must keep tests isolated from live backend services.

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

- viewport smoke is not supported yet by the Wave 1 harness, and component/store tests still cover mobile/desktop structural behavior
- backend `TASK-130` is unavailable locally and frontend tests must use contract-faithful mocks
- routing after `MATCH_STARTED` can only assert the boundary route because gameplay belongs to Wave 3
- keyboard checks need a later accessibility harness, provided controls remain semantic and visible

Deferral is not allowed for:

- using locally generated authoritative table IDs
- allowing start before valid teams and exactly 4 accepted players
- showing host-only controls to non-host users
- merging table chat with lobby chat or round guess chat
- relying on live backend/WebSocket services in component/store tests
- implementing gameplay UI inside this task
- changing accepted contracts or specs to fit existing frontend behavior
