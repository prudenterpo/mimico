# SPEC-005 - Reconnection and Recovery

Status: Accepted
Date: 2026-07-26

## Overview

This functional spec defines how Mimico behaves when a player refreshes, loses WebSocket connection, loses media during a mandatory video moment, reconnects, or fails to return within the allowed recovery window.

This document exists because reconnection is one of the places where real-time games most often become unfair or inconsistent. If the timer keeps running while someone is disconnected, if the board advances while a client is stale, or if refresh creates a second version of the same player, the match stops feeling trustworthy. This spec freezes the expected behavior before implementation agents touch backend timers, frontend state restore, WebSocket events, or media recovery.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `harness/HARNESS-001-agent-execution.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`

## Scope

In scope:

- active match WebSocket disconnection
- active match reconnection
- browser refresh recovery during an active or paused match
- match pause and resume behavior
- round timer freezing while paused
- reconnection timeout and opponent win
- state restoration after reconnect
- host disconnection during active match
- media failure recovery when video is mandatory
- user-facing recovery UI
- backend, frontend, contract, and E2E validation expectations

Out of scope:

- lobby presence semantics except where WebSocket disconnect triggers match recovery
- host transfer
- replacing a player during an active match
- persistent offline mode
- replaying historical match state
- final WebRTC architecture details
- TURN/STUN provider selection

## Actors

- Connected match player
- Disconnected match player
- Reconnecting player
- Host player
- Opponent team
- Waiting teammates
- Browser client after refresh

## Canonical Rules

- A relevant disconnection during `MATCH_ACTIVE` pauses the match.
- A paused match disables gameplay commands.
- The disconnected player has 60 seconds to reconnect.
- The active round timer must not advance while the match is paused.
- Reconnection within 60 seconds restores the same match state.
- If a disconnected player does not return within 60 seconds, the opponent team wins.
- V1 does not support host transfer; host disconnection follows normal reconnection rules.
- A match that ends by reconnection timeout moves the table to `TABLE_BETWEEN_MATCHES`.
- Refresh must be recoverable without creating a duplicate player or advancing gameplay.

## Recovery Contexts

| Context | Expected Behavior |
| --- | --- |
| Lobby refresh | Restore authenticated session and lobby subscriptions. |
| Table setup refresh | Restore table, accepted player status, chat context, and team assignment view. |
| Active match refresh | Temporarily pause if WebSocket disconnect is observed, then restore state on reconnect. |
| Paused match refresh | Restore paused state and remaining reconnection window. |
| Final screen refresh | Restore finished match result and rematch availability. |
| Mime media failure | Pause round because video is mandatory for V1 gameplay. |

## User Stories

### SPEC-005-US-001 - Active Match Disconnect

As a match player, if another player disconnects during gameplay, I see the match pause immediately and understand who we are waiting for.

Acceptance criteria:

- server detects a relevant disconnection for a player in an unfinished active match
- match enters `MATCH_PAUSED`
- gameplay commands are rejected while paused
- pause event identifies the disconnected player
- pause event includes `reconnectDeadline`
- UI shows paused state and countdown
- board position, current team, mime player, selected word, and round state do not change while paused

### SPEC-005-US-002 - Successful Reconnection

As a disconnected player, I can reconnect within 60 seconds and continue the same match.

Acceptance criteria:

- reconnecting player is authenticated as the same user
- server finds pending reconnection for the active match
- server restores current match state to the player
- match exits paused state only when recovery conditions are satisfied
- server broadcasts `PLAYER_RECONNECTED`
- server broadcasts updated `MATCH_STATE_UPDATED`
- round timer resumes with the remaining seconds preserved from pause
- client does not show stale local state after restoration

### SPEC-005-US-003 - Reconnection Timeout

As the opponent team, if a disconnected player does not return within 60 seconds, my team wins by forfeit.

Acceptance criteria:

- server evaluates the timeout based on recorded disconnect time
- match finishes with `finishReason = RECONNECTION_FORFEIT`
- winner team is the disconnected player's opponent team
- table moves to `TABLE_BETWEEN_MATCHES`
- all table players receive match-ended event
- final screen shows winner and reason
- rematch remains available for the same table players

### SPEC-005-US-004 - Browser Refresh Recovery

As a player, if I refresh the page during a table or match, I return to the correct screen and state.

Acceptance criteria:

- client restores auth session before route-sensitive data fetches
- table route can reload table state by `tableId`
- match route can reload active match by `tableId` or `matchId`
- client re-subscribes to canonical WebSocket topics
- restored state comes from server, not from stale local-only state
- if refresh caused a temporary pause, successful reconnect resumes according to normal rules
- if match already ended, client lands on the final/rematch state

