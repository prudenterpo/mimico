# TEST-FIRST-040 - Frontend Test Harness Baseline

Status: Draft for Approval
Linked task IDs:

- `TASK-040`

## Behavior Under Test

The frontend repository must have a known production build command and a minimal first-party test harness before major UI/client implementation begins.

The baseline must prove:

- frontend production build can be invoked with `npm run build`
- a stable test command exists, preferably `npm test`
- the harness can run at least one isolated baseline test when practical
- future component, store, client, event parser, responsive, and accessibility tests can be added without live backend services
- no feature UI implementation is included in this harness task

## Fixtures Required

Use minimal local test fixtures only.

Allowed fixture concepts:

- a trivial component or utility fixture if needed to prove the harness runs
- mocked API responses
- mocked STOMP events
- mocked media APIs for future compatibility, if the harness setup needs browser API shims

Fixture rules:

- do not require a live backend
- do not require real WebSocket connections
- do not require real camera/microphone access
- do not include real user credentials, tokens, or production URLs

## Tests To Add Or Update

Before changing anything, run and record:

- `npm run build`

Then add the smallest useful frontend test harness aligned with `TEST-STRATEGY-001`.

Recommended direction:

- Vitest plus React Testing Library, unless the existing frontend stack clearly points elsewhere
- a stable `npm test` script
- test environment suitable for React components and browser-like APIs
- one baseline test only if needed to prove the harness command works

Future-oriented harness capabilities should support later tests for:

- auth form validation
- lobby loading/empty/error states
- invite toast actions
- table team assignment UI
- match eligibility views
- paused/reconnecting state
- event envelope parsing
- mobile-safe visible hierarchy

Do not add broad feature tests before their task-specific test-first packs exist.

## Expected Failing State Before Implementation

Before `TASK-040` implementation:

- frontend has `dev`, `build`, and `start` scripts
- frontend has no first-party test script
- `npm test` is expected to fail because it is not defined
- frontend build may pass or fail; executor must record the actual result
- no component/store/client harness exists for later Wave 2 and Wave 3 tasks

The expected first failure is missing test command, not necessarily a build failure.

## Required Verification Command

Run from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`:

```bash
npm ci
npm run build
npm test
```

If the package manager lockfile or install command differs, use the existing frontend package manager convention and document the reason.

If `TASK-010` is complete and frontend contract fixtures are touched, run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Deferral Rules

Deferral is allowed when:

- dependency installation is blocked by network restrictions and cannot be approved during execution
- the existing build fails for a reason unrelated to the test harness and must be handled by a separate task
- adding the harness reveals a framework compatibility issue requiring review
- browser API shims for media/WebSocket need a later feature-specific setup

Deferral is not allowed for:

- adding a test script that does not run anything meaningful
- depending on live backend services for baseline tests
- redesigning screens as part of harness setup
- implementing auth/lobby/table/gameplay behavior in this task
- introducing generated API clients/types
