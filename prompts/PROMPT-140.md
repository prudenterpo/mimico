# PROMPT-140 - Execute TASK-140 Frontend Table Setup and Team Assignment

You are executing one Mimico V1 Phase 2 Wave 2 task.

Do not expand scope. This task implements frontend table setup behavior only and stops at the match setup boundary.

## Task To Execute

- Task file: `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-140.md`
- Test-first pack: `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-140.md`

## Required Source Documents To Read First

Read these before editing files:

- `/Users/rodrigooliveira/personalProjects/mimico/docs/prd-v1.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `/Users/rodrigooliveira/personalProjects/mimico/harness/HARNESS-001-agent-execution.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/spec-map.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/TASK-GRAPH-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-140.md`
- `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-140.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/GLOSSARY-001-glossary-and-invariants.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/DOMAIN-001-domain-model-state-machine.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/CONTRACTS-001-executable-contracts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/openapi/mimico-v1.yaml`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/asyncapi/mimico-realtime-v1.yaml`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/error.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/team-assignment.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/realtime-event-envelope.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/CONTRACT-EXPANSION-BACKLOG-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-001-auth-lobby.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-002-table-teams.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-004-video-chat.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-006-mobile-desktop-experience.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/TEST-STRATEGY-001-test-strategy.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-120.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-130.md`

Also read any frontend-local instructions if present.

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico/mimico-game
```

## Branch Suggestion

```text
feature/task-140-frontend-table-setup
```

## Files And Areas Allowed

- `package.json`, only for scripts/dependencies needed by tests or table integration
- `package-lock.json` or existing lockfile
- `src/`, limited to table setup, invite handling, table API/STOMP client, table state, table UI, tests, and fixtures
- `app/`, limited to lobby-to-table routing and table routes/layouts
- `test/`, `tests/`, or equivalent
- `README.md`, only for verification notes

Do not edit:

- `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`
- root contracts or specs, unless a missing canonical decision triggers a stop for review

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Inspect current frontend lobby, invite, routing, table, state, API, and STOMP patterns.
3. Treat "implement or align" as: keep compatible existing behavior, adjust divergent behavior, implement missing behavior.
4. Add tests from `TEST-FIRST-140` before or alongside implementation.
5. Implement create-table UI with valid table name and exactly 3 selected invitees.
6. Use the backend-generated `tableId`; do not generate authoritative IDs locally.
7. Complete invite accept/reject flow from lobby notification.
8. Implement table screen, status rendering, table subscriptions, table chat, and canonical event-envelope parsing.
9. Implement host manual team assignment, non-host read-only teams, readiness, disabled reason, and explicit start.
10. Route on `MATCH_STARTED` to the match setup/game boundary only; do not implement gameplay.
11. Implement `TABLE_CLOSED` handling.
12. Keep tests isolated from live backend services.

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

## Commit Rules

- Commit only from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`.
- Do not include unrelated changes.
- Commit message suggestion:

```text
Implement frontend table setup
```

## PR Flow

Prefer opening a PR for user review after the commit is ready and pushed.

PR notes should mention:

- `TASK-140`
- `TEST-FIRST-140`
- `SPEC-002`
- `SPEC-006`
- `PRODUCT-DESIGN-001`
- verification commands and results
- dependency on `TASK-130`
- gameplay UI was not implemented

## Stop Conditions

Stop and ask for review if:

- frontend state architecture overhaul is required before proceeding
- generated API clients/types become necessary
- `TASK-130` behavior or accepted contracts are not available
- table setup cannot route to match setup without implementing gameplay
- mobile layout requirements require broader visual-system work from Wave 6
- root contracts or backend code need to change
- video, reconnection, or gameplay state becomes necessary

## Final Report

Report:

- initial code/test findings
- files changed
- tests added or updated
- verification commands run and results
- any deferrals from `TEST-FIRST-140`
- branch/commit/PR status if created
