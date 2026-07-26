# DOMAIN-001 - Domain Model and State Machine

Status: Accepted  
Date: 2026-07-25

## Purpose

This document defines the Mimico V1 domain model, lifecycle states, state transitions, invariants, and invalid cases. It consumes `GLOSSARY-001` and prepares the ground for executable contracts.

No implementation task should change gameplay behavior before the relevant state or transition exists here.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `harness/HARNESS-001-agent-execution.md`

## Domain Principles

- The table is the social container.
- The match is the competitive game instance.
- The round is the atomic gameplay attempt.
- The current team owns the turn.
- The mime player is the acting player inside the current team.
- Contracts and UI use one-based board positions from `1` to `52`.
- Backend may use internal zero-based positions only if contracts adapt at the boundary.

## Core Entities

### User

Authenticated account that can enter the lobby and play.

Required attributes:

- `userId`
- `nickname`
- `email`
- auth credentials

Relationships:

- may be online in the lobby
- may be a player in zero or one active table
- may be a match player in zero or one active match

### Table

Private staging and replay container for exactly 4 players.

Required attributes:

- `tableId`
- `name`
- `hostUserId`
- `status`
- `players`
- `teamAssignments`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to one host
- has up to 4 accepted players
- may have pending invites
- may have one active match
- may have multiple historical matches over time

### Invite

Time-limited invitation from a host to an online user.

Required attributes:

- `inviteId`
- `tableId`
- `tableName`
- `hostUserId`
- `invitedUserId`
- `status`
- `expiresAt`

Allowed statuses:

- `INVITE_PENDING`
- `INVITE_ACCEPTED`
- `INVITE_REJECTED`
- `INVITE_EXPIRED`

### TeamAssignment

Explicit host-defined mapping of table players to Team A or Team B.

Required attributes:

- `tableId`
- `team`
- `playerIds`

Rules:

- Team A has exactly 2 players.
- Team B has exactly 2 players.
- Each accepted table player appears in exactly one team.
- Team assignment is required before match start.

### Match

One complete game session created from a table.

Required attributes:

- `matchId`
- `tableId`
- `status`
- `winnerTeam`
- `startedAt`
- `finishedAt`
- `finishReason`

Relationships:

- belongs to exactly one table
- has exactly 4 match players
- has exactly one match state
- has zero or one active round

### MatchPlayer

Snapshot of a user inside a specific match.

Required attributes:

- `matchPlayerId`
- `matchId`
- `userId`
- `team`
- `playerOrder`

Rules:

- team is `A` or `B`
- player order is stable inside the match
- match players do not change after match start

### MatchState

Mutable state for the active or paused match.

Required attributes:

- `matchId`
- `teamAPosition`
- `teamBPosition`
- `currentTeam`
- `currentMimePlayerId`
- `roundState`
- `currentWordId`
- `roundExpiresAt`
- `isPaused`
- `pausedAt`
- `pauseReason`
- `disconnectedUserId`

### Round

Logical gameplay attempt within a match.

V1 may persist round state inside `MatchState`; a separate `Round` table is not required unless implementation needs it.

Required logical attributes:

- `roundId` or implicit round sequence
- `matchId`
- `roundState`
- `currentTeam`
- `mimePlayerId`
- `diceValue`
- `landingTile`
- `isSpecialTile`
- `wordCard`
- `selectedWordId`
- `startedAt`
- `expiresAt`
- `resolvedAt`
- `resolution`

Allowed resolutions:

- `CORRECT_GUESS`
- `STEAL`
- `TIMEOUT`
- `MATCH_FINISHED`
- `FORFEIT`

### Word

Mimeable term.

Required attributes:

- `wordId`
- `text`
- `category`
- `difficulty`

### WordCard

Set of 3 options presented only to the mime player.

Rules:

- exactly 3 words
- exactly one word per V1 category
- valid only for the current round before word selection
- expires when the round resolves

## Table State Machine

### States

| State | Definition |
| --- | --- |
| `TABLE_WAITING` | Table exists, host may invite players, accepted players may chat, host may assign teams. |
| `TABLE_READY_TO_START` | Exactly 4 players are accepted and valid team assignment exists. |
| `TABLE_IN_MATCH` | A match is active or paused in this table. |
| `TABLE_BETWEEN_MATCHES` | Last match finished and same table can start a rematch. |
| `TABLE_CLOSED` | Table cannot be used anymore. |

