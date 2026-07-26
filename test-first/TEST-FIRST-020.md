# TEST-FIRST-020 - Contract Expansion Backlog Traceability

Status: Draft for Approval
Linked task IDs:

- `TASK-020`

## Behavior Under Test

The contract expansion backlog must make accepted contract gaps visible before implementation tasks depend on them.

The backlog must prove:

- every listed gap traces to accepted specs, domain states, glossary terms, or current contract files
- every blocking implementation gap is classified
- future contract edit tasks can be planned without guessing
- gaps requiring Tech Design are not disguised as ordinary contract edits
- contract-sensitive future work has an explicit readiness status

## Fixtures Required

No runtime fixtures are required.

Documentary fixtures are the accepted artifacts:

- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/*.schema.json`

If `TASK-010` has completed and contract samples exist, those samples may be referenced as evidence of current coverage gaps.

## Tests To Add Or Update

Add or update a root planning artifact, then review it against this checklist:

- table chat command and event gap is listed
- table cancelled/closed event naming alignment is listed
- gameplay event envelope coverage is listed
- `MATCH_PAUSED` event schema gap is listed
- `PLAYER_RECONNECTED` event schema gap is listed
- restored state user event schema gap is listed
- reconnect deadline fields are listed
- remaining round seconds fields are listed
- `finishReason = RECONNECTION_FORFEIT` is listed
- media readiness contract need is listed
- video signaling contract need is listed and marked as requiring `TASK-410`
- media failure pause reason is listed if server-mediated
- each gap includes source document references
- each gap includes affected contract files or schemas
- each gap includes readiness classification:
  - ready for contract edit
  - requires Tech Design
  - blocked by accepted-spec conflict
- each gap states whether Wave 2, Wave 3, Wave 4, or Wave 5 is blocked

If the task edits actual contract files, update validation samples or schema coverage as appropriate and run root validation.

## Expected Failing State Before Implementation

Before `TASK-020` implementation:

- No dedicated contract expansion backlog artifact exists.
- Known gaps are spread across specs and known-mismatch tables.
- Future implementation tasks can see that gaps exist, but not yet as a single prioritized contract-readiness view.
- If `TASK-010` has not completed, executable root contract validation is unavailable.

The expected failure is missing traceability and classification, not failing application behavior.

## Required Verification Command

If `TASK-010` has completed, run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm run contracts:validate
```

Always perform Markdown traceability review against the accepted specs and contracts.

Suggested manual review command:

```bash
rg -n "table chat|MATCH_PAUSED|PLAYER_RECONNECTED|RECONNECTION_FORFEIT|media readiness|video signaling|remainingRoundSeconds|reconnectDeadline" docs specs contracts
```

## Deferral Rules

Deferral is allowed when:

- `TASK-010` has not completed, so executable contract validation does not exist yet
- a gap depends on video/WebRTC architecture and must wait for `TASK-410`
- a gap depends on reconnection persistence/timer design and must wait for `TASK-310`
- accepted specs and contracts disagree and require user review

Deferral is not allowed for:

- leaving a known contract gap unlisted
- classifying video signaling as ready for implementation before Tech Design
- creating backend/frontend implementation work from an unresolved gap
- inventing new command, event, or state names outside glossary/domain/contracts
