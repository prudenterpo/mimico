# SPEC-003 - Match Gameplay

Status: Accepted  
Date: 2026-07-25

## Overview

This functional spec defines the core Mimico V1 match loop: initial turn selection, dice roll, board movement, word card, word selection, round timer, guessing, correct guess handling, steal, timeout, turn changes, mime rotation, win condition, match end, and rematch entry.

This document exists because gameplay is the highest-risk area for state drift. Every frontend action, backend rule, WebSocket event, and test must agree on the same match and round state machine.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `contracts/openapi/mimico-v1.yaml`
- `contracts/asyncapi/mimico-realtime-v1.yaml`
- `harness/HARNESS-001-agent-execution.md`

## Scope

In scope:

- match setup after table start
- initial turn dice selection
- current team and mime player selection
- dice roll and board movement
- special tile detection
- word card draw
- word selection by mime player
- 60-second guessing timer
- round chat as guess channel
- guess validation
- same-team correct guess
- opponent steal on special tile
- timeout
- turn switching
- mime rotation
- immediate victory on tile 52
- match end event
- route back to rematch setup

Out of scope:

- auth and lobby
- table creation/team assignment
- actual video transport details
- active-match reconnection details
- word database curation
- ranking/history/replay

## Actors

- Host
- Current team player
- Mime player
- Current team partner
- Opponent player
- Spectating table player does not exist in V1; every table player is a match player

## User Stories

### SPEC-003-US-001 - Initial Turn Selection

As host, I can start the match with a short dice ritual that decides the first team and first mime player.

Acceptance criteria:

- match starts in `MATCH_SETUP`
- host selects one player from Team A and one from Team B
- selected players roll one dice each
- highest roll wins first turn
- ties require both selected players to reroll
- winner team becomes `currentTeam`
- winner player becomes `currentMimePlayerId`
- match moves to `MATCH_ACTIVE`
- round state becomes `ROUND_WAITING_FOR_DICE`

### SPEC-003-US-002 - Roll Dice

As the current team, I can roll the dice to advance on the board.

Acceptance criteria:

- dice can be rolled only in `ROUND_WAITING_FOR_DICE`
- dice value is 1 to 6
- current team position advances by dice value
- position is capped at tile 52
- board positions are exposed as `0..52`, where `0` is pre-board
- landing on a special tile marks the round as special
- landing on tile 52 ends the match immediately

### SPEC-003-US-003 - Draw And Select Word

As the current mime player, I can receive 3 word options and choose one.

Acceptance criteria:

- word card can be drawn only after dice roll
- word card contains exactly 3 options
- word card has one word for each category: `eu_sou`, `eu_faco`, `objeto`
- only current mime player receives word text
- selected word must belong to current word card
- selecting word starts the 60-second timer
- round state becomes `ROUND_GUESSING`

### SPEC-003-US-004 - Guess On Normal Tile

As the current team partner, I can submit guesses during the round.

Acceptance criteria:

- mime player cannot guess
- current team partner can guess
- opponent players cannot guess on normal tiles
- guess is evaluated after normalization
- normalization is case-insensitive and accent-insensitive
- exact normalized match is correct
- incorrect guess appears in round chat
- correct guess resolves round as `CORRECT_GUESS`

### SPEC-003-US-005 - Steal On Special Tile

As an opponent player, I can guess during a special-tile round and steal the turn if correct.

Acceptance criteria:

- special tile enables all non-mime players to guess
- opponent correct guess resolves round as `STEAL`
- stealing team becomes next `currentTeam`
- next mime is selected from stealing team
- current team's board movement is not reverted

### SPEC-003-US-006 - Timeout

As players, we see the round end if no one guesses correctly within 60 seconds.

Acceptance criteria:

- timer starts only after word selection
- timer is visible to all players
- when timer expires without correct guess, round resolves as `TIMEOUT`
- turn switches to opponent team
- next mime is selected from opponent team
- no extra steal chance occurs after timeout

