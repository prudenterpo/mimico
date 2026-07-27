# TASK-010 - Root Contract Validation and CI

Status: Draft for Approval
Target repo: root `mimico`
Autonomy level: Level 1 - Single Task

## Agent Entry Instructions

Execute this task file directly. Before editing files, read and follow `harness/AGENT-ENTRY-INSTRUCTIONS.md`.

## Objective

Implement the first executable harness layer in the root repository: contract validation tooling, sample payload validation, and root CI for contracts.

This task must modify only the root documentation/contract repository. It must not implement backend or frontend product behavior.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Accepted `docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md`

## Source Documents

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/*.schema.json`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `specs/SPEC-007-deploy-observability.md`
- `docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md`

## Scope

- Add root Node tooling for contract validation.
- Add stable root scripts:
  - `contracts:validate`
  - `contracts:validate:openapi`
  - `contracts:validate:asyncapi`
  - `ci`
- Add a validation script that parses OpenAPI, parses AsyncAPI, compiles JSON Schemas, validates representative samples, prints concise success output, and exits non-zero on failure.
- Add representative sample payloads for existing schemas.
- Add root CI workflow for contract validation on push and pull request.
- Update root planning/harness/spec-map docs only if a new executable command or gate must be recorded.

## Out Of Scope

- Backend implementation or backend CI.
- Frontend implementation or frontend CI.
- Generated API clients or generated TypeScript types.
- Deploy provider selection.
- Full semantic coverage of every future contract field.
- Changing accepted product behavior to satisfy tooling.

## Acceptance Criteria

- Root `package.json` exists with stable validation scripts.
- Root lockfile exists and is committed with the task.
- `tools/validate-contracts.mjs` or equivalent root validation script exists.
- OpenAPI contract parses and is validated/linted by the chosen tool.
- AsyncAPI contract parses or validates through the script wrapper.
- Every `contracts/schemas/*.schema.json` file compiles with AJV or accepted equivalent.
- Sample payloads validate against the intended schemas.
- Failure output includes the relevant file or sample and a concise reason.
- `.github/workflows/contracts.yml` runs root contract validation on push and pull request.
- `npm run contracts:validate` succeeds locally.
- `npm run ci` succeeds locally.

## Required Tests

This task will later receive `TEST-FIRST-010`.

Required coverage intent:

- validation command succeeds for accepted contract files and valid samples
- validation command fails on invalid sample/schema when manually checked or covered by script behavior
- CI invokes the same validation command agents use locally

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm ci
npm run contracts:validate
npm run ci
```

If dependency installation is blocked by network restrictions, record the exact failure and rerun only after approved access.

## Allowed Files Or Areas

- `package.json`
- `package-lock.json`
- `tools/`
- `contracts/samples/`
- `.github/workflows/contracts.yml`
- `harness/HARNESS-001-agent-execution.md`, only if a new executable command or gate must be documented
- `specs/spec-map.md`, only if status/link metadata must be corrected

## Stop Conditions

Stop and ask for review if:

- OpenAPI, AsyncAPI, or JSON Schema files conflict with accepted specs.
- Tooling requires weakening an accepted contract or invariant.
- AsyncAPI tooling cannot support the accepted file shape without a design adjustment.
- Generated clients/types appear necessary.
- Validation would require backend or frontend code to run.


## Expected Commit / PR Notes

- Commit from root repo only.
- Suggested branch: `feature/task-010-contract-validation`.
- PR should mention `TECH-DESIGN-001`, list validation commands run, and state that backend/frontend repos were not modified.
