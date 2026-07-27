# PHASE-2-PLANNING-BRIEF - Execution Planning

Status: Accepted
Date: 2026-07-26

## Purpose

This brief defines how Phase 2 of Mimico V1 must be planned.

It exists to reduce dependence on perfect prompts. A planning agent should be able to read this file and know exactly what to produce, in what order, when to stop for approval, and what not to implement yet.

## Phase 2 Goal

Turn the accepted Phase 1 package into an executable implementation plan without writing production code yet.

Phase 2 produces:

- `TASK-GRAPH-001`
- individual task files
- test-first packs
- executable task entry instructions
- release/review checklist updates when needed

Phase 2 does not directly implement product code unless the user explicitly starts the execution phase after approving planning artifacts.

## Required First Read

Before producing any planning artifact, read:

- `docs/PHASE-1-CLOSEOUT.md`

Then read every accepted artifact referenced by the closeout.

Minimum required context:

- PRD
- ADR
- harness
- spec map
- glossary
- domain model
- contracts
- all accepted functional specs
- product design
- test strategy
- accepted Tech Designs

## Phase 2 Artifact Order

Follow this order exactly:

1. Produce `TASK-GRAPH-001`.
2. Stop for user approval.
3. After approval, produce individual `tasks/TASK-xxx.md` files for the first approved execution wave.
4. Stop for user approval.
5. After approval, produce matching `TEST-FIRST-xxx.md` packs.
6. Stop for user approval.
7. After approval, make each `TASK-xxx.md` executable by including agent entry instructions for executor agents.
8. Stop for user approval before any implementation starts.

Do not skip approval checkpoints.

## Planning Rules

- Do not implement code during Phase 2 planning.
- Do not generate individual task files before `TASK-GRAPH-001` is approved.
- Do not generate test-first packs before task files are approved.
- Do not mark task entry instructions ready before test-first packs are approved.
- Do not merge backend, frontend, and root repo concerns into one undifferentiated task.
- Do not assume missing product behavior; trace behavior to accepted specs.
- Do not weaken accepted contracts or invariants to make a task easier.
- Do not introduce new major architecture decisions inside task text; create or require a Tech Design instead.

## Repository Boundaries

Preserve these repo boundaries:

| Repo | Local Path | Responsibility |
| --- | --- | --- |
| root `mimico` | `/Users/rodrigooliveira/personalProjects/mimico` | docs, specs, contracts, harness, task graph, planning artifacts |
| backend `api-mimico` | `/Users/rodrigooliveira/personalProjects/mimico/api-mimico` | Spring Boot API, WebSocket, Postgres, Redis, backend tests |
| frontend `mimico-game` | `/Users/rodrigooliveira/personalProjects/mimico/mimico-game` | Next.js app, UI, client state, frontend tests |

Cross-repo work is allowed only when the task explicitly requires it.

Cross-repo work must define:

- separate repo targets
- separate verification commands
- separate commit/PR expectations
- integration order

## TASK-GRAPH-001 Requirements

`TASK-GRAPH-001` must include:

- objective
- source documents read
- execution phases or waves
- dependency graph
- task IDs and titles
- target repo for each task
- classification for each task: `serial`, `parallel-safe`, or `requires-tech-design`
- required specs for each task
- required contracts/schemas for each contract-sensitive task
- required product-design references for UI tasks
- required tests or test-first packs
- expected verification commands
- acceptance gates
- suggested branch/PR strategy
- first recommended execution wave
- known risks and stop conditions

The graph should make clear which tasks can be run in parallel by multiple agents and which must be serialized.

## Task File Requirements

Each future `tasks/TASK-xxx.md` must include:

- stable task ID
- title
- status
- target repo
- autonomy level
- dependencies
- source documents
- scope
- out of scope
- acceptance criteria
- required tests
- verification commands
- allowed files or areas
- stop conditions
- expected commit/PR notes

Task scope should be small enough for one agent to complete with a full loop:

`Context -> Plan -> Implement -> Verify -> Review -> Integrate -> Learn`

## Test-First Pack Requirements

Each future `TEST-FIRST-xxx.md` must include:

- linked task IDs
- behavior under test
- fixtures required
- tests to add or update
- expected failing state before implementation where applicable
- required verification command
- deferral rules if automation is not practical yet

Test-first packs must follow `TEST-STRATEGY-001`.

## Executable Task Entry Requirements

Each future `TASK-xxx.md` must be self-contained enough for an executor agent.

It must include:

- exact test-first pack to follow
- required source documents to read
- repo path
- branch suggestion
- files/areas allowed
- verification commands
- commit rules
- stop conditions
- instruction not to expand scope

## Tech Design Trigger Rules

Create or require an additional Tech Design before implementation when a task involves:

- video/WebRTC architecture
- frontend state architecture overhaul
- backend match state persistence strategy
- Redis/Postgres ownership changes
- deploy provider selection
- multi-repo E2E harness
- database migrations with data-loss risk
- authentication/session model changes
- generated API clients/types

Do not block the entire task graph waiting for every future Tech Design. Instead, mark affected tasks as `requires-tech-design` and define the needed design document.

## Product Design Dependency Rules

Major frontend/UI tasks must reference:

- `docs/product-design/PRODUCT-DESIGN-001-visual-system-and-screen-layouts.md`
- `specs/SPEC-006-mobile-desktop-experience.md`

UI tasks should not be considered ready if they do not specify:

- target screen or component
- mobile behavior
- desktop behavior
- visual state requirements
- accessibility expectations
- verification or visual QA method

## Parallel Execution Rules

Mark a task `parallel-safe` only if:

- it has no unresolved dependency
- it does not modify the same files as another task in the same wave
- it does not require a contract that is still changing
- it has clear verification commands
- it can be committed independently

Mark a task `serial` if:

- it changes canonical contracts
- it changes shared domain/state behavior
- it creates or updates core harness commands
- later tasks depend on its outputs
- it is likely to create merge conflicts

Mark a task `requires-tech-design` if implementation should not start until a technical design is accepted.

## Approval Checkpoints

The planner must stop after:

- `TASK-GRAPH-001`
- first batch of task files
- first batch of test-first packs
- first batch of executable task entry instructions

At each checkpoint, the planner should ask for approval, not continue automatically.

## Builder Instruction

For a new Codex thread, the user can start Phase 2 with:

```text
Leia `docs/PHASE-2-PLANNING-BRIEF.md` e siga exatamente. Comece apenas pelo `TASK-GRAPH-001`. Não implemente código.
```

## Completion Criteria

Phase 2 planning is ready to hand off to executor agents when:

- `TASK-GRAPH-001` is accepted
- first execution wave task files are accepted
- matching test-first packs are accepted
- matching task entry instructions are accepted
- repo boundaries and verification commands are explicit
- parallel-safe tasks are clearly identified
