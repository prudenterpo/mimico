# TASK-030 - Backend CI and Test-Profile Baseline

Status: Draft for Approval
Target repo: backend `api-mimico`
Autonomy level: Level 1 - Single Task

## Objective

Establish the backend repository's baseline verification path before feature implementation begins.

This task should make backend compile/test expectations explicit and prepare CI/test-profile work without changing accepted product behavior.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Prefer `TASK-010` completed first so root contract validation is an available upstream gate.

## Source Documents

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `specs/SPEC-007-deploy-observability.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md`
- `api-mimico/pom.xml`

## Scope

- Inspect and document the current backend test/CI baseline.
- Make `./mvnw test` the initial backend verification command unless execution proves it is not viable.
- Add or adjust backend CI only for compile/test baseline if the repository lacks an accepted workflow.
- Define a stable backend test-profile strategy when current tests need environment isolation.
- Reconcile obvious infrastructure-only test failures with accepted specs, without changing product behavior.
- Document any legacy tests that encode behavior contradicted by accepted specs so later feature tasks do not treat them as authority.

## Out Of Scope

- Auth, lobby, table, gameplay, reconnection, deploy, or video feature implementation.
- Contract expansion in root.
- Frontend work.
- Database migrations with product semantics.
- Rewriting legacy tests to new feature behavior before the matching feature task exists.
- Adding Testcontainers unless the task can do so without broad scope or environment instability.

## Acceptance Criteria

- Backend repo has a documented baseline verification command.
- `./mvnw test` succeeds, or failures are clearly classified as accepted-spec legacy failures, environment blockers, or real baseline defects.
- Backend CI exists or has a concrete follow-up note if CI cannot be safely added yet.
- Test profile behavior avoids production secrets and avoids hardcoded production credentials.
- Any CI workflow uses Java 17.
- No backend product behavior is changed.
- No root or frontend files are changed except for task-status documentation if explicitly needed.

## Required Tests

This task will later receive `TEST-FIRST-030`.

Required coverage intent:

- backend baseline test command is executable
- backend CI invokes the same baseline command
- test profile uses safe local/test configuration
- legacy behavior mismatches are documented rather than silently blessed

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`:

```bash
./mvnw test
```

If a backend CI workflow is added, also verify its command locally where practical.

If `TASK-010` is already complete and backend CI references root contracts, run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Allowed Files Or Areas

- `api-mimico/pom.xml`, only for test/CI dependency or plugin adjustments needed by baseline verification
- `api-mimico/src/test/`
- `api-mimico/src/main/resources/`, only for test-safe profile separation if current structure requires it
- `api-mimico/.github/workflows/`
- `api-mimico/README.md` or backend-local docs, only for verification instructions

## Stop Conditions

Stop and ask for review if:

- making tests pass would require changing accepted product behavior
- backend tests conflict with accepted specs and the correct remediation is unclear
- a database migration or data-loss operation appears necessary
- CI requires secrets or deploy-provider decisions
- root contracts need to change
- frontend changes are needed

## Expected Commit / PR Notes

- Commit from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`.
- Suggested branch: `feature/task-030-backend-ci-baseline`.
- PR should include the backend verification command, result, CI status if added, and any documented legacy-spec mismatches.