### SPEC-003-US-007 - Mime Rotation

As players, we see mime responsibility alternate fairly within each team.

Acceptance criteria:

- each team tracks its last mime player
- when same team keeps the turn, mime rotates to the other player on that team
- when turn switches, new current team uses the next alternating mime for that team
- no player mimes twice for the same team while their teammate has not had a turn, except if state recovery requires it

### SPEC-003-US-008 - Match End

As players, we see the match end when a team reaches tile 52.

Acceptance criteria:

- reaching tile 52 after dice roll ends match immediately
- winner team is recorded
- match status becomes `MATCH_FINISHED`
- table moves to `TABLE_BETWEEN_MATCHES`
- all players receive `MATCH_ENDED`
- gameplay commands are rejected after match finish
- players can proceed to rematch setup

## Functional Flow

### Initial Turn Flow

1. `MATCH_STARTED` routes players to match setup.
2. Host selects one player from each team.
3. Server broadcasts selected players.
4. Each selected player rolls.
5. Server broadcasts each roll.
6. On tie, server broadcasts tie and waits for reroll.
7. On winner, server sets `currentTeam` and `currentMimePlayerId`.
8. Server broadcasts `MATCH_STATE_UPDATED`.

### Round Flow

1. Match is `MATCH_ACTIVE`.
2. Round is `ROUND_WAITING_FOR_DICE`.
3. Current team rolls dice.
4. Server advances board and broadcasts `DICE_ROLLED` and `MATCH_STATE_UPDATED`.
5. If tile 52 reached, server ends match.
6. Otherwise round becomes `ROUND_WAITING_FOR_WORD_SELECTION`.
7. Mime player draws word card.
8. Server sends word card privately to mime player.
9. Mime player selects one word.
10. Server starts timer and broadcasts `WORD_SELECTED`, `ROUND_STARTED`, and `MATCH_STATE_UPDATED`.
11. Eligible players guess through match chat.
12. Server evaluates guesses.
13. Correct guess, steal, or timeout resolves the round.
14. Server broadcasts round resolution and updated match state.
15. Next round returns to `ROUND_WAITING_FOR_DICE` unless match finished.

## REST Contract Usage

Gameplay is primarily realtime after match start.

REST may be used for:

- `GET /api/matches/table/{tableId}` to restore active match state
- `POST /api/matches/{matchId}/forfeit` for explicit forfeit path

## WebSocket Contract Usage

Client commands:

- `/app/match/{matchId}/initial-turn/select`
- `/app/match/{matchId}/initial-turn/roll`
- `/app/match/{matchId}/dice/roll`
- `/app/match/{matchId}/word/draw`
- `/app/match/{matchId}/word/select`
- `/app/match/{matchId}/chat`
- `/app/match/abandon`

Server events:

- `MATCH_STATE_UPDATED`
- `DICE_ROLLED`
- `WORD_CARD_DRAWN`
- `WORD_SELECTED`
- `GUESS_RECEIVED`
- `CORRECT_GUESS`
- `ROUND_TIMED_OUT`
- `TURN_CHANGED`
- `MATCH_ENDED`

All server events must use the standard envelope from `CONTRACTS-001`.

## UI Requirements

### Shared

- show current team
- show current mime player
- show team positions
- show board with 52 tiles
- visually distinguish special tiles
- show current round state
- show action only for eligible actor
- show disabled state with reason for ineligible players
- show timer during guessing
- show match end with winner

### Desktop

- board, video, round controls, and chat are visible without major navigation
- word card is clearly private to mime player
- current action is obvious at a glance

### Mobile

- current action and timer remain prominent
- board and video can be reached without losing chat input
- controls are touch-friendly
- text does not overlap or require tiny tap targets

## State Requirements

Required match state for clients:

- `matchId`
- `tableId`
- `matchStatus`
- `roundState`
- `players`
- `teamAPosition`
- `teamBPosition`
- `currentTeam`
- `currentMimePlayerId`
- `timerEndsAt`
- `isSpecialTile`
- `isPaused`
- `winnerTeam`, when finished

