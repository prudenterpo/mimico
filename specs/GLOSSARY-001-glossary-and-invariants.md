# GLOSSARY-001 - Glossary and Canonical Invariants

Status: Accepted  
Date: 2026-07-25

## Purpose

This document defines the canonical vocabulary and invariants for Mimico V1. Agents must use these terms when writing specs, contracts, tests, tasks, code comments, prompts, and release checklists.

If existing code uses a different name, the canonical product term in this document wins for new documentation. Code changes may keep legacy names temporarily, but new contracts and new user-facing behavior should move toward the canonical vocabulary.

## Canonical Product Terms

| Term | Canonical English ID | Definition | Notes |
| --- | --- | --- | --- |
| Usuario | `User` | Authenticated person who can enter the lobby and play. | V1 does not support guest users. |
| Jogador | `Player` | A user participating in a table or match. | A user becomes a player within a specific gameplay context. |
| Lobby | `Lobby` | Shared area where authenticated users see online users, chat globally, and create private tables. | Lobby is not a match. |
| Mesa | `Table` | Private staging area created by a host before and between matches. | Existing backend code uses `GameTableEntity`. |
| Host | `Host` | Player who created the table and controls table setup actions. | Host defines teams and starts the match. |
| Convite | `Invite` | Time-limited invitation for an online user to join a table. | Invite acceptance does not start a match by itself. |
| Time | `Team` | One of two groups in a match: Team A or Team B. | Exactly 2 players per team. |
| Partida | `Match` | One complete game session played by exactly 4 players in one table. | Existing backend code uses `MatchEntity`. |
| Revanche | `Rematch` | A new match started from the same table with the same 4 players after a match ends. | Host may redefine teams before rematch. |
| Rodada | `Round` | One timed attempt where the current team advances, a word is selected, and players try to guess. | Duration is fixed at 60 seconds. |
| Turno | `Turn` | The right of a team to play the current round. | The current team owns the turn. |
| Time da vez | `CurrentTeam` | Team currently taking the turn. | Values: `A`, `B`. |
| Mimico | `MimePlayer` | Player who performs the word by video during a round. | Existing code uses `currentMimePlayer`. |
| Palpite | `Guess` | Chat message interpreted as an attempt to match the selected word. | Exact normalized match in V1. |
| Palavra | `Word` | Term to be mimed. | Stored with category and difficulty. |
| Carta de palavras | `WordCard` | Set of 3 word options presented to the mime player. | One option per fixed category. |
| Categoria | `WordCategory` | Classification for word options. | V1 categories: `eu_sou`, `eu_faco`, `objeto`. |
| Tabuleiro | `Board` | Linear path used by teams to race toward victory. | Board length is 52 spaces. |
| Casa | `Tile` | One position on the board. | Positions should be represented consistently in contracts. |
| Casa especial | `SpecialTile` | Tile where all 4 players can guess from the start of the round. | Enables stealing the turn. |
| Roubo | `Steal` | Opponent team correctly guesses on a special tile and takes the next turn. | Only possible on special tiles. |
| Dado | `Dice` | Random value from 1 to 6 used to advance the current team. | Dice is rolled before word selection. |
| Cronometro | `RoundTimer` | 60-second timer for the active round. | Expiration ends the round. |
| Desconexao | `Disconnection` | Player temporarily loses real-time connection during table or match activity. | Match disconnection can pause the match. |
| Reconexao | `Reconnection` | Player returns before the allowed timeout and resumes the same state. | Match pause window is 60 seconds. |
| Pausa | `Pause` | Temporary match state where the game stops due to relevant disconnection. | Existing code uses `isPaused`. |

## Canonical State Terms

These are high-level state names. `DOMAIN-001` will define full state machines and transitions.

### Table States

| State | Definition |
| --- | --- |
| `TABLE_WAITING` | Table exists, players may join, host may define teams, match has not started. |
| `TABLE_IN_MATCH` | A match is currently active in the table. |
| `TABLE_BETWEEN_MATCHES` | Previous match ended, table remains available for rematch. |
| `TABLE_CLOSED` | Table is no longer usable. |

### Match States

| State | Definition |
| --- | --- |
| `MATCH_SETUP` | Match is being created from a valid table and team assignment. |
| `MATCH_ACTIVE` | Match is playable and not paused or finished. |
| `MATCH_PAUSED` | Match is temporarily paused due to reconnection handling. |
| `MATCH_FINISHED` | Match ended with a winning team. |

