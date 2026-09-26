# Mimico specification kit

This directory is the canonical home of the cross-repository product and
delivery rules for Mimico. It is intentionally small. The backend and frontend
repositories remain the executable source of truth for implemented behavior.

## Reading order

1. [CONSTITUTION](CONSTITUTION.md) defines stable execution rules.
2. [PRD](PRD.md) defines the game, its behavior, and its completion criteria.
3. [TECHNICAL-DESIGN](TECHNICAL-DESIGN.md) defines cross-repository architecture.
4. [INVENTORY](INVENTORY.md) records the verified implementation baseline.
5. [LEDGER](LEDGER.md) identifies the remaining delivery fronts and collision
   rules.

Read only the sections relevant to the active behavior. No role should load the
whole documentation set by default.

## Maintenance rule

The root repository records durable cross-repository intent. It does not track
active branches, pull requests, checks, workers, prompts, or next actions.
GitHub and CI own that state.

Before changing these documents:

1. fetch `api-mimico` and `mimico-game`;
2. inspect both `origin/develop` branches;
3. distinguish implemented behavior from intended behavior;
4. update the smallest document that owns the durable fact or decision.

## Opening a large implementation task

A delivery front creates one `WORKSTREAM-<name>.md` only when implementation
starts. That file is the large implementation task: it owns the complete outcome
across all affected repositories and may coordinate multiple pull requests. The
workstream and code travel through the same review path. A workstream contains:

- one outcome and explicit non-goals;
- observable behavior examples;
- affected repositories and boundaries;
- implementation risks and material decisions;
- required automated and integrated evidence;
- a completion condition.

The owner may delegate bounded internal work, but does not create separate
versioned microtask, prompt, handoff, test-plan, or status artifacts. There are
no placeholder workstreams.

## Behavior contract

Behavior examples are specifications, not prose decoration. For each example:

- Given establishes only relevant state;
- When describes one user or system action;
- Then describes observable results and prohibited side effects;
- the implementation must link the behavior to an automated test or explain why
  an integrated check is the only meaningful proof.

Duplicating the same scenario at multiple layers is discouraged unless each
layer protects a different failure mode.
