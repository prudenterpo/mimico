# Spec Map - Mimico V1

Status: Draft  
Date: 2026-07-25

## Purpose

This map defines the documentation system for Mimico V1. It keeps the PRD, domain model, contracts, specs, tests, harness, and task graph connected by stable IDs.

## Source Of Truth

- Product source of truth: `docs/prd-v1.md`
- Workflow decision: `docs/adr/ADR-001-ai-assisted-sdd-workflow.md`
- Phase 1 closeout: `docs/PHASE-1-CLOSEOUT.md`

## Artifact Order

1. `PRD-001`: Mimico V1 PRD
2. `ADR-001`: AI-assisted SDD workflow
3. `HARNESS-001`: Agent execution harness
4. `SPEC-MAP-001`: Spec map
5. `GLOSSARY-001`: Glossary and canonical invariants
6. `DOMAIN-001`: Domain model and state machine
7. `CONTRACTS-001`: Executable API and event contracts
8. `SPEC-*`: Functional specs by product capability
9. `TEST-STRATEGY-001`: Test strategy
10. `TECH-DESIGN-*`: Technical design docs for risky implementation areas
11. `TASK-GRAPH-001`: Executable task graph
12. `TEST-FIRST-*`: Test-first packs
13. `PROMPT-*`: Implementation prompts
14. `RELEASE-001`: Review and release checklists

## Planned Functional Specs

| ID | Document | Status | Depends On |
| --- | --- | --- | --- |
| `SPEC-001` | Auth and Lobby | Accepted | `GLOSSARY-001`, `DOMAIN-001`, `CONTRACTS-001` |
| `SPEC-002` | Table and Team Setup | Accepted | `GLOSSARY-001`, `DOMAIN-001`, `CONTRACTS-001` |
| `SPEC-003` | Match Gameplay | Accepted | `GLOSSARY-001`, `DOMAIN-001`, `CONTRACTS-001` |
| `SPEC-004` | Video and Chat | Accepted | `GLOSSARY-001`, `DOMAIN-001`, `CONTRACTS-001` |
| `SPEC-005` | Reconnection and Recovery | Accepted | `GLOSSARY-001`, `DOMAIN-001`, `CONTRACTS-001` |
| `SPEC-006` | Mobile and Desktop Experience | Accepted | `GLOSSARY-001`, `DOMAIN-001` |
| `SPEC-007` | Deploy and Observability | Accepted | `GLOSSARY-001`, `CONTRACTS-001` |

## Planned Foundation Documents

| ID | Document | Status | Purpose |
| --- | --- | --- | --- |
| `HARNESS-001` | Agent Execution Harness | Draft | Defines how agents read context, execute tasks, validate, commit, and report results. |
| `GLOSSARY-001` | Glossary and Canonical Invariants | Accepted | Defines official names, events, states, commands, errors, and rules that agents must reuse. |
| `DOMAIN-001` | Domain Model and State Machine | Accepted | Defines entities, lifecycle states, transitions, invariants, and invalid cases. |
| `CONTRACTS-001` | Executable Contracts | Accepted | Defines OpenAPI, AsyncAPI, JSON Schemas, and contract validation rules. |
| `TEST-STRATEGY-001` | Test Strategy | Accepted | Defines unit, integration, contract, E2E, smoke, fixture, and CI strategy. |
| `TASK-GRAPH-001` | Task Graph | Planned | Defines executable tasks with dependencies, acceptance criteria, and required verification. |

## Planned Tech Designs

| ID | Document | Status | Purpose |
| --- | --- | --- | --- |
| `TECH-DESIGN-001` | Contract Validation and CI | Accepted | Defines root contract validation tooling, CI topology, and follow-up CI responsibilities across repos. |

## Planned Product Designs

| ID | Document | Status | Purpose |
| --- | --- | --- | --- |
| `PRODUCT-DESIGN-001` | Visual System and Screen Layouts | Accepted | Defines visual direction, layout hierarchy, component direction, motion, and portfolio quality bar for V1. |

## Readiness Rules

- A functional spec is not ready until it references the glossary and domain model.
- A task is not ready until it references a spec, relevant contracts, acceptance criteria, and verification steps.
- A contract-sensitive task is not ready until the executable contract exists or the task explicitly includes creating it.
- Implementation prompts are generated only after the relevant task is ready.