### Round States

| State | Definition |
| --- | --- |
| `ROUND_WAITING_FOR_DICE` | Current team must roll the dice. |
| `ROUND_WAITING_FOR_WORD_SELECTION` | Mime player must choose one word from the word card. |
| `ROUND_GUESSING` | Timer is running and guesses are accepted. |
| `ROUND_RESOLVED` | Round ended by correct guess, timeout, or match finish. |

## Canonical Commands

Commands are user- or client-initiated actions. Contracts will define exact transport and payloads.

| Command | Actor | Definition |
| --- | --- | --- |
| `REGISTER_USER` | Anonymous visitor | Create authenticated account. |
| `LOGIN_USER` | Anonymous visitor | Start authenticated session. |
| `CREATE_TABLE` | Authenticated user | Create a private table and become host. |
| `SEND_TABLE_INVITE` | Host | Invite another online user to the table. |
| `ACCEPT_INVITE` | Invited user | Join the table. |
| `REJECT_INVITE` | Invited user | Decline the table invite. |
| `ASSIGN_TEAMS` | Host | Define exactly 2 players for Team A and 2 players for Team B. |
| `START_MATCH` | Host | Start a match when the table is valid. |
| `ROLL_DICE` | Current team or authorized client action | Roll dice for the current team. |
| `SELECT_WORD` | Current mime player | Select one word from the word card. |
| `SEND_GUESS` | Eligible guesser | Submit a chat message that may be validated as a guess. |
| `START_REMATCH` | Host | Start a new match from the same table after match finish. |
| `RECONNECT_PLAYER` | Disconnected player | Restore real-time session and current state. |

## Canonical Events

Events are server-published facts. Contracts will define exact transport and payloads.

| Event | Definition |
| --- | --- |
| `ONLINE_USERS_UPDATED` | Lobby online user list changed. |
| `LOBBY_MESSAGE_POSTED` | Global lobby chat message was posted. |
| `TABLE_CREATED` | Private table was created. |
| `TABLE_INVITE_RECEIVED` | User received a table invite. |
| `TABLE_PLAYERS_UPDATED` | Table membership changed. |
| `TABLE_TEAMS_UPDATED` | Host changed team assignment. |
| `MATCH_STARTED` | Match started from a valid table. |
| `MATCH_STATE_UPDATED` | Match state changed. |
| `DICE_ROLLED` | Dice value was rolled and position advanced. |
| `WORD_CARD_DRAWN` | Word options were generated for the mime player. |
| `WORD_SELECTED` | Mime player selected the active word and timer started. |
| `GUESS_RECEIVED` | Guess message was accepted into the round chat. |
| `CORRECT_GUESS` | A guess matched the active word. |
| `ROUND_TIMED_OUT` | Round timer expired without a correct guess. |
| `TURN_CHANGED` | Current team changed. |
| `MATCH_PAUSED` | Match paused due to reconnection handling. |
| `PLAYER_RECONNECTED` | Player reconnected and state was restored. |
| `MATCH_ENDED` | Match ended with a winner. |
| `REMATCH_STARTED` | New match started from the same table. |

## Canonical Invariants

These rules must not be violated by specs, contracts, tasks, or implementation.

### User and Auth

- V1 requires authentication to play.
- Guest users are out of scope for V1.
- A user can be online in the lobby without being in a table.

### Table

- A table has exactly one host.
- A table is private and invite-based in V1.
- A table must have exactly 4 players before a match can start.
- The host cannot start a match until teams are defined.
- A table may outlive one match to support rematch.

### Team

- A match has exactly 2 teams: Team A and Team B.
- Each team has exactly 2 players.
- Team assignment is manual by the host in V1.
- Team assignment must be explicit in the start-match contract.
- A player cannot belong to both teams in the same match.

### Match

- A match belongs to exactly one table.
- A match has exactly 4 players.
- A match ends when Team A or Team B reaches the final board tile.
- A finished match cannot return to active play.
- A rematch is a new match, not a reset of the finished match.

### Board

- The board has 52 tiles in V1.
- Dice values are integers from 1 to 6.
- A team position cannot move below the start or beyond the final tile.
- The winning position is the final tile.
- Special tiles enable opponent guessing from the start of the round.

### Round

- A round belongs to one match.
- Only one round can be active per match.
- Each active round has exactly one current team.
- Each active round has exactly one mime player.
- Dice is rolled before word selection.
- The mime player chooses 1 word from 3 options.
- The timer starts after word selection.
- Round duration is fixed at 60 seconds.
- If the timer expires without a correct guess, the turn passes to the other team.

