# TASK-040 - Frontend Test Harness Baseline

Status: Draft for Approval
Target repo: frontend `mimico-game`
Autonomy level: Level 1 - Single Task

## Objective

Establish the frontend repository's baseline verification and test harness before major UI or client-state implementation begins.

This task should make frontend build/test expectations explicit and introduce a minimal first-party test path aligned with `TEST-STRATEGY-001`.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Prefer `TASK-010` completed first so root contract validation is an available upstream gate.

## Source Documents

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `specs/SPEC-006-mobile-desktop-experience.md`
- `docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `mimico-game/package.json`

## Scope

- Inspect and document the current frontend build baseline.
- Keep `npm run build` as the initial production build verification command.
- Add a minimal first-party frontend test harness suitable for component/store/client tests.
- Add stable script names for future agents, such as `test`, if the chosen harness supports them.
- Add a small baseline test only if needed to prove the harness runs.
- Prepare the ground for later component, store, event parser, responsive, and accessibility tests.
- Do not redesign screens or implement feature behavior.

## Out Of Scope

- Auth/lobby/table/gameplay UI implementation.
- Visual system redesign.
- Playwright multi-user E2E harness.
- Video/WebRTC implementation.
- Backend or root contract edits.
- Generated API clients/types.
- Large dependency or framework migration.

## Acceptance Criteria

- Frontend build command is documented and runnable.
- `npm run build` succeeds, or any failure is classified with exact cause and follow-up.
- A minimal frontend test harness exists and can be run locally.
- Test harness choice supports future component/store/client tests from `TEST-STRATEGY-001`.
- Added tests avoid depending on live backend services.
- No product behavior or accepted UI flow is changed.
- No root or backend files are changed except for task-status documentation if explicitly needed.

## Required Tests

This task will later receive `TEST-FIRST-040`.

Required coverage intent:

- test harness command runs
- at least one baseline test demonstrates the harness is wired correctly, if practical
- future tests can mock API/STOMP/media behavior without live services
- build remains the primary frontend verification gate until broader tests exist

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`:

```bash
npm ci
npm run build
npm test
```

If `npm test` does not exist before the task starts, it should exist by the end unless a blocker is documented.

If `TASK-010` is complete and frontend fixtures/contracts are touched, run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

## Allowed Files Or Areas

- `mimico-game/package.json`
- `mimico-game/package-lock.json` or existing package manager lockfile
- `mimico-game/vitest.config.*`, `jest.config.*`, or equivalent chosen test config
- `mimico-game/src/`
- `mimico-game/app/`, only for non-behavioral test harness compatibility if needed
- `mimico-game/test/`, `mimico-game/tests/`, or equivalent
- `mimico-game/README.md`, only for verification instructions

## Stop Conditions

Stop and ask for review if:

- adding the harness requires a framework migration
- dependency installation is blocked and cannot be approved
- build failure requires changing product behavior or accepted routing behavior
- generated clients/types become necessary
- root contracts need to change
- backend changes are needed

## Expected Commit / PR Notes

- Commit from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`.
- Suggested branch: `feature/task-040-frontend-test-harness`.
- PR should include the chosen harness, verification commands, results, and note that no feature UI implementation was included.
