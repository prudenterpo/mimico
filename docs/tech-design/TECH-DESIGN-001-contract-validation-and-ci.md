# TECH-DESIGN-001 - Contract Validation and CI

Status: Accepted
Date: 2026-07-26

## Overview

This technical design defines the first executable harness layer for Mimico V1: contract validation and CI topology.

This document exists because the accepted specs and contracts should not remain passive Markdown/YAML/JSON files. Before broad backend or frontend implementation, agents need fast commands that prove the contract files parse, schemas validate, and CI can block obvious drift. This design turns the SDD workflow into the first concrete guardrail.

## Source Documents

- `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/spec-map.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `contracts/schemas/*.schema.json`
- `specs/TEST-STRATEGY-001-test-strategy.md`
- `specs/SPEC-007-deploy-observability.md`

## Goals

- Add a root-level contract validation command.
- Validate OpenAPI syntax and structure.
- Validate AsyncAPI syntax and structure.
- Validate JSON Schema files.
- Validate representative sample payloads against JSON Schemas.
- Add root CI for docs/contracts.
- Define backend and frontend CI responsibilities without collapsing repo boundaries.
- Give future implementation agents a stable command surface.

## Non-Goals

- Implement full backend/frontend test harnesses in this design.
- Deploy the app.
- Choose hosting provider.
- Generate API clients.
- Enforce every OpenAPI/AsyncAPI semantic rule on day one.
- Replace backend and frontend repository CI.

## Current Constraints

- Root repo contains docs and contracts only.
- Backend lives in separate Git repo: `api-mimico`.
- Frontend lives in separate Git repo: `mimico-game`.
- Root repo ignores child repo directories.
- GitHub root CI will not naturally contain backend/frontend code unless it checks them out explicitly.
- Backend has some existing tests, but some encode legacy behavior.
- Frontend has no first-party test harness yet.
- Root repo currently has no `package.json` or validation scripts.

## Proposed Architecture

Use the root repo as the canonical contract and planning repository.

CI topology:

| Repo | Responsibility | Required In This Design |
| --- | --- | --- |
| `mimico` root | docs, glossary, domain, executable contracts, contract validation | Yes |
| `api-mimico` backend | Java compile/tests, backend contract conformance, emitted events | Planned follow-up |
| `mimico-game` frontend | Next build/tests, client contract consumption, UI tests | Planned follow-up |
| orchestration workflow | optional multi-repo E2E and deploy smoke | Future |

The first implementation task from this design should modify only the root repo.

## Root Tooling

Recommended root files:

- `package.json`
- `package-lock.json`
- `tools/validate-contracts.mjs`
- `contracts/samples/*.json`
- `.github/workflows/contracts.yml`

Recommended dependencies:

- `ajv` for JSON Schema validation
- `ajv-formats` for common string formats
- `yaml` for YAML parsing
- `@redocly/cli` for OpenAPI lint/validation
- `@asyncapi/parser` or official AsyncAPI CLI/parser for AsyncAPI parse validation

Rationale:

- Node tooling is already present because frontend uses Next.js.
- Root contract validation should be cross-platform and fast.
- `ajv` makes JSON Schema validation executable rather than prose-based.
- Redocly/AsyncAPI tooling catches structural issues better than plain YAML parsing.

## Command Surface

Root scripts should expose:

```json
{
  "scripts": {
    "contracts:validate": "node tools/validate-contracts.mjs",
    "contracts:validate:openapi": "redocly lint contracts/openapi/mimico-v1.yaml",
    "contracts:validate:asyncapi": "node tools/validate-contracts.mjs --asyncapi-only",
    "ci": "npm run contracts:validate"
  }
}
```

The exact commands may change during implementation if a tool has different CLI ergonomics, but these script names should remain stable for agents.

## Contract Validation Script

`tools/validate-contracts.mjs` should:

1. Parse `contracts/openapi/mimico-v1.yaml`.
2. Parse `contracts/asyncapi/mimico-realtime-v1.yaml`.
3. Parse every `contracts/schemas/*.schema.json`.
4. Compile every JSON Schema with AJV.
5. Validate sample payloads against schemas.
6. Print a concise success summary.
7. Exit non-zero on any failure.

Recommended output shape:

```text
contracts: openapi parsed
contracts: asyncapi parsed
contracts: schemas compiled 4
contracts: samples validated 6
contracts: ok
```

Failure output should include:

- file path
- schema id or sample name
- validation error path
- concise reason

## Sample Payload Strategy

Initial samples should cover:

- `error.schema.json`
- `team-assignment.schema.json`
- `match-state.schema.json`
- `realtime-event-envelope.schema.json`

Recommended sample files:

- `contracts/samples/error.validation.json`
- `contracts/samples/team-assignment.valid.json`
- `contracts/samples/match-state.active.valid.json`
- `contracts/samples/match-state.paused.valid.json`
- `contracts/samples/realtime-event-envelope.match-state-updated.valid.json`
- `contracts/samples/realtime-event-envelope.match-paused.valid.json`

Sample payloads are not exhaustive. They are executable examples that catch schema drift and help agents understand expected shapes.

## Root CI Workflow

Recommended workflow:

- path: `.github/workflows/contracts.yml`
- trigger: pull request and push to `main`
- runtime: Node LTS
- steps:
  - checkout
  - setup Node
  - `npm ci`
  - `npm run contracts:validate`

Minimum branch protection target:

- root contract validation must pass before docs/contracts changes are considered merge-ready

## Backend CI Follow-Up

Backend repo should later add:

- Java setup
- Maven dependency cache
- compile
- unit tests
- integration tests when available
- backend contract conformance tests
- emitted WebSocket event schema tests

Backend CI should consume contracts by one of these future strategies:

- copy contracts from root repo during task implementation
- check out root repo as a secondary dependency in CI
- publish contracts as versioned artifact/package later

Recommendation for V1:

- check out root repo in backend CI by GitHub URL and pin to branch/commit strategy decided in task graph

## Frontend CI Follow-Up

Frontend repo should later add:

- Node setup
- `npm ci`
- Next build
- component/store tests
- contract consumer tests
- Playwright smoke once harness exists

Frontend CI should consume contracts by one of these future strategies:

- check out root repo in CI
- copy generated JSON examples into frontend test fixtures
- generate TypeScript types later

Recommendation for V1:

- start with root checkout + fixture validation; defer type generation until contracts stabilize

## Multi-Repo E2E Follow-Up

Multi-repo E2E is not part of the first contract-validation task.

Future orchestration should:

- check out root, backend, and frontend repos
- start Postgres and Redis
- start backend
- start frontend
- seed deterministic users/words
- run Playwright multi-browser smoke

This should become its own Tech Design or task package after root contract validation and repo-local CI exist.

## Agent Usage

Agents working on contract-sensitive tasks must run:

```bash
npm run contracts:validate
```

Agents modifying backend behavior must later run backend-specific tests once backend CI exists.

Agents modifying frontend contract consumption must later run frontend-specific tests once frontend CI exists.

If a contract validation failure reveals that a spec and contract disagree, the agent must stop and request review before changing accepted behavior.

## Security Considerations

- No secrets are required for root contract validation.
- CI should not need production env vars.
- Sample payloads must not contain real JWTs, emails, passwords, or production URLs.
- Contract samples should avoid selected mime words that would train agents to leak hidden words broadly.

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Tooling churn around AsyncAPI parsers. | Keep script wrapper stable even if implementation package changes. |
| Root CI gives false confidence because backend/frontend are separate. | Explicitly scope root CI to contracts/docs and add repo-local CI follow-ups. |
| Samples become stale or too few. | Require sample update when schema changes. |
| Agents bypass validation. | Add command requirement to task graph and executable task entry instructions. |
| Contract validation becomes too slow. | Keep root validation app-free and dependency-light. |

## Acceptance Criteria

Implementation of this design is complete when:

- root `package.json` exists with stable validation scripts
- root lockfile is committed
- contract validation script exists
- OpenAPI contract is validated
- AsyncAPI contract is parsed or validated
- JSON Schemas compile with AJV
- sample payloads validate
- `.github/workflows/contracts.yml` runs validation on push/PR
- `npm run contracts:validate` succeeds locally
- `specs/spec-map.md` links this Tech Design as accepted or active

## Known Follow-Up Tasks

- Add backend repo CI.
- Add frontend repo CI.
- Add backend contract conformance tests.
- Add frontend contract consumer tests.
- Add deterministic E2E harness design.
- Add deploy smoke checklist/automation.

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, tests, contracts, and CI.

| ID | Decision |
| --- | --- |
| `TECH-DESIGN-001-AD-001` | Root repo owns canonical contract validation first; backend/frontend CI consume it later. |
| `TECH-DESIGN-001-AD-002` | Use Node-based validation tooling in the root repo. |
| `TECH-DESIGN-001-AD-003` | Add sample payload validation with AJV from the beginning. |
| `TECH-DESIGN-001-AD-004` | Keep command names stable even if underlying validation packages change. |
| `TECH-DESIGN-001-AD-005` | Defer generated clients/types until after schemas stabilize through initial implementation tasks. |
