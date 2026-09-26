# Mimico delivery map

## Purpose

This is the stable map for completing Mimico V1. It does not track live branch,
pull-request, check, worker, or merge state. Inspect GitHub for that information.

## Current boundary

Authentication, lobby, table setup, authoritative gameplay, and basic
reconnection are present in the current application baselines. They remain
subject to integrated verification, but they do not need new planning fronts
merely to restate implemented code.

## Large implementation tasks

### 1. Complete multiplayer experience

Recommended workstream name: `WORKSTREAM-complete-multiplayer.md`.

Outcome: four real browser clients can enter one table and complete the entire
game with authoritative gameplay, video, chat, reconnection, and rematch.

This task owns all behavior required to close the functional product:

- authenticated WebRTC signaling and peer topology;
- camera and microphone permission flow;
- one local and three remote media streams;
- mime-player emphasis, mute, camera, and participant state;
- media cleanup, reconnect, duplicate-peer prevention, and degraded states;
- media-driven authoritative pause and resume;
- STUN configuration and a tested TURN decision;
- producer/consumer alignment for every gameplay and signaling message;
- deterministic four-user fixtures and environment orchestration;
- a complete match, normal guess, special steal, timeout, disconnect,
  reconnection, abandonment, natural victory, and rematch;
- private-word leakage and ineligible-command checks;
- concurrent and repeated-command probes;
- backend, frontend, integration, and multi-browser automated evidence.

Expected vertical order:

1. freeze behavior examples and inspect current contracts;
2. implement authenticated signaling and media lifecycle;
3. connect media failure to match pause/recovery;
4. build the real four-client harness and deterministic fixtures;
5. close contract, privacy, concurrency, and rematch gaps found by E2E;
6. run the complete behavior suite and integrated review.

Safe parallel areas include backend signaling, frontend media primitives, and
E2E environment scaffolding. The gameplay store, STOMP adapter, WebSocket
configuration, and shared envelopes each have one owner at a time.

Completion: the full V1 functional flow passes with four controlled browsers
against PostgreSQL and Redis, including real or browser-provided test media. No
core behavior remains represented only by mocks or separate unit tests.

### 2. Product quality and accessibility

Recommended workstream name: `WORKSTREAM-product-quality.md`.

Outcome: the complete multiplayer behavior is understandable, responsive, and
usable on supported phone and desktop browsers.

This task owns:

- visual hierarchy and consistent design tokens;
- responsive auth, lobby, table, gameplay, media, pause, finish, and rematch;
- loading, empty, permission-denied, disconnected, retrying, and fatal-error
  states;
- keyboard navigation, focus order, accessible names, live announcements,
  contrast, reduced motion, and zoom behavior;
- clear eligibility, turn, timer, word-privacy, and recovery feedback;
- copy consistency and removal of placeholder or debug presentation;
- component tests, accessibility checks, viewport coverage, and visual QA.

Expected vertical order:

1. inventory the current UI against every PRD state;
2. stabilize shared tokens and primitives;
3. finish the critical four-player flow from auth through rematch;
4. complete accessibility behavior and reduced-motion support;
5. run mobile, desktop, and cross-browser visual acceptance.

This task may start after the media component interfaces are stable. It must not
simulate missing server behavior or change gameplay rules to simplify the UI.

Completion: every V1 state is usable at the agreed phone and desktop viewports,
automated accessibility checks pass, and a visual review finds no blocking
layout, focus, contrast, or feedback defect.

### 3. Production release

Recommended workstream name: `WORKSTREAM-production-release.md`.

Outcome: Mimico is publicly accessible, observable, recoverable, and documented
well enough to run without repository archaeology.

This task owns:

- application setup and environment documentation;
- backend and frontend CI/CD with environment promotion;
- PostgreSQL and Redis provisioning, Flyway execution, backup, and recovery;
- HTTPS/WSS, domains, CORS, JWT secret handling, and least-privilege access;
- production STUN/TURN provisioning and credential rotation;
- health, readiness, structured logs, metrics, alerts, and correlation;
- capacity assumptions and basic load/concurrency smoke checks;
- deployed four-player smoke, rollback rehearsal, and release checklist;
- removal of starter documentation and obsolete runtime configuration.

Expected vertical order:

1. select and document the deployment topology;
2. provision reproducible non-production infrastructure and delivery pipelines;
3. prove migrations, secrets, networking, observability, and rollback;
4. deploy the release candidate and run the complete multiplayer smoke;
5. promote only after explicit production authorization.

Implementation and non-production verification may proceed under the workstream.
Production deployment, publishing, DNS switching, and irreversible external
changes require Rodrigo's explicit authorization.

Completion: a clean release candidate is deployed through the documented path,
the four-player smoke and operational checks pass, rollback is proven, and no
manual undocumented step is required for normal operation.

## Dependencies

```text
complete multiplayer ──> product quality ──> production release
          │                    │                    ▲
          └──── early UI work ─┘                    │
          └──────── release discovery ──────────────┘
```

Product-quality discovery may begin while multiplayer media is being completed,
but final visual acceptance requires stable behavior. Release discovery and
non-production infrastructure may begin early, but production acceptance
requires both earlier tasks to be complete.

## Collision rules

- One active owner at a time for the gameplay Zustand slice, game page, STOMP
  adapter, WebSocket configuration, match-state schema, and shared event
  envelope.
- A cross-repository contract change names its producer, consumer, merge order,
  and compatibility window in the owning workstream.
- Flyway versions are reserved before parallel backend work begins.
- Product polish does not change game rules or contract shapes.
- Deployment work does not hide an application defect with infrastructure
  configuration.

## Natural workstream creation

When implementation begins, open one large task and have its first branch create
the recommended `WORKSTREAM-*.md` with:

- outcome and non-goals;
- relevant PRD behavior;
- Given/When/Then examples for ambiguous state transitions;
- affected repositories and shared-file ownership;
- verticals, dependencies, delegation boundaries, and integration order;
- implementation and rollout risks;
- automated and integrated acceptance evidence;
- completion and rollback conditions.

The task remains open across its coherent pull-request set and closes only after
the integrated outcome passes. Internal delegation does not create new durable
task documents. No central status update is required merely because a branch or
pull request exists.
