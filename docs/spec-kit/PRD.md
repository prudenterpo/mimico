# PRD — Mimico V1

## Product

Mimico is a browser multiplayer game for four authenticated people. Two teams
compete on a 52-tile board. On each turn, one player performs a word through
video while eligible players submit guesses in real time. The first team to
reach tile 52 wins.

The product succeeds when four people can open the public application, form a
table, complete a match with video and chat, recover from a brief disconnect,
and start another match without operator intervention.

## Product principles

1. The current state, next action, and eligible actor are always visible.
2. The backend is authoritative for every result that can affect a match.
3. One reliable four-player flow matters more than optional modes.
4. Video is part of the game, not an optional enhancement.
5. Mobile and desktop support the same complete flow.
6. Behavior examples and automated evidence define done.

## Players and table

- A match has exactly four authenticated players.
- The table host invites the other three players.
- The host assigns exactly two players to team A and two to team B.
- The host explicitly starts the match after all players and teams are ready.
- A player belongs to at most one team in a match.
- Table chat is available while players prepare the match.

Email confirmation, password recovery, public matchmaking, spectators, bots,
custom rules, and more than four players are outside V1 unless explicitly
approved later.

## Board and words

- The board contains tiles 1 through 52; both teams start at position 0.
- Special “Todos” tiles are 5, 11, 17, 23, 29, 35, 40, 44, 48, and 51.
- The die produces an integer from 1 through 6.
- Movement is capped at tile 52; an exact roll is not required.
- A word card contains one option from each category: `EU_SOU`, `EU_FACO`, and
  `OBJETO`.
- Only the current mime player may see the word options and selected word.
- A guess matches after trimming whitespace, ignoring case, and removing
  accents. Plural, singular, and semantic variants do not match automatically.

## Match flow

### Initial team selection

The host selects one representative from each team. Both representatives roll.
The higher roll chooses the starting team; a tie requires both to roll again.
The winning representative becomes the first mime player.

### Round

1. An eligible player from the current team rolls the die.
2. The server advances that team's piece.
3. If the team reaches tile 52, the match ends immediately.
4. Otherwise, the current mime player draws a private card and selects one word.
5. The server starts a 60-second guessing window.
6. On a normal tile, only the mime player's teammate may guess.
7. On a special tile, every non-mime player may guess.
8. A correct same-team guess keeps the turn and rotates the mime player.
9. A correct opposing-team guess on a special tile steals the next turn.
10. A timeout passes the turn to the opposing team.
11. The piece remains on the tile reached by the die regardless of the result.

### End and rematch

The first team to reach tile 52 wins. A manual abandonment or expired
reconnection window may also end the match in favor of the opposing team. After
the result, players can return to the same table and prepare another match.

## Reconnection

- A disconnect during an active match pauses commands immediately.
- The disconnected player has 60 seconds to reconnect.
- A running round timer pauses with its remaining duration.
- Reconnection restores the authoritative state and resumes the timer.
- If the window expires, the disconnected player's team forfeits.
- Refreshing the browser must not create a second match or reset positions.

## Video and chat

- All four players join the same in-browser media session.
- During guessing, the mime player's video is visually primary.
- Media permission and connection failures have explicit recoverable states.
- Loss of the mime player's required media pauses the match rather than allowing
  invisible play to continue.
- Signaling never exposes the selected word.
- Guess messages are visible to the four players, but only eligible messages may
  resolve a round.
- The server decides whether a message is an eligible correct guess.

## Core behavior examples

### Start authorization

```text
Given a table with four players assigned two per team
When a non-host tries to start the match
Then the command is rejected
And no match is created
```

### Normal guess

```text
Given an active guessing round on a normal tile
When the mime player's teammate submits the normalized correct word
Then the round resolves as a correct guess
And the same team keeps the turn
And the team's next mime player changes
```

### Special-tile steal

```text
Given an active guessing round on a special tile
When an eligible opposing player submits the correct word first
Then the round resolves as a steal
And the opposing team receives the next turn
And the moved piece remains in place
```

### Timeout

```text
Given an active guessing round with no correct guess
When its server deadline expires
Then the round resolves as a timeout exactly once
And the opposing team receives the next turn
```

### Private word

```text
Given a mime player draws a word card
When the server publishes the card
Then only that authenticated player receives the options
And public match state contains no word text or selected word identifier
```

### Reconnection

```text
Given a player disconnects during an active guessing round
When the player reconnects within 60 seconds
Then the same match and round are restored
And the timer resumes from its remaining duration
And no command is processed while the match is paused
```

### Natural win

```text
Given a team is fewer than six spaces from tile 52
When its eligible player rolls far enough to reach or pass tile 52
Then its position becomes 52
And the match ends once with that team as winner
```

## Quality requirements

- Commands from ineligible users cannot change match state.
- Concurrent or repeated commands resolve at most once.
- Private words never appear in shared topics, logs, or public state.
- The interface works at common phone and desktop widths.
- Loading, empty, permission-denied, reconnecting, paused, error, and finished
  states are visible and actionable.
- Logs identify a match and command without recording passwords, tokens, private
  words, or unnecessary message content.
- A fresh environment can be built, migrated, started, and smoke-tested from
  repository instructions.

## V1 completion

V1 is complete when a production-like environment proves:

- registration, login, lobby, invite, table, team assignment, and explicit start;
- one full four-browser match through natural victory;
- normal guesses, special steals, timeout, abandonment, and rematch;
- working four-player video with permission and connection failure handling;
- refresh and reconnect without state corruption;
- usable mobile and desktop layouts;
- automated backend and frontend suites plus a multi-client E2E smoke;
- documented deployment, health, observability, and rollback checks.
