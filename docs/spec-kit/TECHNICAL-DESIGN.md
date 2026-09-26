# Technical design — Mimico

## Purpose

This document owns cross-repository architecture and choices that code alone
cannot explain. Application-internal details belong in the owning repository.

## System shape

Mimico has two deployables and shared persistence infrastructure:

- `api-mimico`: Java 17, Spring Boot 3.2, Spring MVC, Spring Security, JPA,
  Flyway, Redis, and STOMP over WebSocket;
- `mimico-game`: Next.js 15, React 19, Zustand, STOMP/SockJS, and PeerJS;
- PostgreSQL stores durable users, tables, matches, rounds, and word cards;
- Redis stores ephemeral authentication, presence, or coordination data where
  the current implementation requires it.

The root repository contains no executable API contract or runtime package.

## Source ordering

For current behavior, inspect in this order:

1. fetched `origin/develop` code and migrations in the producing repository;
2. automated tests protecting the behavior;
3. generated OpenAPI or runtime mappings;
4. the consuming adapter and tests in the other repository;
5. this specification kit for approved intent and cross-repository decisions.

An intended behavior that is absent from code remains a gap. Existing code that
contradicts an approved product rule remains a defect or explicit decision.

## Authoritative gameplay

The backend owns:

- table membership and team assignment;
- initial roll and active team;
- dice values and board movement;
- mime rotation;
- word-card generation and selection eligibility;
- guess eligibility and normalization;
- round deadlines and resolution;
- pause, reconnection, forfeit, and match completion.

The frontend sends commands and renders snapshots/events. It must not calculate
a game result locally or advance optimistically in a way that can be mistaken
for confirmed state.

Durable gameplay state lives in PostgreSQL. A server restart must not erase the
match, round, chosen word, positions, pause reason, or reconnect deadline.
Ephemeral caches may accelerate coordination but cannot be the only record of a
result that affects the match.

## State model

Canonical match states:

- `MATCH_SETUP`
- `MATCH_ACTIVE`
- `MATCH_PAUSED`
- `MATCH_FINISHED`

Canonical round states:

- `ROUND_WAITING_FOR_DICE`
- `ROUND_WAITING_FOR_WORD_SELECTION`
- `ROUND_GUESSING`
- `ROUND_RESOLVED`

Round resolutions include correct guess, steal, timeout, match finish, and
forfeit. Transitions are validated on the server under per-match concurrency
control. Repeated, stale, or ineligible commands must not produce a second
transition.

## HTTP and WebSocket contracts

Generated backend OpenAPI is the HTTP implementation contract. Frontend API
adapters and integration tests prove consumption. If a stable generated artifact
is needed in CI, publish it from the backend build rather than maintaining a
manual root copy.

WebSocket contracts are proven by producer tests, frontend parser/store tests,
and integrated scenarios for critical flows. Shared events use an envelope with
an event type, data, and occurrence time. Public match snapshots never include
the private word.

Contract evolution sequence:

1. specify the observable behavior in the active workstream;
2. change the producer and producer tests;
3. change the consumer and consumer tests;
4. run an integrated behavior check;
5. merge in a dependency-safe order.

## Time, randomness, and concurrency

- Production dice and word selection may be random; tests use deterministic
  substitutes.
- Server time controls round and reconnect deadlines; tests use a controllable
  clock.
- Scheduled timeout processing is idempotent.
- Match commands use optimistic locking or equivalent serialization so two
  commands cannot resolve the same transition twice.
- Clients derive countdown display from the server deadline and periodically
  reconcile with authoritative state.

## Reconnection

Disconnect pauses the match and records the player, reason, deadline, and
remaining round duration. Reconnect restores from the server snapshot. Redis
may support presence detection, but PostgreSQL state determines whether a match
is paused or finished.

The same mechanism may later pause for required mime-media failure, but media
failure must be distinguishable from network disconnection.

## Video target

PeerJS remains the preferred V1 client abstraction unless implementation
evidence shows it cannot meet the four-player behavior. The backend provides
authenticated signaling coordination over the existing real-time channel or a
separately justified signaling service.

V1 requires:

- explicit camera and microphone permission flow;
- one local stream and three remote participants;
- deterministic join/leave and cleanup;
- reconnect without duplicate peers or leaked tracks;
- mute and camera controls;
- visible degraded/failed media states;
- pause when the active mime cannot provide required video;
- STUN configuration and a production TURN decision based on real network tests.

Selected words, JWTs, and unnecessary personal data never enter signaling
payloads or logs.

## Test strategy

Behavior examples are implemented at the cheapest layer that proves the risk:

| Risk | Primary evidence |
|---|---|
| game rules and transitions | backend service/domain tests |
| persistence, locking, and migrations | PostgreSQL integration tests |
| HTTP authorization and shapes | controller/integration tests and generated OpenAPI |
| WebSocket producer behavior | controller/publisher tests |
| frontend eligibility and rendering | store, rule, and component tests |
| private-word delivery | producer, consumer, and negative leakage tests |
| four-player coordination | multi-client E2E |
| WebRTC negotiation and recovery | browser E2E with controlled media |
| deployment readiness | environment smoke and rollback rehearsal |

Do not use H2 behavior as proof of PostgreSQL locking, constraints, or migration
correctness. Do not duplicate a behavior at several layers unless each layer
protects a distinct failure.

## Deployment direction

Frontend and backend are deployed independently. Environment configuration owns
public URLs, database, Redis, allowed origins, JWT secret, signaling endpoints,
and STUN/TURN credentials. Secrets never enter repositories.

The final provider, topology, CI/CD promotion, backup, monitoring, TURN service,
and rollback procedure remain delivery decisions for the release workstream.