Private mime-only state:

- `wordCard`
- selected word after selection

Server-only state:

- current selected word
- word card validity
- last mime per team
- round resolution
- normalized active word

## Validation And Errors

Gameplay errors:

- match not found
- match not active
- match is paused
- round state does not allow command
- actor is not in match
- actor is not host
- actor is not current mime player
- actor is not eligible guesser
- selected word not in word card
- word card expired
- dice already rolled for current round
- timer already expired
- match already finished

All errors should use canonical `ErrorResponse`.

## Testing Requirements

### Backend

- initial turn selection accepts one player per team
- initial turn tie requires reroll
- initial turn winner sets `currentTeam` and `currentMimePlayerId`
- dice roll advances current team only
- dice roll cannot happen during guessing
- tile 52 ends match immediately
- word card has one option per category
- non-mime cannot draw private word card if not authorized
- word selection rejects word outside card
- timer starts at 60 seconds
- normal tile rejects opponent guess
- special tile accepts opponent guess
- correct same-team guess keeps turn and rotates mime
- correct opponent guess on special tile steals turn
- timeout switches turn
- finished match rejects gameplay commands

### Frontend

- renders board with 52 tiles and special tiles
- renders current team and current mime
- hides word options from non-mime players
- disables ineligible actions with clear state
- updates board from `MATCH_STATE_UPDATED`
- shows timer from server state
- sends guesses only when chat input is eligible
- renders winner screen
- mobile gameplay layout smoke

### Contract

- gameplay WebSocket events match AsyncAPI
- `MATCH_STATE_UPDATED` data matches `match-state.schema.json`
- error responses match `error.schema.json`

### E2E Smoke

- start match from valid table
- complete initial turn selection
- roll dice
- draw and select word
- submit incorrect guess
- submit correct guess
- observe turn/mime update
- force timeout path
- reach tile 52 and observe winner

## Accessibility Requirements

- dice action is keyboard reachable
- word cards are selectable by keyboard for mime player
- timer is text-visible, not color-only
- special tiles are identified by more than color
- chat input has accessible label
- winner state is announced clearly

## Observability Requirements

Backend should log:

- initial turn selection and result
- dice roll and new position
- word card draw without logging selected word to broad logs
- word selection with word ID, not necessarily word text
- guess validation result without leaking secret word to wrong clients
- round resolution
- match finish

Frontend should surface:

- WebSocket command errors
- current round state
- eligibility reason when user cannot act
- sync/recovery failure

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| Game page uses mock state, mock words, and local dice roll. | Game page must consume server match state and send WebSocket commands. |
| Game page local timer counts down independently. | Timer should derive from server `timerEndsAt` and pause/resume state. |
| Current backend switch turn picks first player of team. | Domain requires alternating mime per team. |
| Backend uses `WIN` as match end reason. | Contract uses `BOARD_WIN`. |
| Backend sets table status `FINISHED` when match ends. | Domain requires `TABLE_BETWEEN_MATCHES` when rematch is possible. |
| Existing event names include `ROUND_STARTED`, `WORD_CARD`, `ROUND_TIMEOUT`. | Contract requires canonical names and standard event envelope. |
| Word card draw endpoint may be callable by wrong actor unless validated. | Only current mime player should receive and draw/select word card. |
| Dice roll may not validate actor eligibility fully. | Only authorized current-team action should roll dice. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks and tests.

| ID | Decision |
| --- | --- |
| `SPEC-003-AD-001` | Any current-team player may press the normal round dice button. |
| `SPEC-003-AD-002` | Word text is not revealed to all players after round resolution in V1. |
| `SPEC-003-AD-003` | Incorrect guesses are visible to eligible chat viewers in the round chat. |
| `SPEC-003-AD-004` | Match ends immediately when a team reaches tile 52, before word selection if applicable. |
