# PROMPT-110 - Execute TASK-110 Backend Auth, Session, Lobby Presence, and Lobby Chat

You are executing one Mimico V1 Phase 2 Wave 2 task.

Do not expand scope. This task implements backend auth/lobby behavior only.

## Task To Execute

- Task file: `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-110.md`
- Test-first pack: `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-110.md`

## Required Source Documents To Read First

Read these before editing files:

- `/Users/rodrigooliveira/personalProjects/mimico/docs/prd-v1.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `/Users/rodrigooliveira/personalProjects/mimico/harness/HARNESS-001-agent-execution.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/spec-map.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/TASK-GRAPH-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-110.md`
- `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-110.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/GLOSSARY-001-glossary-and-invariants.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/DOMAIN-001-domain-model-state-machine.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/CONTRACTS-001-executable-contracts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/openapi/mimico-v1.yaml`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/asyncapi/mimico-realtime-v1.yaml`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/error.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/realtime-event-envelope.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-001-auth-lobby.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-004-video-chat.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-007-deploy-observability.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/TEST-STRATEGY-001-test-strategy.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-030.md`

Also read any backend-local instructions if present.

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico/api-mimico
```

## Branch Suggestion

```text
feature/task-110-backend-auth-lobby
```

## Files And Areas Allowed

- `pom.xml`, only for test dependency/profile adjustments needed by this task
- `src/main/java/`, limited to auth, security/session, lobby, WebSocket config/handlers, DTOs, services, repositories, and error handling needed for this scope
- `src/main/resources/`, only for test-safe or auth/lobby configuration
- `src/test/`, limited to tests and fixtures for this scope
- `README.md` or backend-local docs, only for verification notes

Do not edit:

- `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`
- root contracts or specs, unless a missing canonical decision triggers a stop for review

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Inspect current backend auth, security, lobby, and WebSocket code before editing.
3. Treat "implement or align" as: keep compatible existing behavior, adjust divergent behavior, implement missing behavior.
4. Add tests from `TEST-FIRST-110` before or alongside implementation.
5. Implement canonical auth REST behavior for register, login, logout, and `/auth/me`.
6. Implement canonical lobby presence and lobby chat behavior.
7. Ensure errors use `ErrorResponse` and events use `{ type, data, occurredAt }`.
8. Keep lobby chat separate from table chat and future round guess chat.
9. Do not implement table setup, gameplay, video, reconnection, or deploy behavior.
10. If contracts/specs conflict with implementation needs, stop and ask for review.

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
Implement backend auth and lobby
```

## PR Flow

Prefer opening a PR for user review after the commit is ready and pushed.

PR notes should mention:

- `TASK-110`
- `TEST-FIRST-110`
- `SPEC-001`
- verification commands and results
- no frontend/table/gameplay behavior was implemented

## Stop Conditions

Stop and ask for review if:

- authentication/session model changes require a Tech Design
- accepted OpenAPI or AsyncAPI conflicts with current specs
- a new command, event name, state, or error code is needed but missing from accepted artifacts
- generated clients/types appear necessary
- test setup requires production secrets or external services
- table, gameplay, video, reconnection, root contract, or frontend changes become necessary

## Final Report

Report:

- initial code/test findings
- files changed
- tests added or updated
- verification commands run and results
- any deferrals from `TEST-FIRST-110`
- branch/commit/PR status if created