### SPEC-005-US-005 - Host Disconnection

As players in a table, if the host disconnects during an active match, the match follows normal reconnection rules.

Acceptance criteria:

- host does not transfer automatically in V1
- host disconnection during active match pauses the match
- host has the same 60-second reconnection window
- host timeout awards win to the opponent team
- after timeout, table is between matches but host-only actions remain unavailable until host returns or future V1 extension changes this

### SPEC-005-US-006 - Mandatory Media Failure

As players in a round, if the mime player's required video fails, the game pauses rather than forcing unfair guessing.

Acceptance criteria:

- mime media failure during `ROUND_GUESSING` enters match pause behavior
- paused UI explains that required video was lost
- round timer freezes
- reconnect/recover window is 60 seconds
- if mime media recovers within the window, round resumes with preserved time
- if mime media does not recover, opponent team wins by forfeit

## Functional Flows

### Disconnect Flow

1. Player is in `MATCH_ACTIVE`.
2. Server receives relevant WebSocket disconnect or mandatory media failure signal.
3. Server records disconnected player, pause reason, pause timestamp, and reconnect deadline.
4. Server computes and stores remaining round seconds if a round timer is active.
5. Match enters `MATCH_PAUSED`.
6. Server broadcasts `MATCH_PAUSED`.
7. Clients disable gameplay commands and show countdown.

### Reconnect Flow

1. Same authenticated user reconnects before `reconnectDeadline`.
2. Server validates pending reconnection.
3. Server sends restored match state to the reconnected user.
4. Server clears resolved reconnection marker.
5. Server recomputes `roundExpiresAt` from stored remaining round seconds.
6. Match returns to `MATCH_ACTIVE` if recovery conditions are satisfied.
7. Server broadcasts `PLAYER_RECONNECTED`.
8. Server broadcasts `MATCH_STATE_UPDATED`.

### Timeout Flow

1. Reconnection window reaches 60 seconds without successful recovery.
2. Server marks match finished.
3. Server sets winner as disconnected player's opponent team.
4. Server sets `finishReason = RECONNECTION_FORFEIT`.
5. Server moves table to `TABLE_BETWEEN_MATCHES`.
6. Server broadcasts match-ended event.
7. Clients render final state with rematch availability.

### Refresh Recovery Flow

1. Browser reloads app.
2. Client restores auth token/session.
3. Client loads route entity from server.
4. Client subscribes to relevant WebSocket topics.
5. Client requests or receives canonical state snapshot.
6. Client replaces local gameplay/table state with server state.
7. Client renders active, paused, between-matches, or finished state according to server.

## Contract Usage

Existing accepted contracts cover these relevant surfaces:

- `GET /api/matches/table/{tableId}`
- `POST /api/matches/{matchId}/forfeit`
- `/topic/match/{matchId}/paused`
- `/topic/match/{matchId}/state`
- `/topic/table/{tableId}/match-ended`
- `/user/queue/game-state`

Contracts need expansion or tightening for:

- canonical `MATCH_PAUSED` event schema
- canonical `PLAYER_RECONNECTED` event schema
- canonical `MATCH_STATE_RESTORED` user event schema
- reconnect deadline fields
- remaining round seconds fields
- `finishReason = RECONNECTION_FORFEIT`
- media failure pause reason, if server-mediated

All real-time payloads must use the canonical event envelope:

- `type`
- `data`
- `occurredAt`

## UI Requirements

- paused state is visually distinct from active gameplay
- paused state names the disconnected or recovering player
- countdown is visible to all players
- current board, teams, mime, and word visibility remain stable while paused
- gameplay buttons and guess input are disabled while paused
- disabled controls explain `match paused`
- reconnecting player sees a restoring state before gameplay UI resumes
- final timeout state clearly says win by reconnection forfeit
- refresh recovery does not briefly show misleading local-only state as if it were authoritative

## State Requirements

Server match pause state:

- `isPaused`
- `pausedAt`
- `pauseReason`
- `disconnectedUserIds`
- `reconnectDeadline`
- `remainingRoundSecondsOnPause`

Client recovery state:

- `connectionStatus`
- `lastServerStateVersion`
- `isRestoring`
- `pausedByUserIds`
- `reconnectDeadline`
- `remainingReconnectSeconds`
- `restoreError`

Allowed connection statuses:

- `CONNECTED`
- `RECONNECTING`
- `RESTORING_STATE`
- `PAUSED_BY_DISCONNECTION`
- `RECOVERY_TIMEOUT`
- `DISCONNECTED_FINAL`

