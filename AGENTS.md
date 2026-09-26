# Agent Instructions — Mimico

Mimico consists of this product repository and two independent application
repositories: `api-mimico/` and `mimico-game/`.

## Sources of truth

- Product behavior and scope: `docs/spec-kit/PRD.md`.
- Stable delivery rules: `docs/spec-kit/CONSTITUTION.md`.
- Cross-repository architecture: `docs/spec-kit/TECHNICAL-DESIGN.md`.
- Verified implementation baseline: `docs/spec-kit/INVENTORY.md`.
- Stable remaining delivery map: `docs/spec-kit/LEDGER.md`.
- Implemented behavior: code, tests, migrations, generated contracts, Git, and
  CI in the owning application repository.

Before analysis, planning, or implementation, run `git fetch` in both nested
repositories and inspect `origin/develop`. Local branches may be intentionally
behind. Do not check them out or modify their working trees merely to inspect
the current implementation.

## Behavior-driven delivery

- Start from an observable user or system behavior, not a frontend/backend task
  list.
- Write only the acceptance examples needed to remove ambiguity.
- Prefer Given/When/Then for rules with meaningful state transitions; use plain
  acceptance bullets when they are clearer.
- Turn each accepted example into an automated test at the cheapest layer that
  can prove it.
- A cross-layer behavior is incomplete until the integrated path is verified.
- Do not maintain separate test-first packs, prompt files, handoffs, task graphs,
  or execution-status documents.

## Workstreams

A workstream is one large implementation task for a bounded product outcome.
It may span root documentation, backend, frontend, infrastructure, and several
pull requests. Create
`docs/spec-kit/WORKSTREAM-<name>.md` naturally in the same branch as the first
implementation change. It contains scope, behavior examples, decisions, risks,
and completion evidence. GitHub owns branches, pull requests, checks, ownership,
and live status; never copy that lifecycle into versioned documents.

Do not decompose the workstream into versioned microtask files. The workstream
owner may delegate investigations, implementation areas, and checks internally,
but remains accountable for the integrated outcome. Split into another
workstream only for an independently valuable outcome, a separate production
authorization, or an unsafe repository/rollback boundary.

## Repository boundaries

- Root documentation changes are committed in this repository.
- Backend implementation is committed from `api-mimico/`.
- Frontend implementation is committed from `mimico-game/`.
- Do not edit either application during a root documentation-only task unless
  implementation was explicitly requested.
- Preserve user changes and untracked local configuration.

## Documentation discipline

- Keep the artifact set small and remove duplication instead of adding indexes.
- Product rules belong in the PRD; technical choices belong in Technical Design;
  verified implementation facts belong in Inventory.
- Update durable decisions in the same pull request as the code that depends on
  them.
- Historical notes and old PDFs are evidence, not requirements.
- Write repository and Git-hosting artifacts in English.
