# SPEC-006 - Mobile and Desktop Experience

Status: Accepted
Date: 2026-07-26

## Overview

This functional spec defines the required Mimico V1 experience across mobile phones, tablets, and desktop screens.

This document exists because Mimico is a real-time party game: players need to see video, timer, board, chat, controls, errors, and recovery states without the interface fighting the game. Mobile is especially risky because the keyboard can hide chat and timer, video can dominate the screen, and real-time state can become confusing during reconnects. This spec defines what the UI must make visible and usable before implementation agents redesign or wire the screens.

## Source Documents

- `docs/prd-v1.md`
- `specs/GLOSSARY-001-glossary-and-invariants.md`
- `specs/DOMAIN-001-domain-model-state-machine.md`
- `contracts/CONTRACTS-001-executable-contracts.md`
- `harness/HARNESS-001-agent-execution.md`
- `specs/SPEC-001-auth-lobby.md`
- `specs/SPEC-002-table-teams.md`
- `specs/SPEC-003-match-gameplay.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`

## Scope

In scope:

- responsive behavior for auth, lobby, table, match, pause, final, and rematch screens
- mobile-first gameplay hierarchy
- desktop gameplay hierarchy
- tablet behavior
- keyboard-safe chat behavior
- visible loading, empty, disabled, error, paused, and reconnecting states
- tap/click target requirements
- accessibility requirements
- basic visual consistency requirements
- smoke-test viewport matrix

Out of scope:

- final brand system
- final illustration system
- animation design details
- native mobile app packaging
- advanced accessibility audit beyond V1 acceptance criteria
- browser support for legacy browsers
- final video/WebRTC technical architecture

## Supported Viewports

Mimico V1 must be usable in these viewport classes:

| Class | Width Range | Primary Goal |
| --- | --- | --- |
| Small phone | 360px to 389px | Core gameplay works without horizontal scrolling. |
| Standard phone | 390px to 479px | Primary mobile target. |
| Large phone | 480px to 767px | Comfortable stacked gameplay. |
| Tablet | 768px to 1023px | Hybrid layout with less stacking. |
| Desktop | 1024px and above | Multi-panel layout. |

Minimum smoke viewports:

- `360x740`
- `390x844`
- `430x932`
- `768x1024`
- `1280x800`
- `1440x900`

## Experience Principles

- During active gameplay, timer and current action must be visible without scrolling.
- During `ROUND_GUESSING`, mime video must be the primary visual.
- During dice and word selection phases, the current action control must be primary.
- Chat must never permanently hide the timer on mobile.
- Board position must remain reachable on mobile, even if secondary during guessing.
- Disabled actions must explain why they are disabled.
- Server state is authoritative after refresh or reconnect.
- The UI should prefer clarity over visual density.
- The game should be playable one-handed on phone for non-mime guessers.

## Screen Requirements

### Auth Screens

Acceptance criteria:

- login and registration fit within mobile width without horizontal scrolling
- primary form action is visible without excessive scrolling on standard phone
- validation errors appear near the relevant field
- loading state prevents duplicate submit
- successful auth redirects to lobby
- unauthenticated protected route redirects to login

### Lobby Screen

Acceptance criteria:

- online users are visible on desktop without hiding chat
- mobile users can open online users and create-table actions without losing chat context
- lobby chat input remains reachable with keyboard open
- empty chat state is visible and friendly
- invite notification is actionable on mobile and desktop
- create table flow is usable on phone
- long nicknames do not break layout

### Table Setup Screen

Acceptance criteria:

- four player slots are visible in a readable structure
- host can assign Team A and Team B manually
- non-host players can clearly see assigned teams
- table chat remains usable without hiding team assignments permanently
- start-match button is visible only to the host
- start-match disabled state explains missing players, missing team assignments, or missing media readiness
- leave-table action is present but not visually dominant
- mobile layout does not require horizontal scrolling
- table setup survives refresh according to `SPEC-005`

### Match Screen - Dice Phase

Acceptance criteria:

- current team is visible
- roll eligibility is clear
- dice action is primary for eligible player
- ineligible players see waiting state
- board positions are visible or reachable
- video is secondary but still available if connected
- chat is secondary and disabled unless table/match phase allows it

### Match Screen - Word Selection Phase

Acceptance criteria:

- only current mime player sees word options
- word options are large enough for touch selection
- non-mime players see waiting state without word leakage
- timer has not started until word selection resolves
- selected category/word feedback is clear to mime player

### Match Screen - Guessing Phase

Acceptance criteria:

- mime video is the primary visual
- timer remains visible while scrolling and while keyboard is open
- current guess eligibility is visible
- eligible guessers can type and submit without losing timer context
- mime player sees selected word and cannot submit guesses
- ineligible players see why chat is disabled
- board positions remain reachable through compact summary, tab, drawer, or secondary panel
- special tile state is visually distinct
- correct guess, steal, timeout, and forfeit feedback are visible

### Paused/Reconnecting Screen State

Acceptance criteria:

- paused state overlays or replaces gameplay controls clearly
- disconnected player is identified
- reconnect countdown is visible
- gameplay commands are disabled
- reconnecting player sees state restore progress
- if timeout happens while client is stale, final result replaces paused state

### Final And Rematch Screen

Acceptance criteria:

- winning team is visually obvious
- finish reason is visible
- final positions are visible
- rematch action is available when table remains valid
- lobby return is available
- mobile final screen is readable without dense panels

## Gameplay Layout Hierarchy

### Mobile

