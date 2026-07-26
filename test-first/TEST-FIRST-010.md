# TEST-FIRST-010 - Root Contract Validation and CI

Status: Draft for Approval
Linked task IDs:

- `TASK-010`

## Behavior Under Test

The root repository must provide an executable contract validation gate that future agents can run without starting backend or frontend applications.

The validation gate must prove:

- OpenAPI contract file parses and passes the chosen OpenAPI validation/lint step.
- AsyncAPI contract file parses or validates through the stable script wrapper.
- Every JSON Schema in `contracts/schemas/` compiles.
- Representative sample payloads validate against their intended schemas.
- The root `ci` script runs the contract validation command.
- Root CI invokes the same validation command on push and pull request.

## Fixtures Required

Create representative contract sample payloads under `contracts/samples/` or equivalent root location.

Minimum valid samples:

- `error.validation.json`
- `team-assignment.valid.json`
- `match-state.active.valid.json`
- `match-state.paused.valid.json`
- `realtime-event-envelope.match-state-updated.valid.json`
- `realtime-event-envelope.match-paused.valid.json`

Fixture rules:

- Use fake UUIDs, timestamps, users, table IDs, and match IDs.
- Do not include real emails, passwords, JWTs, production URLs, or selected mime words.
- Use canonical team values `A` and `B`.
- Use canonical state values from `DOMAIN-001`.
- Use event names from `GLOSSARY-001`.

## Tests To Add Or Update

Add root validation tests through the validation script and package scripts:

- `npm run contracts:validate` must parse `contracts/openapi/mimico-v1.yaml`.
- `npm run contracts:validate` must parse `contracts/asyncapi/mimico-realtime-v1.yaml`.
- `npm run contracts:validate` must compile all `contracts/schemas/*.schema.json`.
- `npm run contracts:validate` must validate every sample payload against its declared schema.
- `npm run contracts:validate:openapi` must validate or lint the OpenAPI file.
- `npm run contracts:validate:asyncapi` must validate or parse the AsyncAPI file through the script wrapper.
- `npm run ci` must run the contract validation gate.
- `.github/workflows/contracts.yml` must run `npm ci` and `npm run contracts:validate`.

Optional implementation check:

- Add a documented temporary negative check while developing the script by intentionally breaking a local uncommitted sample and confirming the command exits non-zero.
- Do not commit intentionally invalid fixtures unless the validation script explicitly supports ignored negative fixtures.

## Expected Failing State Before Implementation

Before `TASK-010` implementation:

- Root `package.json` does not exist.
- `npm ci` from root is not available.
- `npm run contracts:validate` is not available.
- No validation script exists.
- No root sample payload set exists.
- Root CI for contracts does not exist.

The first expected failure is therefore command absence, not a product contract failure.

## Required Verification Command

Run from `/Users/rodrigooliveira/personalProjects/mimico`:

```bash
npm ci
npm run contracts:validate
npm run ci
```

Expected successful output should be concise and include equivalent information to:

```text
contracts: openapi parsed
contracts: asyncapi parsed
contracts: schemas compiled N
contracts: samples validated N
contracts: ok
```

Exact wording may differ if it remains clear and failure output identifies file/sample and reason.

## Deferral Rules

Deferral is allowed only when:

- dependency installation is blocked by network restrictions and cannot be approved during execution
- a selected AsyncAPI parser cannot support the current accepted file shape, and the agent records the tool failure plus a proposed parser fallback
- OpenAPI/AsyncAPI validation reveals an accepted-spec conflict that requires human review before changing contracts

Deferral is not allowed for:

- skipping JSON Schema compilation
- skipping sample validation entirely
- adding CI that does not run the same local validation command
- weakening accepted contract fields to make validation pass