Allowed pause reasons:

- `PLAYER_DISCONNECTED`
- `MIME_MEDIA_FAILED`

Allowed finish reasons:

- `RECONNECTION_FORFEIT`
- other reasons defined by `SPEC-003`

## Validation And Errors

Server rejects while match is paused:

- dice roll
- word selection
- guess submission
- manual timeout resolution
- commands from disconnected or unauthenticated users

Server accepts while match is paused:

- authenticated reconnection for pending player
- state restore request
- final match result retrieval

Error cases:

- reconnect without active pending reconnection
- reconnect after timeout
- state restore for user not in table/match
- duplicate WebSocket connection for same user
- stale client command sent with old match state
- media failure signal from non-current mime player

All server-mediated errors should use canonical `ErrorResponse`.

## Testing Requirements

### Backend

- disconnect active match player pauses match
- paused match rejects gameplay commands
- reconnect within 60 seconds resumes match
- reconnect restores match state to user queue
- timer does not expire while match is paused
- resume recomputes `roundExpiresAt` from preserved remaining seconds
- reconnection timeout finishes match
- timeout awards win to opponent team
- timeout moves table to `TABLE_BETWEEN_MATCHES`
- host disconnect follows normal reconnection rules
- mime media failure pauses active guessing round if server-mediated

### Frontend

- paused banner renders disconnected player and countdown
- gameplay controls disabled while paused
- refresh restores table setup state
- refresh restores active match state
- refresh restores paused match state
- reconnecting player shows restoring state before active UI
- timeout result renders winner and forfeit reason
- stale local state is replaced by server snapshot

### Contract

- pause event matches AsyncAPI schema
- reconnect event matches AsyncAPI schema
- state restore user event matches AsyncAPI schema
- match-ended forfeit event matches schema
- event envelopes match JSON Schema
- errors match `error.schema.json`

### E2E Smoke

- four players start match, one refreshes during round, match resumes with same timer context
- one player disconnects for longer than 60 seconds, opponent team wins
- host disconnect during active match does not transfer host
- mime video failure pauses round if media failure signaling is implemented

## Accessibility Requirements

- paused state is announced as status text
- countdown is text-visible and not color-only
- disabled controls keep accessible labels
- reconnecting/restoring state has clear text
- final forfeit reason is visible to screen readers

## Observability Requirements

Backend should log:

- disconnect detected for active match
- match pause with reason and reconnect deadline
- successful reconnection
- state restore sent
- reconnection timeout and winner team
- rejected command while paused

Frontend should surface:

- WebSocket disconnected
- reconnecting
- restoring server state
- failed to restore
- match ended while user was disconnected

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| `ReconnectionService` comment still describes a 1-hour grace period. | Documentation and implementation should consistently use 60 seconds. |
| Pause stores `isPaused` but not `pausedAt`, `pauseReason`, `reconnectDeadline`, or `remainingRoundSecondsOnPause`. | Pause must preserve enough state to resume fairly. |
| Reconnect unpauses immediately after one pending key is resolved. | Resume rules must follow accepted multi-disconnect policy. |
| `RoundTimerService` ignores paused rounds in its query, but pause does not recompute `roundExpiresAt` on resume. | Timer should freeze and resume with preserved remaining seconds. |
| Forfeit currently sets table status to `FINISHED`. | Table should move to `TABLE_BETWEEN_MATCHES` after match end when rematch is possible. |
| Forfeit reason currently uses `FORFEIT`. | Reconnection timeout should use canonical `RECONNECTION_FORFEIT`. |
| Pause/resume payloads do not use canonical event envelope consistently. | Events must use `{ type, data, occurredAt }`. |
| State restore payload is handcrafted and may fail if `currentMimePlayer` is absent. | Restore should use canonical match-state schema and handle all valid phases. |
| Media failure pause is not implemented as a first-class recovery path. | Mime media failure during guessing should pause through the same recovery model. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, tests, contracts, and later Tech Design.

| ID | Decision |
| --- | --- |
| `SPEC-005-AD-001` | Pause immediately when an active match player's WebSocket disconnect is observed. |
| `SPEC-005-AD-002` | If multiple players disconnect while paused, track all disconnected players and resume only when all return; timeout of any disconnected player awards win to that player's opponent team. |
| `SPEC-005-AD-003` | Refresh recovery should use server state by `tableId` as the primary anchor, with `matchId` accepted when already known. |
| `SPEC-005-AD-004` | Mime media failure during guessing uses the same 60-second recovery/forfeit model as WebSocket disconnection. |
