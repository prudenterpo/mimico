# TEST-FIRST-030 - Backend CI and Test-Profile Baseline

Status: Draft for Approval
Linked task IDs:

- `TASK-030`

## Behavior Under Test

The backend repository must have a known, repeatable baseline verification path before feature implementation begins.

The baseline must prove:

- backend tests can be invoked with a stable command
- backend CI, if added, uses Java 17 and runs the same baseline command
- test configuration does not require production secrets
- legacy tests that contradict accepted specs are identified rather than treated as V1 authority
- no product behavior changes are required merely to establish the baseline

## Fixtures Required

Use existing backend test fixtures only.

If test-profile fixtures are needed, they must be safe local/test values:

- fake JWT secret
- local or in-memory datasource configuration only for tests
- no production database URL
- no production Redis host
- no real user credentials

No four-player gameplay fixtures are required for this baseline task.

## Tests To Add Or Update

Before changing anything, run and record:

- `./mvnw test`

If the command fails, classify each failure as:

- baseline infrastructure defect
- environment blocker
- legacy behavior mismatch against accepted specs
- genuine test failure unrelated to this planning wave

Possible updates for this task:

- add or repair backend CI workflow that runs `./mvnw test`
- add or adjust test profile configuration so tests do not use production-like secrets
- add a tiny test-profile smoke only if needed to prove safe configuration
- document legacy tests that should be reconciled by later feature tasks

Do not add accepted-spec feature tests for auth, table, gameplay, reconnection, video, or deploy behavior in this task unless they are strictly necessary for baseline verification.

## Expected Failing State Before Implementation

Before `TASK-030` implementation, one or more of these may be true:

- backend CI baseline is absent or not aligned with Phase 2 gates
- `./mvnw test` may fail due to environment/test-profile issues
- current tests may encode legacy behavior contradicted by accepted specs
- backend verification command may not be documented for future agents

The expected failing state is unknown until the first `./mvnw test` run; the executor must classify the result rather than assume failure cause.

## Required Verification Command

Run from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`:

```bash
./mvnw test
```

If CI workflow files are added, verify locally that the same command is what CI invokes.

If `TASK-010` is complete and backend CI references root contracts, run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Deferral Rules

Deferral is allowed when:

- tests require external services that are not available and no safe local/test profile exists yet
- fixing a failing test would require implementing a future feature task
- a legacy test conflicts with accepted specs and should be reconciled by the matching feature task
- CI requires repository secrets or deploy-provider decisions outside this task

Deferral is not allowed for:

- ignoring a failing `./mvnw test` result without classification
- committing production secrets or production-like credentials
- changing product behavior just to make old tests pass
- adding CI that does not run the documented backend baseline command
