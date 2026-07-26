# PROMPT-020 - Execute TASK-020 Contract Expansion Backlog

You are executing one Mimico V1 Phase 2 Wave 1 task.

Do not expand scope. This is a root planning/contract-readiness task, not backend/frontend implementation.

## Task To Execute

- Task file: `tasks/TASK-020.md`
- Test-first pack: `test-first/TEST-FIRST-020.md`

## Required Source Documents To Read First

Read these before editing files:

- `docs/prd-v1.md`
- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `docs/TASK-GRAPH-001.md`
- `tasks/TASK-020.md`
- `test-first/TEST-FIRST-020.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/*.schema.json`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`

## Repo Path

Work from:

```text
/Users/rodrigooliveira/personalProjects/mimico
```

## Branch Suggestion

```text
feature/task-020-contract-expansion
```

## Files And Areas Allowed

- `docs/`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`, only for accepted-spec-aligned contract clarification
- `contracts/asyncapi/mimico-realtime-v1.yaml`, only for accepted-spec-aligned contract clarification
- `contracts/schemas/`, only for accepted-spec-aligned schema clarification
- `specs/spec-map.md`, only if adding the backlog artifact to the map is appropriate

Do not edit:

- `api-mimico/`
- `mimico-game/`

## Execution Instructions

1. Restate the task goal, source docs, target repo, and verification commands.
2. Search accepted specs and contracts for known gaps listed in `TEST-FIRST-020`.
3. Create a concise root contract-expansion backlog artifact.
4. For every gap, include source references, affected contracts/schemas, readiness classification, blocking wave, and future owner.
5. Mark video/WebRTC items as requiring `TASK-410`.
6. Mark reconnection persistence/timer items as requiring `TASK-310` if they cannot be solved contract-only.
7. Do not invent command, event, state, or payload names outside glossary/domain/contracts.
8. Do not create backend/frontend implementation work from unresolved gaps.

## Verification Commands

If `TASK-010` is complete, run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

Always perform Markdown traceability review. Suggested command:

```bash
rg -n "table chat|MATCH_PAUSED|PLAYER_RECONNECTED|RECONNECTION_FORFEIT|media readiness|video signaling|remainingRoundSeconds|reconnectDeadline" docs specs contracts
```

## Commit Rules

- Commit only from the root repo.
- Do not include unrelated changes.
- Commit message suggestion:

```text
Add contract expansion backlog
```

## Stop Conditions

Stop and ask for review if:

- a needed command/event name is missing from `GLOSSARY-001`
- a needed state or transition is missing from `DOMAIN-001`
- accepted specs and current contracts disagree
- a gap requires video/WebRTC architecture rather than contract-only work
- a schema change would affect both backend and frontend implementation readiness
- generated clients/types become part of the proposed solution

## Final Report

Report:

- backlog artifact path
- gaps listed by blocking wave
- validation/review commands run and results
- any gaps requiring Tech Design
- confirmation that backend/frontend repos remained untouched
