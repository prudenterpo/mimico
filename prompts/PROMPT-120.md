# PROMPT-120 - Execute TASK-120 Frontend Auth and Lobby Integration

You are executing one Mimico V1 Phase 2 Wave 2 task.

Do not expand scope. This task implements frontend auth/lobby behavior only.

## Task To Execute

- Task file: `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-120.md`
- Test-first pack: `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-120.md`

## Required Source Documents To Read First

Read these before editing files:

- `/Users/rodrigooliveira/personalProjects/mimico/docs/prd-v1.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `/Users/rodrigooliveira/personalProjects/mimico/harness/HARNESS-001-agent-execution.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/spec-map.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/TASK-GRAPH-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-120.md`
- `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-120.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/GLOSSARY-001-glossary-and-invariants.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/CONTRACTS-001-executable-contracts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/openapi/mimico-v1.yaml`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/asyncapi/mimico-realtime-v1.yaml`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/error.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/schemas/realtime-event-envelope.schema.json`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-001-auth-lobby.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-004-video-chat.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-006-mobile-desktop-experience.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/TEST-STRATEGY-001-test-strategy.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-040.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-110.md`

Also read any frontend-local instructions if present.

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico/mimico-game
```

## Branch Suggestion

```text
feature/task-120-frontend-auth-lobby
```

## Files And Areas Allowed

- `package.json`, only for scripts/dependencies needed by tests or client integration
- `package-lock.json` or existing lockfile
- `src/`, limited to auth, API client, WebSocket/STOMP client, lobby state, lobby UI, invite notification shell, tests, and fixtures
- `app/`, limited to auth/lobby routes and layouts
- `test/`, `tests/`, or equivalent
- `README.md`, only for verification notes

Do not edit:

- `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`
- root contracts or specs, unless a missing canonical decision triggers a stop for review

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Inspect current frontend routes, auth state, API client, and WebSocket/STOMP patterns.
3. Treat "implement or align" as: keep compatible existing behavior, adjust divergent behavior, implement missing behavior.
4. Add tests from `TEST-FIRST-120` before or alongside implementation.
5. Implement register, login, logout, token restore, protected lobby, and auth-state clearing.
6. Implement lobby STOMP connection after auth, lobby join, online-users handling, and lobby chat.
7. Implement `TABLE_INVITE_RECEIVED` notification shell only as far as `TASK-120` allows.
8. Keep mocked tests isolated from live backend services.
9. Do not implement table setup, gameplay, video, reconnection, or deploy behavior.
10. If backend contracts or `TASK-110` behavior are missing, use contract-faithful mocks or stop if implementation cannot proceed safely.

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
Implement frontend auth and lobby
```

## PR Flow

Prefer opening a PR for user review after the commit is ready and pushed.

PR notes should mention:

- `TASK-120`
- `TEST-FIRST-120`
- `SPEC-001`
- `SPEC-006`
- `PRODUCT-DESIGN-001`
- verification commands and results
- dependency on `TASK-110`

## Stop Conditions

Stop and ask for review if:

- frontend state architecture overhaul is required before proceeding
- generated API clients/types become necessary
- accepted backend contracts are missing or conflict with `TASK-110`
- table accept/reject behavior cannot be represented without implementing `TASK-140`
- WebSocket authentication requires backend contract changes
- root contracts or backend code need to change
- visual requirements require a broader design-system task

## Final Report

Report:

- initial code/test findings
- files changed
- tests added or updated
- verification commands run and results
- any deferrals from `TEST-FIRST-120`
- branch/commit/PR status if created
