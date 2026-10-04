# Workstream — complete multiplayer

## Outcome

Four authenticated browser clients can enter one table and finish a match with
authoritative gameplay, video, chat, reconnection, and rematch.

## Non-goals

- Visual redesign, accessibility polish, and viewport acceptance. Those belong
  to product quality.
- Production deployment, DNS, secret rotation, and TURN provisioning. Those
  belong to production release.
- Email confirmation, password recovery, matchmaking, spectators, bots, custom
  rules, and tables larger than four players.

## Repositories

| Repository | Owns in this task |
|---|---|
| `mimico` (this repo) | this workstream and cross-repository decisions |
| `api-mimico` | authenticated signaling and media pause/resume |
| `mimico-game` | media session, game-page presentation, four-client harness |

Shared-file ownership for the first verticals:

- WebSocket configuration, match-state schema, and the shared event envelope:
  backend signaling branch. No new Flyway version. `PauseReason.MIME_MEDIA_FAILED`
  and the V12 check already exist.
- Game page: frontend media branch. The gameplay Zustand slice and the STOMP
  client class stay unchanged; media uses the existing `stompClient` publish
  and subscribe methods and a separate media store.
- E2E scaffolding lives on its own frontend branch and does not edit the game
  page, stores, or STOMP adapter.

## Decision

Authenticated match signaling uses the existing STOMP channel. The public
PeerJS broker is not used. PeerJS media connections require that broker, so
they cannot enforce match membership. The browser session is an
`RTCPeerConnection` mesh with one local stream and up to three remote streams.
The `peerjs` dependency may remain installed, but application code must not
open a third-party media socket.

STUN servers come from `NEXT_PUBLIC_STUN_URLS`, defaulting to
`stun:stun.l.google.com:19302`. TURN credentials stay outside the repository.
Until a real network test selects a TURN provider, a peer that cannot connect
with STUN stays in an explicit failed media state. That failure pauses the
match when it is the mime player's required video.

## Contract

Signaling is ephemeral. The sender is the WebSocket principal, never a user id
in the body.

Client command `/app/match/{matchId}/signal`:

```text
{ "toUserId": "<member uuid>", "kind": "OFFER|ANSWER|CANDIDATE|JOIN|LEAVE", "payload": "<opaque, optional for JOIN and LEAVE>" }
```

The server delivers `/user/queue/match/{matchId}/signal` only to `toUserId`:

```text
{ "type": "MEDIA_SIGNAL", "data": { "matchId", "fromUserId", "kind", "payload" }, "occurredAt" }
```

`OFFER`, `ANSWER`, and `CANDIDATE` are never copied to a shared topic. Payloads
are not logged. A payload longer than 20000 characters is rejected.

Media lifecycle commands, both with the principal as the only actor:

- `/app/match/{matchId}/media/unavailable`
- `/app/match/{matchId}/media/available`

Pause and resume reuse `/topic/match/{matchId}/paused`,
`/topic/match/{matchId}/resumed`, and `MATCH_STATE_UPDATED` on
`/topic/match/{matchId}/state`.

## Behavior examples

```text
Given four authenticated players in one match
When one player sends an OFFER to another member
Then only that member receives MEDIA_SIGNAL
And the shared match topics do not contain the payload
And the payload is not written to logs
```

```text
Given a user who is not a member of the match
When that user sends a signaling command
Then the command is rejected
And no member receives MEDIA_SIGNAL
```

```text
Given the current mime player has required video
When that player reports the video unavailable during an active match
Then the match pauses with pauseReason MIME_MEDIA_FAILED
And disconnectedUserId and reconnectDeadline stay empty
And gameplay commands are rejected
And the pause is not a reconnection forfeit
```

```text
Given a match already paused with MIME_MEDIA_FAILED
When the same mime player reports video unavailable again
Then the match stays paused once
And no second pause transition is stored
```

```text
Given a match paused with MIME_MEDIA_FAILED
And no player has a pending disconnect
When the current mime player reports video available
Then the match resumes
And the round timer continues from the remaining duration
```

```text
Given a match paused with PLAYER_DISCONNECTED
When the mime player reports video available
Then the match stays paused for the disconnect
And the reconnection deadline does not change
```

```text
Given a match paused with MIME_MEDIA_FAILED
When a player disconnects
Then the pause reason becomes PLAYER_DISCONNECTED
And that player receives a 60 second reconnection window
And the stored remaining round duration is kept
```

```text
Given a player is already the disconnected player
When that player disconnects again
Then the pause is not stored a second time
```

```text
Given the local player is the mime player and guessing is active
When camera permission is denied or the local video track ends
Then the client sends media/unavailable
And the page shows a permission or failed-media state
```

```text
Given four controlled browsers with fake camera devices
When they join the same match media session
Then each page has one local stream and three remote streams
And the mime player's video is visually primary
And leaving the page stops the local tracks
```

## Remaining verticals

Signaling, media pause, and the media-session code already exist. The remaining
work is four large slices. Do not split them into task files.

### A — Unblock the table (`api-mimico`)

Land the three PostgreSQL defects that stop four people from sitting down:

- HTTP tables at `/api/tables`;
- Flyway V13: `game_tables.status` as `VARCHAR(32)` with the five `TABLE_*`
  values;
- invite delivery without a lazy `GameTableEntity.host` read.

One backend PR. Local branch `feature/api-tables-path-075d` already has this.
Nothing else starts on a clean `develop` until this merges.

### B — First live round (`mimico-game` + patched API)

Four browsers finish one turn: initial roll, dice, private card, one correct
guess. Merge the open media PR and the board-track branch. Fix only what
blocks that path. Keep all four clients connected so a disconnect pause does
not abort the playtest.

Word catalog stays as-is. Difficulty is unused; do not expand the seed here.

### C — Close the match (both apps)

Same four clients through steal, timeout, disconnect/reconnect, mime-media
pause, abandonment, natural win, and rematch. Change rules or contracts only
when the live path proves a gap.

### D — Four-browser harness (`mimico-game`)

Automate B and C against PostgreSQL and Redis with fake cameras. Scaffold may
start after A. It does not close the workstream without a passing live path.

Order: A, then B. C and D after B; D scaffolding may overlap C.

## Risks

- A disconnect that arrives during a media pause must not erase the remaining
  round duration or skip the forfeit window.
- SDP and ICE payloads must not land in logs, public topics, or error bodies.
- The four-browser proof is incomplete until it runs against PostgreSQL and
  Redis with real or browser-provided test media. Unit tests do not close this
  workstream.
- TURN is unresolved until a network test. STUN-only failure must stay visible.

## Completion

This workstream is complete when four controlled browsers finish one match
against PostgreSQL and Redis, including video, a normal guess, a special steal,
timeout, disconnect, reconnection, mime-media pause and resume, abandonment,
natural victory, and rematch, and the focused backend and frontend suites pass.
Production deployment is out of scope.

## Rollback

Revert each vertical independently. Vertical A includes Flyway V13; roll that
back with the backend PR if needed. B–D add no schema.
