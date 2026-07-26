# PROMPT-130 - Execute TASK-130 Backend Table, Invites, Manual Teams, and Explicit Start

You are executing one Mimico V1 Phase 2 Wave 2 task.

Do not expand scope. This task implements backend table setup behavior only and stops at match setup creation.

## Task To Execute

- Task file: `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-130.md`
- Test-first pack: `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-130.md`

## Required Source Documents To Read First

Read these before editing files:

- `/Users/rodrigooliveira/personalProjects/mimico/docs/prd-v1.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `/Users/rodrigooliveira/personalProjects/mimico/harness/HARNESS-001-agent-execution.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/spec-map.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/TASK-GRAPH-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-130.md`
- `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-130.md`
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
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-007-deploy-observability.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/TEST-STRATEGY-001-test-strategy.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-110.md`

Also read any backend-local instructions if present.

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico/api-mimico
```

## Branch Suggestion

```text
feature/task-130-backend-table-setup
```

## Files And Areas Allowed

- `pom.xml`, only for test dependency/profile adjustments needed by this task
- `src/main/java/`, limited to table, invite, team assignment, match-start, WebSocket, DTO, service, repository, domain mapping, and error handling needed for this scope
- `src/main/resources/`, only for test-safe or table/match-start configuration
- `src/test/`, limited to tests and fixtures for this scope
- `README.md` or backend-local docs, only for verification notes

Do not edit:

- `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`
- root contracts or specs, unless a missing canonical decision triggers a stop for review

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Inspect current backend table, invite, team, match-start, and WebSocket code before editing.
3. Treat "implement or align" as: keep compatible existing behavior, adjust divergent behavior, implement missing behavior.
4. Add tests from `TEST-FIRST-130` before or alongside implementation.
5. Implement canonical private table creation with backend-generated `tableId`.
6. Implement host invites, invite expiration, accept/reject, table player updates, and table close/leave behavior.
7. Implement table chat through `/app/table/{tableId}/chat`, separate from lobby and future round guess chat.
8. Implement host-only manual team assignment and derived `TABLE_READY_TO_START`.
9. Implement explicit host match start with `teamAssignments` and match-player team snapshot.
10. Stop at `MATCH_SETUP`/match creation boundary; do not implement gameplay.
11. Ensure errors use `ErrorResponse` and events use `{ type, data, occurredAt }`.
12. If current backend start-match behavior only accepts `playerIds`, align it to the accepted contract.

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`:

```bash
./mvnw test
```

Run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Commit Rules

- Commit only from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`.
- Do not include unrelated changes.
- Commit message suggestion:

```text
Implement backend table setup
```

## PR Flow

Prefer opening a PR for user review after the commit is ready and pushed.

PR notes should mention:

- `TASK-130`
- `TEST-FIRST-130`
- `SPEC-002`
- verification commands and results
- dependency on `TASK-110`
- gameplay beyond match creation was not implemented

## Stop Conditions

Stop and ask for review if:

- match state persistence strategy beyond match-start snapshot is required
- `POST /api/matches/start` contract conflicts with existing backend model in a way that needs a Tech Design
- new event names, table states, invite statuses, or team values are needed
- generated clients/types become necessary
- table changes require frontend changes in the same PR
- active-match reconnection or gameplay behavior becomes necessary
- root contracts need to change beyond accepted `CONTRACT-GAP-001/002` resolution

## Final Report

Report:

- initial code/test findings
- files changed
- tests added or updated
- verification commands run and results
- any deferrals from `TEST-FIRST-130`
- branch/commit/PR status if created