Primary hierarchy by phase:

| Phase | Primary | Secondary | Tertiary |
| --- | --- | --- | --- |
| Initial turn dice | Dice action | Team summary | Chat |
| Normal dice | Dice action | Board summary | Video/chat |
| Word selection | Word card | Round context | Board summary |
| Guessing | Mime video + timer | Guess input | Board/team summary |
| Paused | Pause reason + countdown | Player list | Board summary |
| Final | Winner + rematch | Final board | Chat/lobby return |

Recommended mobile structure:

- sticky top match status with timer/current team when relevant
- phase-specific primary panel
- bottom chat input only when chat is allowed
- collapsible board/team drawer during guessing
- no fixed bottom desktop control panel on mobile

### Desktop

Recommended desktop structure:

- board and team progress in the main panel
- video and chat in side panels
- phase action panel near the primary attention area
- timer visible in header or action panel
- no important control hidden below the fold at `1280x800`

### Tablet

Recommended tablet structure:

- use two-panel layout when width allows
- stack video above chat during guessing
- avoid desktop-only fixed overlays if they collide with browser chrome or keyboard

## Keyboard And Input Requirements

- chat input must remain visible when focused on mobile
- timer must remain visible or immediately recoverable when keyboard is open
- submit button must remain tappable with keyboard open
- Enter submits on desktop
- mobile submit button should be explicit
- inputs use `maxLength = 500` for chat/guess text
- empty message cannot be submitted
- disabled input includes visible reason

## Touch And Pointer Requirements

- primary tap targets are at least 44px tall
- word cards are at least 44px tall
- dice button is at least 48px tall
- destructive actions require clear intent and are not adjacent to primary action without spacing
- hover-only information must also be visible or accessible on touch devices

## Visual State Requirements

Each major screen must define these states:

- loading
- empty
- ready
- disabled
- submitting
- error
- reconnecting
- paused, when relevant

State messages must be specific. Avoid generic text like `Something went wrong` when the app knows the cause.

## Accessibility Requirements

- page has a clear main heading
- interactive controls have accessible labels
- focus state is visible
- text contrast meets WCAG AA for normal text where practical in V1
- critical information is not color-only
- timer urgent state uses text or icon in addition to color
- video regions display player names
- modals trap focus and close predictably
- form errors are text-visible

## Localization Requirements

- user-facing UI text should be ready for `pt-BR` and `en-US`
- hardcoded game-state messages should be avoided in implementation tasks
- dynamic values such as player names, timer seconds, team labels, and finish reasons should compose cleanly in both languages

## Performance Requirements

- initial route should avoid unnecessary blocking work before auth restore
- gameplay UI should not re-render the full board on every chat keystroke
- timer updates should not cause video regions to reset
- mobile scroll should remain smooth during active round
- large chat histories should be bounded or virtualized if they become a performance issue

## Testing Requirements

### Frontend

- auth screens render at small phone viewport
- lobby chat input remains reachable on mobile
- create table flow works on phone viewport
- table setup player/team layout works at 360px and desktop
- match dice phase renders eligible and ineligible states
- word selection does not leak words to non-mime player
- guessing phase keeps timer visible with chat input
- paused state disables controls and shows countdown
- final/rematch screen works on mobile and desktop

### E2E Smoke

- `360x740`: login, lobby, create table, table setup, game guessing
- `390x844`: chat with keyboard-safe layout
- `768x1024`: tablet table setup and match layout
- `1280x800`: desktop match layout without hidden primary controls

### Accessibility Smoke

- keyboard navigation reaches primary controls
- focus ring is visible
- modals can be closed with keyboard
- disabled action reason is readable
- timer warning is not color-only

## Known Code Mismatches

These are not implementation tasks yet; they are future task inputs.

| Current Code Behavior | Spec Target |
| --- | --- |
| Table screen uses `readyPlayers`, auto-start, and team slicing. | Table setup should use host manual team assignment and explicit start from `SPEC-002`. |
| Game screen uses mock local phase, dice, timer, words, positions, and players. | Game UI should render server-authoritative match state. |
| Mobile game layout hides board during guessing except a phase switch. | Board/team summary should remain reachable during all phases. |
| Desktop game uses a fixed bottom action panel. | Primary controls must not collide with viewport constraints or hide behind browser chrome. |
| Video areas are placeholders. | Video regions need real media states from `SPEC-004`. |
| Chat input is always available in game mock. | Chat/guess input must follow eligibility from `SPEC-004` and paused rules from `SPEC-005`. |
| Tailwind config content paths reference `src/app`, while routes live under `app`. | Styling pipeline should be verified so production builds include route classes. |
| Global font theme references Inter/Poppins. | Final visual design may choose more distinctive portfolio-oriented typography, but must preserve readability. |

## Accepted Decisions

These decisions are accepted and must be carried into implementation tasks, tests, contracts, and later Tech Design.

| ID | Decision |
| --- | --- |
| `SPEC-006-AD-001` | Mobile gameplay is explicitly supported for V1, not treated as best-effort. |
| `SPEC-006-AD-002` | During mobile guessing, mime video and timer are primary, with board/team summary accessible through compact secondary UI. |
| `SPEC-006-AD-003` | Desktop uses a stable multi-panel layout instead of mobile-style tabs. |
| `SPEC-006-AD-004` | V1 requires keyboard-safe chat behavior in the smoke harness. |
| `SPEC-006-AD-005` | V1 supports Portuguese and English UI text readiness, even if Portuguese is the primary portfolio/demo language. |
