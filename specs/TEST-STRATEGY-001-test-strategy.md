# TEST-STRATEGY-001 - Test Strategy

Status: Accepted
Date: 2026-07-26

## Overview

This document defines the Mimico V1 test strategy across backend, frontend, contracts, real-time behavior, deploy smoke, and agent execution.

This document exists because the accepted specs are only useful for AI-assisted development if agents can prove compliance. The goal is not to test everything at the same depth. The goal is to put the strongest tests around the highest-risk seams: domain state transitions, executable contracts, WebSocket events, timer/reconnection fairness, permissioned gameplay commands, and deploy readiness.

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
- `contracts/schemas/*.schema.json`
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/SPEC-006-mobile-desktop-experience.md`
- `specs/SPEC-007-deploy-observability.md`

## Strategy Principles

- Specs and contracts are the source of truth; existing tests are evidence, not authority.
- Contract tests protect frontend/backend integration before E2E tests exist.
- Domain/state-machine tests protect gameplay fairness.
- Real-time event tests validate both destination and payload envelope.
- E2E tests cover critical player journeys, not every edge case.
- Smoke tests prove deploy viability with the smallest meaningful flow.
- Every implementation task must reference the tests it adds or updates.
- A failing accepted-spec test cannot be ignored without an explicit documented deferral.

## Test Layers

| Layer | Purpose | Primary Owner | Runs |
| --- | --- | --- | --- |
| Static validation | Catch syntax, typing, formatting, contract file errors. | Both repos + root contracts | local and CI |
| Unit tests | Validate pure or isolated logic. | backend/frontend | local and CI |
| Domain/state tests | Validate table, match, round, timer, and reconnection transitions. | backend | local and CI |
| Contract tests | Validate REST, WebSocket event, and JSON payload compatibility. | root + backend + frontend | local and CI |
| Integration tests | Validate app with database/Redis or framework wiring. | backend | CI and selected local runs |
| Component tests | Validate UI state rendering and permissions. | frontend | local and CI |
| E2E tests | Validate multi-user gameplay journeys. | frontend harness against backend | CI selected and pre-release |
| Deploy smoke | Validate production demo works after deploy. | release harness | post-deploy |

## Backend Test Strategy

### Unit Tests

Backend unit tests should cover:

- word normalization
- guess correctness
- team assignment validation
- turn/mime rotation
- dice value validation
- board movement
- special tile detection
- command authorization decisions
- error mapping

Expected style:

- no database when repository behavior is not under test
- deterministic inputs
- no sleeps for timers
- explicit assertions for rejected commands

### Domain And State Tests

Domain/state tests should cover:

- table creation and invite acceptance
- host manual team assignment
- explicit match start
- initial turn dice ritual
- normal dice turn
- word card generation
- word selection
- correct guess
- special tile steal
- timeout
- immediate win on tile 52
- rematch transition
- host disconnect without host transfer
- reconnection pause/resume/forfeit

These tests should assert canonical states from `DOMAIN-001`, not implementation-only names.

### Integration Tests

Backend integration tests should cover:

- auth register/login/session behavior
- protected REST endpoints
- Flyway migrations
- Postgres repository behavior
- Redis-backed session or transient state behavior
- WebSocket authentication
- STOMP command validation where practical
- health readiness against Postgres and Redis

Preferred future tool:

- Testcontainers for Postgres and Redis when CI stability allows it

Acceptable early bridge:

- H2 for repository smoke only, if the test is explicitly not claiming production parity

## Frontend Test Strategy

### Component Tests

Frontend component tests should cover:

- auth form validation
- lobby empty/loading/error states
- invite toast actions
- table team assignment UI
- start button disabled reasons
- match dice phase eligible/ineligible views
- word selection visibility
- guessing input eligibility
- paused/reconnecting state
- final/rematch state
- mobile-safe visible hierarchy for key screens

Recommended future tool:

- Vitest + React Testing Library

### Store And Client Tests

Frontend store/client tests should cover:

- auth restore
- API client base URL behavior
- token storage/clearing
- STOMP connection state
- subscription registration and cleanup
- canonical event handling
- server snapshot replacing stale local state

### Visual/Responsive Smoke

Responsive smoke should cover:

- `360x740`
- `390x844`
- `430x932`
- `768x1024`
- `1280x800`
- `1440x900`

Minimum assertions:

- no horizontal scrolling on mobile core screens
- primary gameplay action visible
- timer visible during guessing
- chat input reachable
- paused state visible
- final state readable

Recommended future tool:

- Playwright viewport tests

## Contract Test Strategy

Contract tests must validate:

- OpenAPI YAML parses
- AsyncAPI YAML parses
- JSON Schemas parse
- sample REST payloads validate
- sample WebSocket event envelopes validate
- backend emitted event payloads match schemas
- frontend event parser accepts accepted schemas
- error responses match `error.schema.json`

Root contract validation should be runnable without starting the app.

Backend contract tests should ensure:

- REST controller responses conform to OpenAPI examples/schemas where available
- WebSocket events use canonical `{ type, data, occurredAt }` envelope
- event names match glossary and AsyncAPI

Frontend contract tests should ensure:

- API client expects accepted response shapes
- event handlers reject or safely ignore unknown event shapes
- UI does not rely on fields outside accepted contracts

## E2E Test Strategy

E2E tests should prioritize these journeys:

1. register/login and lobby restore
2. create table and invite players
3. accept/reject invite
4. host assigns teams and starts match
5. initial turn dice ritual
6. normal round correct guess
7. special tile steal
8. timeout resolves round
9. reconnect pause/resume
10. reconnection timeout forfeit
11. final screen and rematch

E2E tests should use deterministic fixtures when possible:

- known users
- known words
- controllable dice values
- controllable timer behavior
- isolated table/match per test

## Deploy Smoke Strategy

Post-deploy smoke must validate:

- frontend returns HTTP 200
- backend readiness is healthy
- register/login works
- authenticated API call works
- WebSocket connects
- lobby event is received
- table can be created
- invite can be accepted
- match can be started
- at least one match event is received

Before automation exists, this smoke can be a manual checklist. Once Playwright or equivalent is introduced, it should become executable.

## Fixtures And Test Data

Required fixture concepts:

- four valid users
- one host user
- three invitee users
- one valid table with four accepted players
- Team A with exactly two players
- Team B with exactly two players
- word set with categories `EU_SOU`, `EU_FACO`, `OBJETO`
- board with 52 tiles and accepted special tiles
- active match before dice
- active match in word selection
- active match in guessing
- paused match with reconnect deadline
- finished match with winner

Fixture rules:

- fixtures must use canonical names from glossary
- tests must not depend on random dice unless randomness itself is under test
- tests must not depend on wall-clock sleeps for 60-second reconnection windows
- selected mime word should not appear in broad logs or non-mime UI fixtures

## CI Gate Strategy

Initial CI gates:

- root contract file validation
- backend compile
- backend tests
- frontend dependency install
- frontend build

Expanded CI gates:

- backend integration tests with Postgres/Redis
- frontend component tests
- contract conformance tests
- Playwright E2E smoke
- deploy smoke for production demo

Merge should be blocked when:

- accepted contract validation fails
- accepted-spec tests fail
- backend compile fails
- frontend build fails
- a task modifies behavior without adding/updating relevant tests or documenting deferral

Release should be blocked when:

- production demo deploy fails
- post-deploy smoke fails
- production secrets are committed
- contracts drift from deployed behavior
- critical known UX states are untested or broken

## Agent Task Requirements

Every implementation task must include:

- referenced spec IDs
- referenced contract IDs or schema files
- test files to add or update
- local verification commands
- CI gate affected
- manual QA steps only when automation is not yet practical

Agents must stop and ask for review when:

- a spec and existing test disagree
- implementation requires changing accepted contract
- test requires weakening an accepted invariant
- deploy smoke cannot be run due to missing environment
- a required test is infeasible without a new harness decision

## Current Test Inventory

Backend current inventory:

- repository tests exist for legacy game/card/team repositories
- service tests exist for chat validation and reconnection
- WebSocket auth interceptor test exists
- application context smoke test exists

Frontend current inventory:

- no first-party frontend test harness was found

Root current inventory:

- executable contract files exist
- no committed contract validation script was found

## Known Test Gaps

These are not implementation tasks yet; they are future task inputs.

| Current Gap | Strategy Target |
| --- | --- |
| Reconnection tests still expect legacy 1-hour/3600-second behavior in at least one assertion. | Accepted reconnection tests should assert 60 seconds from `SPEC-005`. |
| Backend tests do not yet cover canonical event envelopes broadly. | WebSocket events should be contract-tested against schemas. |
| Frontend has no component/store/E2E harness. | Add frontend test harness before large UI rewrites. |
| No root contract validation script exists. | Add executable validation for OpenAPI, AsyncAPI, and JSON Schema files. |
| No multi-user E2E harness exists. | Add deterministic E2E fixtures for four-player flows. |
| No deploy smoke checklist or automation exists. | Add manual checklist first, then automate. |
| Test profile properties are commented out. | Define stable backend test profile strategy. |
| Current tests may encode legacy behavior. | Existing tests must be reconciled against accepted specs before being treated as merge gates. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, tests, contracts, and later Tech Design.

| ID | Decision |
| --- | --- |
| `TEST-STRATEGY-001-AD-001` | Treat accepted specs/contracts as authority when existing tests disagree. |
| `TEST-STRATEGY-001-AD-002` | Add contract validation before broad implementation work. |
| `TEST-STRATEGY-001-AD-003` | Add frontend component/store harness before major UI rewrites. |
| `TEST-STRATEGY-001-AD-004` | Use deterministic fixtures for dice, timer, users, words, and match state. |
| `TEST-STRATEGY-001-AD-005` | Allow manual post-deploy smoke initially, but require it to be explicit and later automatable. |