### Guessing and Chat

- Chat may exist in lobby, table, and round contexts.
- A guess is a chat message evaluated against the active word.
- V1 validation is exact match after normalization.
- Normalization must be case-insensitive and accent-insensitive.
- On a normal tile, only the current team partner should be eligible to guess.
- On a special tile, all non-mime players should be eligible to guess.
- The mime player must not be eligible to guess the active word.

### Steal

- Steal can happen only on special tiles.
- A steal happens when the opponent team guesses correctly during a special-tile round.
- After a steal, the opponent team becomes the current team for the next turn.

### Reconnection

- A relevant match disconnection pauses the match for up to 60 seconds.
- Reconnection within the window restores the same match state.
- Reconnection handling must not advance timer, turn, or board state while paused.
- If the disconnected player does not return within 60 seconds during an active match, the opponent team wins.
- V1 does not support host transfer; host disconnection follows the same reconnection rules.

### Video

- Video is mandatory for the V1 gameplay experience.
- The mime player must be visible during the guessing phase.
- Video transport details belong in a later tech design and contract spec.

### Deployment

- V1 is not complete until frontend and backend are publicly accessible.
- Public deploy must support a full 4-player match demonstration.

## Reserved Values

### Teams

- `A`
- `B`

### Word Categories

- `eu_sou`
- `eu_faco`
- `objeto`

### Special Tiles

The current proposed special tiles are:

- `5`
- `11`
- `17`
- `23`
- `29`
- `35`
- `40`
- `44`
- `48`
- `51`

Public contracts and UI use one-based board positions from `1` to `52`.

## Terms To Avoid

| Avoid | Use Instead | Reason |
| --- | --- | --- |
| `room` | `table` | Product concept is mesa/table. Existing `GameRoomEntity` should not drive new vocabulary. |
| `game` for a match instance | `match` | `game` is ambiguous between product, ruleset, and individual match. |
| `currentPlayer` | `mimePlayer` or `currentTeam` | Ambiguous: may mean acting player, mime player, or current turn owner. |
| `turnPlayer` | `mimePlayer` | V1 turn belongs to a team; mime is the acting player inside the round. |
| `all chat` | `special-tile round chat` | Eligibility depends on round/tile context. |
| `auto team` | `manual team assignment` | V1 requires host-defined teams. |

## Known Legacy Mismatches

These mismatches exist in the current codebase and must be handled deliberately when writing contracts or implementation tasks.

| Current Code | Canonical Direction | Notes |
| --- | --- | --- |
| `StartMatchRequestDTO.playerIds` | `teamAssignments` | V1 requires manual team assignment; a plain player list is insufficient. |
| `MatchStateResponseDTO.currentTurn` | `currentTeam` | Use `currentTeam` in new contracts to avoid ambiguity. |
| Frontend `MatchState.currentPlayerId` | `currentMimePlayerId` | The current player should be named as mime player. |
| Frontend `GameTable.status = "starting"` | canonical table states | `starting` needs confirmation in `DOMAIN-001`; it may be a UI transient state only. |
| Backend `GameRoomEntity` | likely deprecated | Needs code audit before deciding removal or mapping. |
| Backend `GameEntity`, `TeamEntity`, `PlayerEntity`, `MimeCardEntity` | likely legacy or unused | Needs code audit before implementation planning. |

## Accepted Decisions

These decisions are accepted and must be carried into `DOMAIN-001`, contracts, specs, tests, and tasks.

| ID | Decision |
| --- | --- |
| `GLOSSARY-AD-001` | Public contracts and UI use one-based board positions from `1` to `52`; backend may adapt internally if needed. |
| `GLOSSARY-AD-002` | If a player does not reconnect within 60 seconds during an active match, the opponent team wins. |
| `GLOSSARY-AD-003` | Host may redefine teams before starting a rematch. |
| `GLOSSARY-AD-004` | V1 does not support host transfer; host disconnection follows normal reconnection rules. |

## Agent Rules

- Use canonical terms from this document in all new docs and prompts.
- Do not invent new state names without updating this document and `DOMAIN-001`.
- Do not introduce new event or command names without updating this document and executable contracts.
- Treat legacy code names as implementation details unless promoted here.
- If a term is unclear, stop and update the glossary before creating tasks.
