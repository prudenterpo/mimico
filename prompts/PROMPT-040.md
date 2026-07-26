# PROMPT-040 - Execute TASK-040 Frontend Test Harness Baseline

You are executing one Mimico V1 Phase 2 Wave 1 task.

Do not expand scope. This task establishes frontend build/test harness baseline only.

## Task To Execute

- Task file: `tasks/TASK-040.md`
- Test-first pack: `test-first/TEST-FIRST-040.md`

## Required Source Documents To Read First

Read these before editing files:

- `/Users/rodrigooliveira/personalProjects/mimico/docs/prd-v1.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `/Users/rodrigooliveira/personalProjects/mimico/harness/HARNESS-001-agent-execution.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/spec-map.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/TASK-GRAPH-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-040.md`
- `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-040.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/TEST-STRATEGY-001-test-strategy.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-006-mobile-desktop-experience.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/CONTRACTS-001-executable-contracts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/mimico-game/package.json`

Also read any frontend-local instructions if present.

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico/mimico-game
```

## Branch Suggestion

```text
feature/task-040-frontend-test-harness
```

## Files And Areas Allowed

- `package.json`
- `package-lock.json` or existing package manager lockfile
- `vitest.config.*`, `jest.config.*`, or equivalent chosen test config
- `src/`
- `app/`, only for non-behavioral test harness compatibility if needed
- `test/`, `tests/`, or equivalent
- `README.md`, only for verification instructions

Do not edit:

- root contracts or specs, except task-status documentation if explicitly needed
- `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Run `npm run build` before changing files and record the result.
3. Confirm `npm test` is absent or current state before adding a harness.
4. Add the smallest useful first-party frontend test harness aligned with `TEST-STRATEGY-001`.
5. Prefer Vitest plus React Testing Library unless existing stack clearly points elsewhere.
6. Add a stable `npm test` script.
7. Add one baseline test only if needed to prove the harness command works.
8. Do not redesign screens or implement auth/lobby/table/gameplay behavior.
9. Do not introduce generated API clients/types.

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`:

```bash
npm ci
npm run build
npm test
```

If package manager conventions differ, use the existing convention and document why.

If frontend contract fixtures are touched and `TASK-010` is complete, also run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Commit Rules

- Commit only from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`.
- Do not include unrelated changes.
- Commit message suggestion:

```text
Add frontend test harness baseline
```

## Stop Conditions

Stop and ask for review if:

- adding the harness requires a framework migration
- dependency installation is blocked and cannot be approved
- build failure requires changing product behavior or accepted routing behavior
- generated clients/types become necessary
- root contracts need to change
- backend changes are needed

## Final Report

Report:

- initial `npm run build` result
- chosen test harness
- files changed
- final verification commands run and results
- any build/harness caveats
