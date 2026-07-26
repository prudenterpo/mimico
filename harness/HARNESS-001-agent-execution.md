# HARNESS-001 - Agent Execution Harness

Status: Draft  
Date: 2026-07-25

## Purpose

This harness defines how AI agents should execute work on Mimico V1. Its goal is to allow long-running work with autonomy while keeping execution bounded by product specs, domain rules, executable contracts, tests, and review gates.

The harness is not a task list. It is the operating system for tasks.

## Source Documents

Every agent must load these documents before executing implementation work:

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `specs/spec-map.md`
- `harness/HARNESS-001-agent-execution.md`

When available, agents must also load:

- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `docs/EXECUTION-STATUS.md`
- the relevant functional spec
- the relevant task definition

## Engineering Loop

Each task follows this loop:

1. Context
2. Plan
3. Implement
4. Verify
5. Review
6. Integrate
7. Learn

### 1. Context

The agent reads the relevant PRD sections, specs, domain states, contracts, tests, and task instructions before changing files.

Required output before implementation:

- restated goal
- referenced source documents
- affected repo or repos
- expected verification commands

### 2. Plan

The agent creates a small implementation plan before editing code.

The plan must include:

- intended files or modules
- risk level
- expected tests or checks
- known unknowns
- stop conditions

### 3. Implement

The agent changes only the files required by the task.

Implementation rules:

- preserve existing repo patterns
- do not rewrite unrelated code
- do not cross repo boundaries unless the task explicitly requires it
- do not invent contracts, states, or event names
- update canonical docs first if the task reveals a missing canonical decision

### 4. Verify

The agent runs the smallest meaningful verification set required by the task.

Verification may include:

- unit tests
- integration tests
- root contract validation with `npm run contracts:validate`
- build
- lint
- typecheck
- E2E test
- smoke test

If verification cannot run, the agent must record why and whether the task can still be considered complete.

### 5. Review

Before integration, the agent reviews the diff against:

- task acceptance criteria
- relevant specs
- domain invariants
- executable contracts
- test results

The agent must fix clear issues before presenting work.

### 6. Integrate

The agent commits from the correct repository only.

Repository rules:

- root docs/specs/harness/tasks: commit from `/Users/rodrigooliveira/personalProjects/mimico`
- backend: commit from `/Users/rodrigooliveira/personalProjects/mimico/api-mimico`
- frontend: commit from `/Users/rodrigooliveira/personalProjects/mimico/mimico-game`

Cross-repo work requires separate commits in each affected repo.

Default review flow:

- create or use a task-specific branch before committing
- commit only the files allowed by the task
- push the task branch when verification is complete
- open a pull request for Rodrigo's review
- do not merge the pull request automatically
- include task ID, test-first pack ID, source specs, verification commands, results, and known deferrals in the PR description
- for cross-repo work, open separate PRs per repo and document the integration order in each PR

### 7. Learn

If implementation exposes ambiguity, missing decisions, weak contracts, missing tests, or environment gaps, update the relevant document before continuing.

Learning updates may affect:

- glossary
- domain model
- contracts
- functional specs
- test strategy
- task graph
- harness
- execution status

At the end of every task, update `docs/EXECUTION-STATUS.md` with the task status, branch, PR URL if available, verification result, and any deferrals.

## Autonomy Levels

### Level 1 - Single Task

The agent executes one task and stops.

Use for:

- risky code changes
- first implementation of a new area
- tasks requiring human review before dependent work

### Level 2 - Work Package

The agent executes a bounded group of related tasks.

Limits:

- maximum 5 tasks
- all tasks must be ready
- all tasks must share the same spec area or dependency chain
- agent stops after the package is complete or blocked

Use for:

- cohesive feature slices
- test coverage improvements
- small refactors after contracts are stable

### Level 3 - Background Loop

The agent repeatedly picks the next eligible task from the task graph.

Limits:

- only tasks marked ready
- no unresolved P0 or P1 decisions
- no contract invention
- no architecture changes without ADR
- stop after verification failure that repeats twice
- stop after any user/product ambiguity

Use for:

- mature backlog execution
- mechanical contract-aligned implementation
- post-spec polish and test expansion

## Stop Conditions

Agents must stop and ask for direction when they encounter:

- product behavior not defined by PRD or spec
- conflicting specs or contracts
- missing domain state for required behavior
- missing event or payload required for cross-layer work
- verification failure caused by unclear expected behavior
- security or privacy concern
- destructive migration or data-loss risk
- need to change repo structure or deployment architecture

Agents may continue without asking when:

- the issue is a local implementation detail
- existing patterns clearly answer the question
- the task acceptance criteria already define the expected behavior
- the fix is required to make verification pass and does not change product behavior

## Readiness Gates

A task is ready only when it has:

- stable task ID
- referenced PRD section
- referenced spec
- referenced domain states or invariants
- referenced contract if applicable
- acceptance criteria
- verification commands or checks
- repo boundary
- autonomy level
- stop conditions

## Merge Gates

Work is merge-ready only when:

- acceptance criteria are satisfied
- required verification passed or documented as unavailable
- contracts remain valid
- no unrelated changes are included
- commit was made in the correct repository
- final report includes changed files, verification results, and follow-up risks

## Prompt Shape

Implementation prompts should be written like GitHub issues.

Required fields:

- task ID
- objective
- context documents
- repo
- scope
- acceptance criteria
- verification
- autonomy level
- stop conditions

## Current Harness Gaps

These gaps must be closed before Level 3 background execution is allowed:

- backend CI and test-profile baseline are not established yet
- frontend test harness baseline is not established yet
- repo-local backend/frontend contract conformance tests are not established yet
- multi-repo E2E harness is not designed yet
- deploy smoke gate is not executable yet