### Transitions

| From | Command/Event | To | Conditions |
| --- | --- | --- | --- |
| none | `CREATE_TABLE` | `TABLE_WAITING` | authenticated user becomes host |
| `TABLE_WAITING` | `ACCEPT_INVITE` | `TABLE_WAITING` | accepted player count remains below 4 |
| `TABLE_WAITING` | `ASSIGN_TEAMS` | `TABLE_WAITING` | assignment incomplete or accepted player count below 4 |
| `TABLE_WAITING` | `ASSIGN_TEAMS` | `TABLE_READY_TO_START` | exactly 4 accepted players and valid team assignment |
| `TABLE_READY_TO_START` | `START_MATCH` | `TABLE_IN_MATCH` | host starts match |
| `TABLE_IN_MATCH` | `MATCH_ENDED` | `TABLE_BETWEEN_MATCHES` | match finished with winner |
| `TABLE_BETWEEN_MATCHES` | `ASSIGN_TEAMS` | `TABLE_READY_TO_START` | same 4 players, valid assignment |
| any non-closed | `CLOSE_TABLE` | `TABLE_CLOSED` | authorized close/cancel action |

### Invalid Table Cases

- starting a match with fewer or more than 4 accepted players
- starting a match without explicit team assignment
- assigning a player who is not accepted into the table
- assigning one player to both teams
- inviting the host to their own table
- accepting an expired invite
- accepting an invite after the table is closed or in match

## Match State Machine

### States

| State | Definition |
| --- | --- |
| `MATCH_SETUP` | Match record is created and initial turn selection has not completed. |
| `MATCH_ACTIVE` | Match can progress through rounds. |
| `MATCH_PAUSED` | Match is frozen due to reconnection handling. |
| `MATCH_FINISHED` | Match has a winner and cannot be resumed. |

### Transitions

| From | Command/Event | To | Conditions |
| --- | --- | --- | --- |
| none | `START_MATCH` | `MATCH_SETUP` | table is `TABLE_READY_TO_START` |
| `MATCH_SETUP` | `INITIAL_TURN_SELECTED` | `MATCH_ACTIVE` | current team and mime player are set |
| `MATCH_ACTIVE` | `PLAYER_DISCONNECTED` | `MATCH_PAUSED` | disconnected player is in active match |
| `MATCH_PAUSED` | `PLAYER_RECONNECTED` | `MATCH_ACTIVE` | reconnects within 60 seconds |
| `MATCH_PAUSED` | `RECONNECTION_TIMEOUT` | `MATCH_FINISHED` | disconnected player's opponent team wins |
| `MATCH_ACTIVE` | `MATCH_WIN_CONDITION_REACHED` | `MATCH_FINISHED` | a team reaches tile 52 |
| `MATCH_ACTIVE` | `FORFEIT` | `MATCH_FINISHED` | authorized abandonment or timeout consequence |

### Match Finish Reasons

- `BOARD_WIN`
- `RECONNECTION_FORFEIT`
- `MANUAL_FORFEIT`
- `ADMIN_CANCELLED`

## Initial Turn Selection

Initial turn selection determines the first current team and first mime player.

Proposed V1 flow:

1. Host selects one player from Team A and one player from Team B.
2. Each selected player rolls a dice.
3. Highest roll wins the initial turn.
4. On tie, both selected players roll again.
5. Winning team becomes `currentTeam`.
6. Winning player becomes `currentMimePlayerId`.
7. Match moves from `MATCH_SETUP` to `MATCH_ACTIVE`.
8. Round state becomes `ROUND_WAITING_FOR_DICE`.

This flow matches useful existing backend behavior and gives the game a clear ritual before the first round.

## Round State Machine

### States

| State | Definition |
| --- | --- |
| `ROUND_WAITING_FOR_DICE` | Current team must roll the dice. |
| `ROUND_WAITING_FOR_WORD_SELECTION` | Current mime player must choose one word from the word card. |
| `ROUND_GUESSING` | Timer is running and eligible players may send guesses. |
| `ROUND_RESOLVED` | Round is complete and the next round or match finish must be determined. |

