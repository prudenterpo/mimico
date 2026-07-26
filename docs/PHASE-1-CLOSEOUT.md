# PHASE-1-CLOSEOUT - Specification and Harness Intent

Status: Accepted
Date: 2026-07-26

## Purpose

This document closes Phase 1 of Mimico V1.

Phase 1 produced the product, domain, contract, functional specification, test strategy, and initial harness design needed before execution planning. It intentionally stops before generating implementation task files, test-first packs, implementation prompts, or agent work packages.

## Phase Boundary

Phase 1 includes:

- product definition
- workflow decision
- initial agent harness intent
- canonical glossary and invariants
- domain model and state machines
- executable contracts
- functional specs
- product design direction
- test strategy
- first technical design for contract validation and CI

Phase 1 does not include:

- executable task graph
- individual task files
- test-first implementation packs
- implementation prompts
- multi-agent execution plan
- production deploy
- code implementation

## Accepted Artifacts

| Artifact | Path | Status |
| --- | --- | --- |
| `PRD-001` | `docs/prd-v1.md` | Accepted |
| `ADR-001` | `docs/adr/ADR-001-ai-assisted-sdd-workflow.md` | Accepted |
| `SPEC-MAP-001` | `specs/spec-map.md` | Active |
| `GLOSSARY-001` | `specs/GLOSSARY-001-glossary-and-invariants.md` | Accepted |
| `DOMAIN-001` | `specs/DOMAIN-001-domain-model-state-machine.md` | Accepted |
| `CONTRACTS-001` | `contracts/CONTRACTS-001-executable-contracts.md` | Accepted |
| `SPEC-001` | `specs/SPEC-001-auth-lobby.md` | Accepted |
| `SPEC-002` | `specs/SPEC-002-table-teams.md` | Accepted |
| `SPEC-003` | `specs/SPEC-003-match-gameplay.md` | Accepted |
| `SPEC-004` | `specs/SPEC-004-video-chat.md` | Accepted |
| `SPEC-005` | `specs/SPEC-005-reconnection-recovery.md` | Accepted |
| `SPEC-006` | `specs/SPEC-006-mobile-desktop-experience.md` | Accepted |
| `SPEC-007` | `specs/SPEC-007-deploy-observability.md` | Accepted |
| `PRODUCT-DESIGN-001` | `docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md` | Accepted |
| `TEST-STRATEGY-001` | `specs/TEST-STRATEGY-001-test-strategy.md` | Accepted |
| `TECH-DESIGN-001` | `docs/tech-design/TECH-DESIGN-001-contract-validation-and-ci.md` | Accepted |

## Baseline Harness Artifact

`harness/HARNESS-001-agent-execution.md` remains the baseline agent execution harness from Phase 1.

It is intentionally still allowed to evolve in Phase 2 because the concrete task graph, CI commands, and test-first packs will turn parts of the harness from policy into executable checks.

Phase 2 should update `HARNESS-001` only when:

- a new required command is introduced
- a task gate becomes executable
- a stop condition changes
- multi-agent orchestration rules become concrete

## Key Accepted Decisions

- Specs and contracts are authority when legacy tests or implementation disagree.
- Domain states and executable contracts must guide implementation tasks.
- Functional specs are complete enough for V1 execution planning.
- Visual system and screen layout direction are accepted as V1 quality bar, not post-MVP polish.
- Additional Tech Designs should be created only when the task graph identifies a risky technical area.
- Root contract validation and CI are the first executable harness implementation target.
- Task graph, task files, test-first packs, and prompts belong to Phase 2.

## Recommended Phase 2 Start

Phase 2 should begin with:

- `TASK-GRAPH-001`

The task graph should:

- read all accepted Phase 1 artifacts
- preserve separate Git flows for root, backend, and frontend repos
- identify task dependencies
- identify parallelizable work packages
- identify required Tech Designs before risky tasks
- treat `PRODUCT-DESIGN-001` as a dependency for major frontend/UI tasks
- require every implementation task to reference specs, contracts, tests, and verification commands

The first likely implementation task is:

- root contract validation and CI from `TECH-DESIGN-001`

## Recommended Briefing For Next Agent

Use this briefing to start Phase 2:

```text
You are planning Phase 2 for Mimico V1. Read `docs/PHASE-1-CLOSEOUT.md`, then read every accepted artifact it references. Do not implement code yet. Produce `TASK-GRAPH-001` first. Preserve repo boundaries: root repo owns docs/contracts/harness, backend is `api-mimico`, frontend is `mimico-game`. Every future task must reference accepted specs/contracts/tests and include verification commands. Treat `PRODUCT-DESIGN-001` as a dependency for major frontend/UI tasks. Create additional Tech Designs only for risky implementation areas discovered during task graph planning.
```

## Closeout Criteria

Phase 1 is closed when:

- this document is committed and pushed
- root repo is clean
- next work starts from `TASK-GRAPH-001` rather than ad hoc tasks
