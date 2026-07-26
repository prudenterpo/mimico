# SPEC-004 - Video and Chat

Status: Accepted  
Date: 2026-07-26

## Overview

This functional spec defines video visibility, media permissions, and chat behavior across lobby, table, and match contexts.

This document exists because Mimico is not only a turn-based rules system. The core player experience depends on real-time video and chat being clear, permissioned, and synchronized with match state. Video and chat also cut across frontend, backend, WebSocket contracts, browser permissions, and gameplay rules.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `harness/HARNESS-001-agent-execution.md`
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`

## Scope

In scope:

- lobby chat
- table chat
- round chat and guess channel
- chat permission rules by round context
- video requirement for V1 gameplay
- camera/microphone permission UX
- video visibility during match setup and rounds
- mime-focused video during guessing
- graceful handling of media permission failure
- mobile and desktop video/chat UX

Out of scope:

- final WebRTC architecture details
- TURN/STUN provider selection
- recording
- replay
- moderation/admin tooling
- persistent chat history
- screen sharing

## Actors

- Lobby user
- Table player
- Match player
- Mime player
- Eligible guesser
- Ineligible guesser

## Chat Contexts

| Context | Purpose | Persistence | Eligibility |
| --- | --- | --- | --- |
| Lobby chat | Global social chat before table | current session only | authenticated lobby users |
| Table chat | Coordination before match and between matches | ephemeral V1 | accepted table players |
| Round chat | Guess channel during gameplay | cleared/reset between rounds | depends on round state and tile |

## Video Contexts

| Context | Video Behavior |
| --- | --- |
| Lobby | no video required |
| Table setup | optional local media check is allowed but not required |
| Match setup | players should complete media permission readiness before gameplay actions |
| Guessing round | mime player video is primary and visible to other players |
| Non-guessing phases | video may show all players in smaller grid or inactive state |
| Match paused | video may remain connected, but gameplay actions are disabled |

## User Stories

### SPEC-004-US-001 - Lobby Chat

As an authenticated lobby user, I can chat globally before joining a table.

Acceptance criteria:

- only authenticated users can send messages
- messages use canonical event envelope
- messages include sender identity, text, and timestamp
- messages are not persisted as long-term history
- messages are capped at 500 characters

### SPEC-004-US-002 - Table Chat

As an accepted table player, I can chat with table players before the match and between matches.

Acceptance criteria:

- only accepted table players can send table chat
- pending invitees cannot send table chat
- rejected users cannot send table chat
- table chat remains available in `TABLE_WAITING`, `TABLE_READY_TO_START`, and `TABLE_BETWEEN_MATCHES`
- table chat is unavailable or hidden during active match gameplay if round chat is active

### SPEC-004-US-003 - Round Chat Normal Tile

As the current team partner, I can guess during a normal tile round.

Acceptance criteria:

- mime player cannot send guesses
- current team partner can send guesses
- opponent players cannot send guesses
- ineligible players see why chat input is disabled
- incorrect guesses are visible to eligible chat viewers
- correct guess resolves the round

### SPEC-004-US-004 - Round Chat Special Tile

As any non-mime player, I can guess during a special tile round.

Acceptance criteria:

- mime player cannot guess
- current team partner can guess
- opponent players can guess
- opponent correct guess resolves as `STEAL`
- all eligible guessers can see incorrect guesses

### SPEC-004-US-005 - Mime Video

As a guesser, I can clearly see the mime player during the guessing phase.

Acceptance criteria:

- mime player video is visually primary during `ROUND_GUESSING`
- mime player name is visible
- current word is visible only to mime player
- non-mime players do not see selected word
- if mime video fails, the UI shows clear recovery state

### SPEC-004-US-006 - Media Permission

As a match player, I can grant camera/microphone access before gameplay depends on it.

Acceptance criteria:

- browser permission request is triggered from a user action
- permission denied state is visible and recoverable
- users can retry media permission
- match cannot enter a normal guessing experience without mime media ready unless fallback mode is explicitly active

### SPEC-004-US-007 - Mobile Video And Chat

As a mobile player, I can see video, timer, and chat without the UI fighting the keyboard.

Acceptance criteria:

- timer remains visible during guessing
- chat input does not overlap critical controls
- mime video remains reachable while typing
- disabled chat state is clear
- tap targets are usable

## Functional Flow

### Media Readiness Flow

1. Player enters match setup.
2. UI asks player to enable camera and microphone.
3. Browser prompts for media permission from a user action.
4. If permission succeeds, local preview or ready indicator appears.
5. If permission fails, UI shows retry path and reason.
6. During gameplay, current mime player must have active video or a fallback state must be shown.

### Round Chat Flow

1. Server broadcasts `MATCH_STATE_UPDATED`.
2. Client derives chat eligibility from `roundState`, `currentTeam`, `currentMimePlayerId`, `isSpecialTile`, and player team.
3. Eligible player sends `/app/match/{matchId}/chat`.
4. Server validates eligibility again.
5. Server broadcasts `GUESS_RECEIVED`.
6. If guess is correct, server broadcasts `CORRECT_GUESS` and updated match state.

### Mime Video Flow

1. Round enters `ROUND_GUESSING`.
2. Current mime player's video becomes primary.
3. Non-mime players watch and guess according to eligibility.
4. Mime player sees selected word and timer, but chat input is disabled for guessing.
5. Round resolves by correct guess, steal, timeout, forfeit, or match finish.
6. Video layout returns to non-guessing state or next round state.

## Contract Usage

Existing accepted contracts cover chat command and game events:

- `/app/lobby/chat`
- `/app/match/{matchId}/chat`
- `LOBBY_MESSAGE_POSTED`
- `GUESS_RECEIVED`
- `CORRECT_GUESS`
- `MATCH_STATE_UPDATED`

Contracts need expansion for:

- table chat command/event
- media readiness event
- video signaling events or tech design link
- user media error/fallback event, if server-mediated

## UI Requirements

### Chat

- chat input clearly indicates context: lobby, table, or round
- disabled chat input gives reason
- incorrect guesses are visually normal chat messages
- correct guess receives distinct feedback
- chat does not reveal selected word to ineligible players
- chat message max length is 500 characters

### Video

- mime video is the dominant visual during guessing
- non-mime player videos may be secondary thumbnails
- media permission errors are actionable
- loading state is explicit while connecting peers
- no blank video region without status text
- video UI remains stable on mobile and desktop

## State Requirements

Client chat state:

- `context`
- `messages`
- `canSend`
- `disabledReason`
- `maxLength`

Client media state:

- `localStreamStatus`
- `remoteStreamStatusByPlayer`
- `currentPrimaryVideoPlayerId`
- `mediaPermissionStatus`
- `retryAvailable`

Possible media statuses:

- `MEDIA_NOT_REQUESTED`
- `MEDIA_REQUESTING`
- `MEDIA_READY`
- `MEDIA_DENIED`
- `MEDIA_UNAVAILABLE`
- `MEDIA_CONNECTION_FAILED`

## Validation And Errors

Chat errors:

- unauthenticated
- not in table/match
- not accepted table player
- message empty
- message too long
- player not eligible to guess
- match paused
- round not guessing

Media errors:

- browser permission denied
- no camera found
- no microphone found
- peer connection failed
- remote stream unavailable

All server-mediated errors should use canonical `ErrorResponse`.

## Testing Requirements

### Backend

- lobby chat rejects unauthenticated sender
- table chat rejects non-table player
- round chat rejects mime player
- normal tile rejects opponent guess
- special tile accepts opponent guess
- match paused rejects guesses
- correct guess event is emitted only after server validation

### Frontend

- chat input disabled for ineligible players
- disabled reason renders
- lobby/table/round chat contexts do not mix messages
- mime player sees word and no guess input
- non-mime players do not see word
- media permission success state
- media permission denied state
- mobile video/chat layout smoke

### Contract

- chat events match AsyncAPI
- event envelopes match JSON Schema
- chat errors match `error.schema.json`

### E2E Smoke

- lobby chat works
- table chat works
- normal tile allows only current team partner to guess
- special tile allows all non-mime players to guess
- mime player cannot guess
- video permission can be granted and mime video area becomes ready

## Accessibility Requirements

- chat input has accessible label for each context
- disabled input reason is text-visible
- media permission retry button is keyboard reachable
- video regions have player names
- timer and correct guess feedback are not color-only

## Observability Requirements

Backend should log:

- rejected chat reason
- correct guess without leaking selected word to broad logs
- media readiness event if server-mediated
- signaling failures if signaling is server-mediated

Frontend should surface:

- media permission denied
- camera/microphone unavailable
- peer connection failure
- WebSocket chat send failure

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| `mimico-game/src/lib/peer.ts` is empty. | Video implementation needs a concrete Tech Design and implementation. |
| Game page uses placeholder video blocks. | Game page must render real local/remote stream states. |
| Round chat exists but event shape is not canonical. | Chat must use standard envelopes and canonical event names. |
| Table chat appears in frontend store but is not in accepted contracts yet. | Contracts must expand table chat command/event before implementation. |
| Frontend chat subscriptions mix lobby/table concerns in one connection setup. | Implementation should avoid cross-context message leakage. |
| Backend chat validation currently treats non-active round as free match chat. | Spec separates table chat, round chat, and match phase behavior. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, tests, contracts, and later Tech Design.

| ID | Decision |
| --- | --- |
| `SPEC-004-AD-001` | Microphone audio is enabled in V1 gameplay together with video. |
| `SPEC-004-AD-002` | If mime video fails during a round, the round pauses because video is mandatory for V1. |
| `SPEC-004-AD-003` | Table/setup flow requires media check before match starts to reduce mid-game permission friction. |
| `SPEC-004-AD-004` | Final video architecture is not decided in this functional spec; it requires a dedicated Tech Design. |
