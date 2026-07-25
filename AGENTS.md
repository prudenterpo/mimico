# Agent Instructions - Mimico Root

This root repository is for product orchestration only. It owns PRDs, specs, plans, tasks, prompts, and delivery checklists.

## Repository Boundaries

- Do not edit `api-mimico/` from a root-repo documentation task unless the user explicitly asks for implementation work.
- Do not edit `mimico-game/` from a root-repo documentation task unless the user explicitly asks for implementation work.
- Treat `api-mimico/` and `mimico-game/` as independent Git repositories with their own remotes.
- Commit root documentation changes in this repository.
- Commit backend changes from inside `api-mimico/`.
- Commit frontend changes from inside `mimico-game/`.

## Product Workflow

- Use `docs/prd-v1.md` as the source of truth for Mimico V1.
- Do not treat old PDFs or loose notes as requirements unless they are explicitly promoted into a current spec.
- Before implementation, derive tasks from a validated spec and include acceptance criteria plus required verification.
- Keep specs organized by product capability or user flow, not by frontend/backend layer.
- Include frontend, backend, contracts, states, and tests inside each relevant spec when the feature crosses layers.

## Documentation Style

- Prefer concise Markdown with explicit decisions, open questions, acceptance criteria, and verification steps.
- Use stable IDs for decisions, specs, and tasks once created.
- Keep generated plans small enough for agents to execute without guessing.
