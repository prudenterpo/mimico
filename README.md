# Mimico

Mimico is a full-stack multiplayer browser game project. This root repository is the product and orchestration workspace for planning, specifications, executable task instructions, task plans, and delivery checklists.

## Repository Layout

- `docs/`: validated product documents and decision records.
- `specs/`: functional and technical specifications derived from the PRD.
- `plans/`: implementation plans and task graphs.
- `harness/`: agent execution rules, verification checklists, and workflow utilities.
- `api-mimico/`: backend repository, versioned separately.
- `mimico-game/`: frontend repository, versioned separately.

## Git Boundaries

This root repository intentionally ignores `api-mimico/` and `mimico-game/` because they already have their own Git histories and GitHub remotes.

- Product docs, specs, plans, and harness changes are committed in this root repository.
- Backend implementation changes are committed inside `api-mimico/`.
- Frontend implementation changes are committed inside `mimico-game/`.
- Cross-cutting work should reference the same PRD/spec/task IDs across the relevant commits.

## Source Of Truth

The current product source of truth is [docs/prd-v1.md](docs/prd-v1.md).

Historical PDFs and notes in the local workspace may be useful context, but they are not authoritative for V1.

## Workflow

Mimico V1 uses AI-assisted specification-driven development. The workflow decision is recorded in [ADR-001](docs/adr/ADR-001-ai-assisted-sdd-workflow.md), and the live documentation map is [specs/spec-map.md](specs/spec-map.md).
