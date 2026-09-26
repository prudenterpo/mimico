# Mimico

Mimico is a browser-based multiplayer mime game. This repository coordinates
the product across two independently versioned applications:

- `api-mimico/`: Spring Boot backend;
- `mimico-game/`: Next.js frontend.

The applications keep their own Git histories. The root repository owns only
the small set of cross-repository product and delivery decisions that cannot
live correctly in either application alone.

## Specification kit

Read [docs/spec-kit/README.md](docs/spec-kit/README.md) before planning or
implementing cross-repository work.

The workflow is behavior-driven:

1. define the observable behavior and its acceptance examples;
2. inspect the latest `origin/develop` of both applications;
3. implement one useful vertical;
4. encode the examples as automated tests at the cheapest meaningful layer;
5. let GitHub, CI, code, and tests record live execution state.

There are no permanent microtask, prompt, handoff, or execution-status
documents. Each implementation starts as one large `WORKSTREAM-*.md` task that
owns a complete product outcome across every affected repository. It may produce
several pull requests and delegate internal work, but it remains one task until
the behavior is integrated and verified.

## Repository boundaries

Run Git commands from the repository that owns the change:

- root product and specification changes: this repository;
- backend changes: `api-mimico/`;
- frontend changes: `mimico-game/`.

Never infer the current implementation from the nested working-tree checkout.
Fetch and inspect `origin/develop` in both application repositories first.