### Transitions

| From | Command/Event | To | Conditions |
| --- | --- | --- | --- |
| `ROUND_WAITING_FOR_DICE` | `ROLL_DICE` | `ROUND_WAITING_FOR_WORD_SELECTION` | authorized current-team action; dice value 1..6 |
| `ROUND_WAITING_FOR_WORD_SELECTION` | `WORD_CARD_DRAWN` | `ROUND_WAITING_FOR_WORD_SELECTION` | card is visible only to mime player |
| `ROUND_WAITING_FOR_WORD_SELECTION` | `SELECT_WORD` | `ROUND_GUESSING` | selected word belongs to current word card |
| `ROUND_GUESSING` | `CORRECT_GUESS` by same team | `ROUND_RESOLVED` | guess matches selected word |
| `ROUND_GUESSING` | `CORRECT_GUESS` by opponent on special tile | `ROUND_RESOLVED` | steal occurs |
| `ROUND_GUESSING` | `ROUND_TIMED_OUT` | `ROUND_RESOLVED` | no correct guess before timer expiration |
| `ROUND_RESOLVED` | `NEXT_ROUND_READY` | `ROUND_WAITING_FOR_DICE` | no win condition |
| `ROUND_RESOLVED` | `MATCH_WIN_CONDITION_REACHED` | terminal | team reached tile 52 |

### Round Effects

#### Dice Rolled

- current team's board position advances by dice value
- position is capped at tile 52
- landing tile determines whether round is special
- if landing tile is tile 52, match can finish immediately with `BOARD_WIN`

#### Word Selected

- current word is set
- round timer starts
- `roundExpiresAt` is set to current time plus 60 seconds
- guessing becomes active

#### Correct Guess By Current Team

- round resolves as `CORRECT_GUESS`
- current team keeps the turn
- mime player rotates to the other player on the same team
- chat for the resolved round is cleared or hidden from the next round
- if board position is tile 52, match finishes

#### Correct Guess By Opponent On Special Tile

- round resolves as `STEAL`
- opponent team becomes current team for the next turn
- next mime player is selected from the new current team
- chat for the resolved round is cleared or hidden from the next round

#### Timeout

- round resolves as `TIMEOUT`
- current team loses the turn
- opponent team becomes current team
- next mime player is selected from the new current team
- chat for the resolved round is cleared or hidden from the next round

## Guess Eligibility Matrix

| Context | Mime Player | Current Team Partner | Opponent Players |
| --- | --- | --- | --- |
| Before round | may chat freely | may chat freely | may chat freely |
| Normal tile guessing | cannot chat/guess | may guess | cannot guess |
| Special tile guessing | cannot chat/guess | may guess | may guess |
| Paused match | cannot guess | cannot guess | cannot guess |
| Between rounds | may chat freely | may chat freely | may chat freely |

## Position Model

Public position rules:

- board positions are one-based in UI and contracts
- first playable position is `1`
- final position is `52`
- new teams begin before tile `1`
- contracts should represent pre-board position as `0`
- special tiles use one-based positions

Movement:

- `newPosition = min(previousPosition + diceValue, 52)`
- if `newPosition == 52`, the team wins

## Mime Rotation

Within a team, mime player rotates after each resolved round involving that team.

Rules:

- if current team guesses correctly, current team keeps turn and mime rotates within same team
- if timeout occurs, turn switches and next mime is selected from opponent team
- if steal occurs, turn switches and next mime is selected from stealing team

Accepted decision:

- Track last mime per team and alternate, so both players share mime responsibility fairly.

## Reconnection Model

Relevant disconnection during `MATCH_ACTIVE`:

1. match moves to `MATCH_PAUSED`
2. active timer freezes logically
3. disconnected user and pause timestamp are recorded
4. all clients are notified
5. disconnected player has 60 seconds to reconnect

Successful reconnection:

1. disconnected player reconnects within 60 seconds
2. match state is restored to that player
3. match resumes as `MATCH_ACTIVE`
4. round timer resumes with remaining time, not a fresh 60 seconds

Timeout:

