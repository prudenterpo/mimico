# SPEC-007 - Deploy and Observability

Status: Accepted
Date: 2026-07-26

## Overview

This functional spec defines the deployment and observability requirements for Mimico V1.

This document exists because a portfolio game is only convincing if other people can open it, play it, and trust that failures are diagnosable. Mimico depends on HTTP, WebSocket/STOMP, Postgres, Redis, JWT sessions, frontend environment variables, and real-time reconnection behavior. Deploy and observability requirements must be explicit before agents create CI, hosting configuration, smoke tests, or release tasks.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `harness/HARNESS-001-agent-execution.md`
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/SPEC-006-mobile-desktop-experience.md`

## Scope

In scope:

- deploy environments
- backend runtime requirements
- frontend runtime requirements
- database and Redis requirements
- environment variables and secrets
- CORS and WebSocket origin configuration
- health checks
- logs
- smoke checks
- release gates
- rollback expectations
- portfolio/demo readiness

Out of scope:

- final hosting provider selection
- paid provider cost optimization
- custom domain purchase
- enterprise-grade SRE
- distributed tracing beyond V1 minimum
- long-term data retention policy beyond portfolio demo needs
- production moderation operations

## Deployment Goals

- A public demo URL exists for the frontend.
- A public backend base URL exists for API and WebSocket traffic.
- Backend can reach Postgres and Redis in the deployed environment.
- Frontend is configured with deployed API and WebSocket URLs.
- Deploys are reproducible from Git.
- Secrets are not committed.
- A failed deploy is detectable quickly.
- A successful deploy runs smoke checks before being considered releasable.

## Environments

| Environment | Purpose | Required |
| --- | --- | --- |
| Local | Developer and agent implementation loop. | Yes |
| Preview | Optional branch/PR validation. | Recommended |
| Production Demo | Public portfolio/demo environment. | Yes |

V1 may ship with only Local and Production Demo if Preview adds too much overhead, but CI must still validate before production deploy.

## Runtime Components

### Backend

Required:

- Java 17 runtime
- Spring Boot application server
- Postgres connection
- Redis connection
- Flyway migrations enabled
- JWT secret from environment
- CORS origins from environment
- WebSocket allowed origins from environment
- health endpoint
- structured enough logs for diagnosis

### Frontend

Required:

- Next.js production build
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- production-safe source maps policy decided in Tech Design
- browser-compatible WebSocket/SockJS connection to backend
- no dependency on localhost in production

### Data Services

Required:

- Postgres for persistent users, tables, matches, words, and match history
- Redis for sessions, lobby/table presence, invites, initial dice transient state, word-card transient state, and reconnection windows
- durable enough Postgres storage for demo continuity
- Redis data may be ephemeral in V1, but session/reconnection behavior must be tested after deploy

## Environment Variables

Backend required variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_DATA_REDIS_HOST`
- `SPRING_DATA_REDIS_PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `APP_CORS_ALLOWED_ORIGINS`
- `APP_WS_ALLOWED_ORIGINS`

Frontend required variables:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

Rules:

- no production secret is committed
- local defaults may exist only in local profile or sample env files
- sample env files must use fake values
- CI must not print secrets
- backend fails fast if required production secrets are missing

## Health Checks

Backend must expose:

- liveness: application process is up
- readiness: application can reach required dependencies

Minimum readiness dependencies:

- Postgres
- Redis

Recommended endpoint shape:

- `GET /actuator/health/liveness`
- `GET /actuator/health/readiness`

If Actuator is not used, an equivalent documented endpoint is acceptable, but it must be implemented and tested.

Frontend health:

- production frontend route returns HTTP 200
- main page loads without runtime config error
- browser can reach backend API health endpoint

WebSocket health:

- deployed frontend can establish authenticated STOMP connection after login
- backend accepts deployed frontend origin
- connection failure is visible in frontend logs/UI during smoke

## Observability Requirements

Backend logs should include:

- application startup
- Flyway migration result
- database connection failure
- Redis connection failure
- auth login failure reason category without leaking credentials
- WebSocket connect/disconnect user id
- table creation
- invite accept/reject
- match start
- round start
- correct guess
- timeout
- reconnection pause/resume/forfeit
- unhandled errors with request or event context

Frontend should surface or log:

- failed API request
- failed WebSocket connection
- auth restore failure
- state restore failure
- media permission failure
- deploy-time missing environment variable, when detectable

Minimum production-demo diagnostics:

- ability to see backend logs
- ability to see frontend build/deploy logs
- ability to inspect failed health checks
- documented smoke command or checklist

## CI Requirements

CI must eventually validate:

- backend compile
- backend tests
- frontend install
- frontend build
- executable contract validation
- smoke-test harness when deploy target is available

CI should block merge or release if:

- contracts fail validation
- backend tests fail
- frontend build fails
- required env-var documentation is missing for new runtime dependency
- smoke tests fail against production demo

## Post-Deploy Smoke Requirements

Minimum smoke checklist:

- frontend URL returns 200
- backend readiness health returns healthy
- register user works
- login works
- lobby loads authenticated user
- WebSocket connects after login
- lobby online user update is received
- create table works
- invite flow works with a second user/session
- four-player table can start match
- match state event is received
- one gameplay happy path round can complete
- refresh during match restores state
- disconnect/reconnect smoke validates pause/resume or documented manual equivalent

The full four-player smoke can be automated later. Before automation exists, the manual checklist must be explicit enough for a human or agent to run consistently.

## Release Gates

V1 release candidate is not accepted until:

- all accepted functional specs have corresponding test coverage or justified deferral
- production demo deploy succeeds
- post-deploy smoke passes
- no production secrets are committed
- contracts are in sync with deployed behavior
- known critical UX states render: loading, error, paused, reconnecting, final
- rollback or redeploy path is documented

## Rollback And Recovery

V1 minimum:

- previous deploy can be redeployed or restored from provider history
- database destructive migrations require explicit approval
- Flyway migration failure blocks startup or deploy
- failed production deploy does not silently replace last known good demo

## Security Requirements

- JWT secret must be environment-provided in production
- CORS allows only known frontend origins in production
- WebSocket origins allow only known frontend origins in production
- Swagger/OpenAPI UI exposure in production must be decided in Tech Design
- static WebSocket test page must not expose production-sensitive behavior
- logs must not include passwords, JWTs, or selected mime words broadly

## Portfolio Demo Requirements

- public README explains what Mimico is
- README links to live demo when available
- README explains tech stack and AI-assisted workflow at a high level
- demo has seed or instructions for four-player testing
- if real-time play requires multiple browsers/users, instructions are explicit
- known limitations are documented honestly

## Testing Requirements

### Backend

- health endpoint returns healthy when Postgres and Redis are available
- health endpoint reports unhealthy when required dependency is unavailable
- production profile reads datasource, Redis, JWT, CORS, and WebSocket origins from environment
- application fails fast on missing production JWT secret
- no production profile uses hardcoded local database credentials

### Frontend

- production build succeeds
- missing `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_WS_URL` has documented fallback behavior
- production API client uses configured URL
- production WebSocket client uses configured URL
- deployed-origin CORS/WebSocket configuration is smoke tested

### Contract

- OpenAPI contract validates in CI
- AsyncAPI contract validates in CI
- JSON Schemas validate sample payloads
- deployed endpoints do not drift from accepted contracts without a contract update

### E2E Smoke

- deploy smoke can create auth session
- deploy smoke can connect WebSocket
- deploy smoke can create or join table
- deploy smoke can receive a match/table event

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| Backend `application.properties` contains localhost datasource, Redis, and JWT secret values. | Production config should use environment variables and fake-only sample values. |
| Backend Dockerfile expects `target/mimico-0.0.1-SNAPSHOT.jar` to exist before image build. | Build pipeline should produce the jar or use a multi-stage Docker build. |
| Backend docker-compose only defines Postgres and Redis. | Local orchestration should optionally include backend and frontend or document commands clearly. |
| `JwtAuthenticationFilter` allows `/actuator/health`, but actuator dependency/config is not present. | Health checks should be real and tested. |
| CORS allowed origins are hardcoded local origins. | Production origins should be environment-driven. |
| WebSocket allowed origins are hardcoded local origins. | Production WebSocket origins should be environment-driven. |
| Frontend has no Dockerfile or hosting config. | Deploy target should define reproducible frontend build/deploy path. |
| Frontend README is default Next.js text. | README should explain Mimico, live demo, stack, and run/deploy instructions. |
| No CI workflow is currently present for root, backend, or frontend. | CI should validate build/test/contracts before release. |
| No post-deploy smoke checklist exists. | Release checklist should include deploy smoke steps. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, tests, contracts, and later Tech Design.

| ID | Decision |
| --- | --- |
| `SPEC-007-AD-001` | Keep this spec provider-agnostic and choose hosting provider later in a Tech Design. |
| `SPEC-007-AD-002` | Require a public production demo for V1, not only local instructions. |
| `SPEC-007-AD-003` | Require real backend readiness health that checks Postgres and Redis. |
| `SPEC-007-AD-004` | Require post-deploy smoke as a release gate, even before full automation exists. |
| `SPEC-007-AD-005` | Treat committed production secrets as release-blocking. |
