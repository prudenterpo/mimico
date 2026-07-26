# TASK-020 - Contract Expansion Backlog for Table Chat, Pause/Reconnect, and Gameplay Gaps

Status: Draft for Approval
Target repo: root `mimico`
Autonomy level: Level 1 - Single Task

## Objective

Create a root contract-expansion planning artifact that identifies the accepted contract gaps blocking Wave 2 through Wave 5 implementation.

This task prepares the backlog for future contract work. It must not implement backend/frontend behavior and should not expand contracts beyond what accepted specs already require unless the task explicitly frames the change as a follow-up item requiring approval.

## Dependencies

- Approved `docs/TASK-GRAPH-001.md`
- Prefer `TASK-010` completed before execution so `npm run contracts:validate` exists.

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
- `contracts/schemas/*.schema.json`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/TEST-STRATEGY-001-test-strategy.md`

## Scope

- Create a concise root artifact listing contract gaps that must be resolved before feature implementation.
- Cover at minimum:
  - table chat command/event
  - table cancelled/closed event naming alignment
  - gameplay event envelope coverage
  - `MATCH_PAUSED` event schema
  - `PLAYER_RECONNECTED` event schema
  - restored state user event schema
  - reconnect deadline fields
  - remaining round seconds fields
  - `finishReason = RECONNECTION_FORFEIT`
  - media readiness and video signaling contract need
  - media failure pause reason if server-mediated
- Classify each gap as:
  - ready for contract edit
  - requires Tech Design
  - blocked by accepted-spec conflict
- Define suggested future task IDs for the actual contract edits if needed.
- Do not create `TEST-FIRST-*` packs or implementation prompts.

## Out Of Scope

- Backend controller, service, WebSocket, Redis, or database changes.
- Frontend API/STOMP/client/UI changes.
- Choosing video/WebRTC architecture.
- Choosing generated API client/type strategy.
- Editing contracts in a way that introduces new behavior not present in accepted specs.

## Acceptance Criteria

- A root planning artifact exists for the contract expansion backlog.
- Every listed gap traces to accepted specs or accepted contracts.
- Each gap has an owner repo for future work, even if the current task stays in root.
- Each gap identifies affected contract files or schemas.
- Each gap states whether implementation is blocked until the contract is changed.
- Gaps requiring Tech Design are explicitly marked and linked to future Tech Design tasks from `TASK-GRAPH-001`.
- No backend or frontend code is changed.
- If contract files are edited during execution, `npm run contracts:validate` passes and the PR explains why the edit was safe.

## Required Tests

This task will later receive `TEST-FIRST-020`.

Required coverage intent:

- contract backlog entries are traceable to accepted specs
- any edited contract still validates through root validation
- no future implementation task depends on an undocumented contract gap

## Verification Commands

Run from `/Users/rodrigooliveira/personalProjects/mimico` if `TASK-010` has completed:

```bash
npm run contracts:validate
```

If no executable contract command exists yet, perform Markdown review against the source documents and record that validation is pending `TASK-010`.

## Allowed Files Or Areas

- `docs/`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`, only for accepted-spec-aligned contract clarification
- `contracts/asyncapi/mimico-realtime-v1.yaml`, only for accepted-spec-aligned contract clarification
- `contracts/schemas/`, only for accepted-spec-aligned schema clarification
- `specs/spec-map.md`, only if adding the backlog artifact to the map is appropriate

## Stop Conditions

Stop and ask for review if:

- a needed command/event name is missing from `GLOSSARY-001`
- a needed state or transition is missing from `DOMAIN-001`
- accepted specs and current contracts disagree
- a gap requires video/WebRTC architecture rather than contract-only work
- a schema change would affect both backend and frontend implementation readiness
- generated clients/types become part of the proposed solution

## Expected Commit / PR Notes

- Commit from root repo only.
- Suggested branch: `feature/task-020-contract-expansion`.
- PR should list every contract gap, its source spec, and whether it blocks Wave 2, Wave 3, Wave 4, or Wave 5.
