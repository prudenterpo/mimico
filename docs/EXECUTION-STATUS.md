# EXECUTION-STATUS - Mimico V1 Task Progress

Status: Active
Last updated: 2026-07-26

## Purpose

This file is the operational checklist for Mimico V1 execution.

Use it before starting any new task to avoid re-running work that is already planned, implemented, published, or waiting for review.

Agents must update this file when they:

- create planning artifacts
- implement a task
- run required verification
- push a task branch
- open a PR
- observe that a PR was merged or rejected
- defer a task with a documented reason

## Status Legend

- `[ ] Not started`: no task artifact or implementation work exists yet
- `[~] In progress`: local or branch work exists but is not ready for review
- `[>] In review`: PR is open and waiting for Rodrigo review or CI
- `[x] Done`: PR was merged or the artifact was explicitly accepted as complete
- `[!] Blocked`: cannot continue without a decision, dependency, or fix

## Current Review Queue

These PRs should be reviewed before starting Wave 2 implementation:

- `[>]` Root planning/contracts: [prudenterpo/mimico#1](https://github.com/prudenterpo/mimico/pull/1)
- `[>]` Backend CI baseline: [prudenterpo/api-mimico#2](https://github.com/prudenterpo/api-mimico/pull/2)
- `[>]` Frontend test harness baseline: [prudenterpo/mimico-game#3](https://github.com/prudenterpo/mimico-game/pull/3)

## Wave 0 - Planning Gate

- `[>]` `TASK-001` - Approve executable task graph
  - Repo: root `mimico`
  - Artifact: `docs/TASK-GRAPH-001.md`
  - PR: [prudenterpo/mimico#1](https://github.com/prudenterpo/mimico/pull/1)
  - Notes: graph was used to generate Wave 1 and Wave 2 planning artifacts; awaiting merge in root PR.

## Wave 1 - Executable Foundation

- `[>]` `TASK-010` - Root contract validation and CI
  - Repo: root `mimico`
  - Prompt: `prompts/PROMPT-010.md`
  - Test-first: `test-first/TEST-FIRST-010.md`
  - PR: [prudenterpo/mimico#1](https://github.com/prudenterpo/mimico/pull/1)
  - Verification observed: `npm run contracts:validate` passed with existing Redocly warnings.

- `[>]` `TASK-020` - Contract expansion backlog and Wave 2 table contract gaps
  - Repo: root `mimico`
  - Prompt: `prompts/PROMPT-020.md`
  - Test-first: `test-first/TEST-FIRST-020.md`
  - PR: [prudenterpo/mimico#1](https://github.com/prudenterpo/mimico/pull/1)
  - Notes: `CONTRACT-GAP-001` and `CONTRACT-GAP-002` resolved in local commit `affa173`, included in root PR.

- `[>]` `TASK-030` - Backend CI and test-profile baseline
  - Repo: backend `api-mimico`
  - Prompt: `prompts/PROMPT-030.md`
  - Test-first: `test-first/TEST-FIRST-030.md`
  - PR: [prudenterpo/api-mimico#2](https://github.com/prudenterpo/api-mimico/pull/2)
  - Verification observed: GitHub Actions `test` passed after aligning `ReconnectionServiceTest`; local `./mvnw test` passed with JDK 21 compiling release 17.

- `[>]` `TASK-040` - Frontend test harness baseline
  - Repo: frontend `mimico-game`
  - Prompt: `prompts/PROMPT-040.md`
  - Test-first: `test-first/TEST-FIRST-040.md`
  - PR: [prudenterpo/mimico-game#3](https://github.com/prudenterpo/mimico-game/pull/3)
  - Notes: awaiting review/merge.

## Wave 2 - Auth, Lobby, Table Setup

Planning artifacts exist and are in root PR [prudenterpo/mimico#1](https://github.com/prudenterpo/mimico/pull/1).

- `[ ]` `TASK-110` - Backend auth, session, lobby presence, lobby chat
  - Repo: backend `api-mimico`
  - Prompt: `prompts/PROMPT-110.md`
  - Test-first: `test-first/TEST-FIRST-110.md`
  - Recommended next action after prerequisite PRs merge: execute `PROMPT-110`.

- `[ ]` `TASK-120` - Frontend auth and lobby integration
  - Repo: frontend `mimico-game`
  - Prompt: `prompts/PROMPT-120.md`
  - Test-first: `test-first/TEST-FIRST-120.md`
  - Depends on: `TASK-110`

- `[ ]` `TASK-130` - Backend table, invites, manual teams, explicit start
  - Repo: backend `api-mimico`
  - Prompt: `prompts/PROMPT-130.md`
  - Test-first: `test-first/TEST-FIRST-130.md`
  - Depends on: `TASK-110`

- `[ ]` `TASK-140` - Frontend table setup and team assignment
  - Repo: frontend `mimico-game`
  - Prompt: `prompts/PROMPT-140.md`
  - Test-first: `test-first/TEST-FIRST-140.md`
  - Depends on: `TASK-120`, `TASK-130`

## Wave 3 - Core Gameplay Without Video Architecture

- `[ ]` `TASK-210` - Backend gameplay persistence/state Tech Design
- `[ ]` `TASK-220` - Backend gameplay state machine and commands
- `[ ]` `TASK-230` - Frontend authoritative gameplay UI and state client
- `[ ]` `TASK-240` - Deterministic word, dice, timer fixtures for tests

## Wave 4 - Reconnection And Recovery

- `[ ]` `TASK-310` - Reconnection persistence/timer Tech Design
- `[ ]` `TASK-320` - Backend reconnection, pause, resume, forfeit
- `[ ]` `TASK-330` - Frontend refresh recovery and paused/reconnecting UI

## Wave 5 - Video, Media, And Chat Completion

- `[ ]` `TASK-410` - Video/WebRTC architecture Tech Design
- `[ ]` `TASK-420` - Media readiness and signaling contracts
- `[ ]` `TASK-430` - Backend video signaling and media-failure pause integration
- `[ ]` `TASK-440` - Frontend media permission, peer connection, video UI

## Wave 6 - Responsive UI, Visual Polish, And Accessibility

- `[ ]` `TASK-510` - Visual system tokens and core components
- `[ ]` `TASK-520` - Responsive auth, lobby, table screens
- `[ ]` `TASK-530` - Responsive gameplay, paused, final, rematch screens
- `[ ]` `TASK-540` - Accessibility, motion, and visual QA pass

## Wave 7 - E2E, Deploy, Observability, Release

- `[ ]` `TASK-610` - Multi-repo E2E harness Tech Design
- `[ ]` `TASK-620` - Multi-user E2E smoke harness
- `[ ]` `TASK-630` - Deploy provider Tech Design
- `[ ]` `TASK-640` - Backend and frontend deploy readiness
- `[ ]` `TASK-650` - Release checklist and demo smoke

## Agent Update Rules

When updating a task entry, keep the note concise and include:

- branch name
- PR URL if one exists
- verification command result
- merge status when known
- any deferral reason

Do not mark a task `[x] Done` until the relevant PR is merged or Rodrigo explicitly says the artifact/task is complete without merge.
