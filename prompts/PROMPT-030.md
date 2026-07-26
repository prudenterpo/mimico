# PROMPT-030 - Execute TASK-030 Backend CI and Test-Profile Baseline

You are executing one Mimico V1 Phase 2 Wave 1 task.

Do not expand scope. This task establishes backend verification baseline only.

## Task To Execute

- Task file: `tasks/TASK-030.md`
- Test-first pack: `test-first/TEST-FIRST-030.md`

## Required Source Documents To Read First

Read these before editing files:

- `/Users/rodrigooliveira/personalProjects/mimico/docs/prd-v1.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `/Users/rodrigooliveira/personalProjects/mimico/harness/HARNESS-001-agent-execution.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/spec-map.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/TASK-GRAPH-001.md`
- `/Users/rodrigooliveira/personalProjects/mimico/tasks/TASK-030.md`
- `/Users/rodrigooliveira/personalProjects/mimico/test-first/TEST-FIRST-030.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/TEST-STRATEGY-001-test-strategy.md`
- `/Users/rodrigooliveira/personalProjects/mimico/specs/SPEC-007-deploy-observability.md`
- `/Users/rodrigooliveira/personalProjects/mimico/contracts/CONTRACTS-001-executable-contracts.md`
- `/Users/rodrigooliveira/personalProjects/mimico/docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md`
- `/Users/rodrigooliveira/personalProjects/mimico/api-mimico/pom.xml`

Also read any backend-local instructions if present.

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico/api-mimico
```

## Branch Suggestion

```text
feature/task-030-backend-ci-baseline
```

## Files And Areas Allowed

- `pom.xml`, only for test/CI dependency or plugin adjustments needed by baseline verification
- `src/test/`
- `src/main/resources/`, only for test-safe profile separation if current structure requires it
- `.github/workflows/`
- `README.md` or backend-local docs, only for verification instructions

Do not edit:

- root contracts or specs, except task-status documentation if explicitly needed
- `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Run `./mvnw test` before changing files and classify the result.
3. If tests fail, classify failures as baseline infrastructure defect, environment blocker, legacy behavior mismatch, or genuine unrelated test failure.
4. Add or repair backend CI only for compile/test baseline if appropriate.
5. Ensure Java 17 is used in CI.
6. Ensure test profile/config avoids production secrets and production-like credentials.
7. Do not implement auth, lobby, table, gameplay, reconnection, deploy, or video behavior.
8. Do not change product behavior to make legacy tests pass.

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`:

```bash
./mvnw test
```

If backend CI references root contract validation and `TASK-010` is complete, also run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Commit Rules

- Commit only from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`.
- Do not include unrelated changes.
- Commit message suggestion:

```text
Add backend CI baseline
```

## Stop Conditions

Stop and ask for review if:

- making tests pass would require changing accepted product behavior
- backend tests conflict with accepted specs and correct remediation is unclear
- a database migration or data-loss operation appears necessary
- CI requires secrets or deploy-provider decisions
- root contracts need to change
- frontend changes are needed

## Final Report

Report:

- initial `./mvnw test` result and failure classification if any
- files changed
- final verification commands run and results
- CI status if added
- documented legacy-spec mismatches
