# Execution constitution — Mimico

This document defines stable rules for completing Mimico with behavior-driven,
AI-assisted development.

## 1. Evidence has an owner

The latest `origin/develop` of each application is the implementation baseline:

- code shows current behavior;
- tests show protected risks;
- Flyway migrations show persisted state;
- generated OpenAPI and runtime mappings show the backend HTTP surface;
- frontend types and adapters show consumed contracts;
- GitHub and CI show live delivery state.

The specification kit records approved intent, cross-repository boundaries, and
durable decisions. A mismatch between intent and code is a finding to resolve,
not permission to silently rewrite either side.

Local branches and nested working trees are not evidence of the latest system
until they are compared with `origin/develop` after a fetch.

## 2. Minimal artifact set

| Source | Single purpose |
|---|---|
| [PRD](PRD.md) | product outcome, game rules, behavior examples, and completion |
| [TECHNICAL-DESIGN](TECHNICAL-DESIGN.md) | cross-repository architecture and technical decisions |
| [INVENTORY](INVENTORY.md) | verified current implementation and known gaps |
| [LEDGER](LEDGER.md) | stable remaining fronts, dependencies, and collision rules |
| `WORKSTREAM-*.md` | one active bounded product outcome |
| application repositories and GitHub | implementation, contracts, tests, review, and live status |

Do not create routine task, plan, prompt, test-first, handoff, scan, or execution
status documents. If information already belongs to code, tests, a pull request,
or CI, link to or inspect that source instead of copying it.

## 3. Large implementation tasks

A workstream is one large implementation task that owns a complete product
outcome, such as the full four-player multiplayer experience. It may cross root
documentation, backend, frontend, persistence, WebSocket contracts,
infrastructure, and tests. It may produce several pull requests and delegate
several bounded internal assignments while remaining one accountable task.

A vertical is a reviewable end-to-end behavior inside the large task. Verticals
control implementation and merge order; they are not separate task artifacts.
Their state lives in branches, pull requests, and CI.

The default is to keep related behavior in the same large task so one owner can
drive it to an integrated result without repeated planning handoffs. Split into
another workstream only for an independently valuable product outcome, separate
production authorization, incompatible rollback boundary, or writer collision
that cannot be coordinated safely. Do not split by controller, service,
component, DTO, test type, pull request, or agent.

The task owner defines repository ownership, vertical order, shared-file
collisions, integration sequence, and final acceptance before implementation.
One vertical normally produces one pull request per affected application, while
the large task may own a coherent pull-request set. Root specification changes
travel with the first implementation change that needs them; they are not a
preparatory documentation program.

Every large task must state:

- the product outcome and explicit non-goals;
- all affected repositories and shared boundaries;
- the behavior scenarios that define acceptance;
- the verticals and their dependency order;
- safe areas for parallel execution;
- checks required per vertical and for the integrated result;
- the exact condition that ends the task.

## 4. Behavior-driven specification

Start a vertical by identifying the actor, relevant state, action, observable
result, and important failure modes. Use a short Given/When/Then example when a
state transition or authorization rule would otherwise be ambiguous.

Examples must describe behavior, not implementation:

```text
Given an active guessing round on a normal tile
And the actor belongs to the opposing team
When the actor submits the correct word
Then the guess is rejected
And the round state and turn do not change
```

Every accepted example must be proven at the cheapest meaningful layer:

- domain or service test for game rules and state transitions;
- controller or adapter test for transport behavior;
- component or store test for client behavior;
- integrated multi-client test for behavior that depends on real-time
  coordination, media, or reconnection.

A scenario is not proven merely because backend and frontend unit tests pass
independently when the risk exists at their boundary.

## 5. Server authority and contract ownership

The server owns dice results, word options, selected word, eligibility, timers,
turns, positions, pause state, and match outcome. The frontend renders server
state and may keep private presentation state only when it cannot change the
game result.

Cross-repository contracts must have one executable owner. Prefer generated
backend OpenAPI for HTTP and shared behavior tests for WebSocket messages. Do not
maintain a second aspirational OpenAPI or AsyncAPI copy in the root repository.

A contract change is complete only when producers, consumers, and relevant
tests agree in the same delivery sequence.

## 6. Decisions and questions

Implementation may make reversible choices that preserve the PRD and Technical
Design. Ask Rodrigo before:

- changing a game rule or V1 boundary;
- adding or changing a durable public name;
- replacing a core technology;
- accepting a material security, privacy, availability, or data-integrity risk;
- deploying, publishing, or making a production change;
- deleting user data or externally visible behavior.

Collect non-blocking questions in the active workstream. Do not turn every
unknown into a new planning artifact.

## 7. Review and evidence

Tests protect named behavior and risk; test count and global coverage are not
delivery goals. Use deterministic dice, clock, word selection, and media
substitutes where randomness or external systems would make tests unreliable.

Independent review is required for authentication, authorization, concurrency,
reconnection, hidden-word privacy, WebRTC signaling, schema migration, and
deployment or rollback changes. Regular presentation-only changes may use normal
pull-request review.

## 8. Completion

A large implementation task is complete when:

- all of its behavior examples pass;
- producer and consumer agree on affected contracts;
- relevant focused tests and the applicable full suites pass;
- every vertical is integrated in the intended order;
- the complete end-to-end path is checked when unit tests cannot prove it;
- remaining risks and non-goals are explicit;
- durable decisions are updated in the same change;
- the coherent pull-request set is reviewable in the owning repositories.

Merge and deployment remain separate actions unless explicitly authorized.
