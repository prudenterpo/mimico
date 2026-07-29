# TASK-210 - Backend Gameplay Persistence/State Tech Design

Status: Draft for Approval
Target repo: root `mimico`
Classification: `requires-tech-design`

## Objective

Produce an accepted Tech Design for the backend gameplay persistence and state architecture that TASK-220 and TASK-230 will implement.

This Tech Design must make explicit, reviewable decisions about match state storage, timer strategy, reconnection state recovery, word/dice/timer fixture strategy, and event consumption boundaries before backend gameplay implementation tasks start coding.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Completed Wave 1 (TASK-010 through TASK-040)
- Completed or locally available TASK-130
- Accepted SPEC-003, SPEC-005, TEST-STRATEGY-001
- Current `match-state.schema.json` and gameplay AsyncAPI events

## Source Documents

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/match-state.schema.json`
- `contracts/schemas/error.schema.json`
- `contracts/schemas/realtime-event-envelope.schema.json`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `tasks/TASK-130.md`
- `docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md`

## Scope

- Define match, round, and timer persistence layer.
- Define how Match, MatchPlayer, Round, WordCard entities relate to existing Table/User entities.
- Define round timer persistence and pause/resume semantics.
- Define state recovery payload shape for reconnection and refresh.
- Define deterministic word, dice, and timer fixture strategy for tests.
- Define word card generation and word selection persistence.
- Define event consumption boundaries for frontend and backend.
- Document accepted decisions that TASK-220, TASK-230, and TASK-240 must follow.
- Identify contract gaps or schema changes needed before gameplay implementation.

## Out Of Scope

- Implementing any backend or frontend gameplay code.
- Video/WebRTC, media readiness, or signaling architecture.
- Full event sourcing or CQRS architecture for V1.
- Production word database curation or word suggestion UI.
- Ranking, history, or replay features.
- Deploy provider or multi-repo E2E harness decisions.
- Changing accepted SPEC-003, SPEC-005, or contracts; only identifying gaps.

## Acceptance Criteria

- Tech Design is accepted and linked from `docs/tech-design/`.
- Match state persistence layer is defined with explicit entity/table boundaries.
- Timer persistence and pause/resume strategy is documented with concrete entity/field decisions.
- Reconnection state recovery payload is defined.
- Deterministic fixture strategy for words, dice, and timer is defined.
- Known contract gaps or schema changes are documented with IDs.
- Spec-map or EXECUTION-STATUS flags this Tech Design as active or accepted.
- TASK-220, TASK-230, and TASK-240 can reference accepted decisions from this document.

## Required Tests

Design review; no implementation pack until accepted.

## Verification

- Markdown review by Rodrigo.
- `npm run contracts:validate` if Tech Design proposes schema changes.

## Allowed Files Or Areas

- `docs/tech-design/` for the Tech Design artifact.
- `docs/EXECUTION-STATUS.md` for task status.
- `tasks/TASK-210.md` for this task file.
- `specs/spec-map.md` if a spec-map update is needed.

## Stop Conditions

Stop and ask for review if:

- Match state persistence requires a full event sourcing or CQRS decision that the task graph did not anticipate.
- Round timer strategy conflicts with accepted SPEC-005 invariants.
- Reconnection state recovery payload cannot be derived from `match-state.schema.json`.
- Tech Design would require changing accepted SPEC-003 or SPEC-005 functional behavior beyond identifying gaps.
- Multi-repo E2E harness or deploy provider work becomes entangled.

## Expected Commit / PR Notes

- Commit from `/home/rodrigopdo/personalProjects/mimico`.
- Suggested branch: `feature/task-210-gameplay-tech-design`.
- PR should mention SPEC-003, SPEC-005, TEST-STRATEGY-001, and list the accepted decisions that downstream tasks must follow.
