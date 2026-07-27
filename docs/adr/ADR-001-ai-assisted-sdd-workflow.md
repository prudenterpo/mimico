# ADR-001 - AI-Assisted SDD Workflow

Status: Accepted  
Date: 2026-07-25

## Context

Mimico is a portfolio-oriented full-stack multiplayer game that will be completed with AI-assisted development. The project already has separate backend and frontend repositories, plus this root product repository for orchestration.

Because the game depends on real-time state, WebSocket events, video/chat behavior, reconnection, and responsive UI, implementation tasks can easily drift if agents infer contracts or vocabulary from partial context.

The project needs a workflow that makes agent execution predictable before any implementation task starts.

## Decision

Mimico V1 will use specification-driven development with executable contracts and an explicit agent harness.

The official artifact order is:

1. PRD
2. ADRs
3. Harness Spec initial
4. Spec Map
5. Glossary & Canonical Invariants
6. Domain Model & State Machine
7. Executable Contracts
8. Functional Specs
9. Test Strategy
10. Tech Design Docs
11. Task Graph
12. Test-First Packs
13. Executable Task Entry Instructions
14. Review & Release Checklists

Functional specs will be organized by product capability or user flow, not by frontend/backend layer.

Each implementation task must reference:

- the relevant PRD section
- at least one functional spec
- the relevant domain states or invariants
- the relevant executable contract, when applicable
- required tests or verification steps

## Rationale

State and contract drift is the highest-risk failure mode for AI agents in this project. Writing frontend and backend tasks before names, states, transitions, events, and payloads are canonical would create avoidable reconciliation work.

Therefore:

- the glossary gives every agent the same vocabulary
- the domain model and state machine define legal behavior
- executable contracts reduce interpretation gaps
- functional specs consume those shared foundations instead of inventing them
- the harness turns documentation into repeatable execution rules

## Consequences

- Documentation work comes before implementation work.
- Specs may take longer up front, but implementation tasks should become smaller and more reliable.
- Contracts should be machine-verifiable whenever practical, using OpenAPI, AsyncAPI, JSON Schema, or equivalent artifacts.
- The task graph is not considered ready until tasks can be validated against specs, contracts, and tests.

## Non-Goals

- This workflow does not require rewriting backend and frontend into a monorepo.
- This workflow does not require perfect specifications before learning from the existing codebase.
- This workflow does not prevent iterative updates; it requires updates to flow through the canonical artifacts first.