1. disconnected player does not reconnect within 60 seconds
2. disconnected player's opponent team wins
3. match moves to `MATCH_FINISHED`
4. table moves to `TABLE_BETWEEN_MATCHES`

Accepted implementation direction:

- Store `remainingRoundSecondsOnPause` when pausing and compute a new `roundExpiresAt` on resume.

## Rematch Model

After `MATCH_FINISHED`:

1. table moves to `TABLE_BETWEEN_MATCHES`
2. same 4 players remain in table
3. host may redefine teams
4. host starts new match after valid team assignment
5. new match gets new `matchId`
6. previous match remains immutable

## Domain Events

Domain events are facts that may map to WebSocket events, logs, analytics, or tests.

| Event | Trigger |
| --- | --- |
| `TABLE_CREATED` | table persisted and host assigned |
| `TABLE_INVITE_CREATED` | invite sent to online user |
| `TABLE_PLAYER_JOINED` | invite accepted |
| `TABLE_TEAMS_ASSIGNED` | host submitted valid teams |
| `MATCH_CREATED` | match initialized from table |
| `INITIAL_TURN_SELECTED` | initial dice selection completed |
| `DICE_ROLLED` | current team roll accepted |
| `TEAM_ADVANCED` | board position changed |
| `WORD_CARD_CREATED` | 3 word options drawn |
| `WORD_SELECTED` | mime selected active word |
| `ROUND_STARTED` | timer started |
| `GUESS_ACCEPTED` | eligible chat message accepted |
| `ROUND_RESOLVED` | round outcome determined |
| `TURN_CHANGED` | current team changed |
| `MIME_PLAYER_CHANGED` | mime player changed |
| `MATCH_PAUSED` | relevant disconnection paused match |
| `MATCH_RESUMED` | reconnection restored match |
| `MATCH_FINISHED` | winner decided |
| `REMATCH_READY` | table returned to rematch setup |

## Invalid Domain Cases

Agents must treat these as validation failures, not recoverable normal flows:

- non-host starts match
- host starts match before exactly 4 accepted players
- host starts match before explicit team assignment
- team assignment references non-table player
- match starts with duplicate player IDs
- dice rolled before initial turn selection
- dice rolled while round timer is active
- word selected before dice roll
- word selected by non-mime player
- word selected outside current word card
- guess accepted from mime player
- opponent guess accepted on normal tile
- timer expires while match is paused
- match resumes after reconnection timeout
- finished match receives gameplay command
- rematch mutates previous match instead of creating a new match

## Known Code Mismatches

These are not implementation tasks yet. They are domain alignment notes for later specs, contracts, and task graph.

| Current Code Behavior | Domain Target |
| --- | --- |
| Table readiness can auto-start when 4 players mark ready. | Host explicitly starts after exactly 4 players and valid team assignment. |
| `StartMatchRequestDTO` accepts `playerIds` only. | Start-match command must include explicit `teamAssignments`. |
| Backend assigns teams by alternating player order. | Host-defined manual team assignment wins. |
| Match state initializes positions as `0`. | Public contracts may expose `0` as pre-board and `1..52` as board tiles. |
| Table status becomes `FINISHED` after match end/forfeit. | Table should move to `TABLE_BETWEEN_MATCHES` when rematch is possible. |
| `currentTurn` appears in response DTO. | Canonical contract name should be `currentTeam`. |
| Timer pause currently stores `isPaused` but not remaining seconds. | Pause should preserve remaining round time. |
| Initial turn selection uses `sorteio` naming. | Product docs should call it initial turn selection; UI may use Portuguese label if desired. |

## Accepted Decisions

These decisions are accepted and must be carried into contracts, specs, tests, and tasks.

| ID | Decision |
| --- | --- |
| `DOMAIN-AD-001` | Mime player alternates within each team across the match. |
| `DOMAIN-AD-002` | V1 keeps the initial turn dice selection ritual: host chooses one player from each team, both roll, highest starts, ties reroll. |
| `DOMAIN-AD-003` | A team wins immediately when it reaches tile 52 after a dice roll. |
| `DOMAIN-AD-004` | Round chat is ephemeral in V1: it is deleted/reset between rounds and no persistent match chat audit is required. |
