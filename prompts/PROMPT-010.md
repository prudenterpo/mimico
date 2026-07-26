# PROMPT-010 - Execute TASK-010 Root Contract Validation and CI

You are executing one Mimico V1 Phase 2 Wave 1 task.

Do not expand scope. Do not implement backend or frontend product behavior.

## Task To Execute

- Task file: `tasks/TASK-010.md`
- Test-first pack: `test-first/TEST-FIRST-010.md`

## Required Source Documents To Read First

Read these before editing files:

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `docs/TASK-GRAPH-001.md`
- `tasks/TASK-010.md`
- `test-first/TEST-FIRST-010.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/*.schema.json`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `specs/SPEC-007-deploy-observability.md`
- `docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md`

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico
```

## Branch Suggestion

```text
feature/task-010-contract-validation
```

## Files And Areas Allowed

- `package.json`
- `package-lock.json`
- `tools/`
- `contracts/samples/`
- `.github/workflows/contracts.yml`
- `harness/HARNESS-001-agent-execution.md`, only if a new executable command or gate must be documented
- `specs/spec-map.md`, only if status/link metadata must be corrected

Do not edit:

- `api-mimico/`
- `mimico-game/`

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Inspect current contract files and schema shapes.
3. Implement root Node validation tooling according to `TECH-DESIGN-001`.
4. Add representative contract samples required by `TEST-FIRST-010`.
5. Add root CI workflow for contract validation.
6. Keep script names stable:
   - `contracts:validate`
   - `contracts:validate:openapi`
   - `contracts:validate:asyncapi`
   - `ci`
7. Do not weaken accepted contracts or invariants to satisfy tooling.
8. If validation exposes a spec/contract conflict, stop and ask for review.

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm ci
npm run contracts:validate
npm run ci
```

If dependency installation is blocked by network restrictions, request approval for the install/network step and record the exact failure if it still cannot run.

## Commit Rules

- Commit only from the root repo.
- Do not include unrelated changes.
- Commit message suggestion:

```text
Add root contract validation and CI
```

## Stop Conditions

Stop and ask for review if:

- OpenAPI, AsyncAPI, or JSON Schema files conflict with accepted specs
- tooling requires weakening an accepted contract or invariant
- AsyncAPI tooling cannot support the accepted file shape without a design adjustment
- generated clients/types appear necessary
- validation would require backend or frontend code to run

## Final Report

Report:

- files changed
- validation commands run and results
- any dependency/tooling caveats
- whether backend/frontend repos remained untouched
