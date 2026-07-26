# PRODUCT-DESIGN-001 - Visual System and Screen Layouts

Status: Accepted
Date: 2026-07-26

## Overview

This product design document defines the visual direction, layout principles, screen hierarchy, and interaction feel for Mimico V1.

This document exists because the first public version should be both functional and portfolio-ready. The current frontend already has a useful direction: warm background, coral primary action, teal/amber accents, rounded cards, playful illustrations, logo, avatars, and approachable motion. This document preserves that foundation while raising the bar from "working UI" to "intentional game experience".

## Source Documents

- `docs/prd-v1.md`
- `specs/SPEC-006-mobile-desktop-experience.md`
- `specs/SPEC-004-video-chat.md`
- `specs/SPEC-005-reconnection-recovery.md`
- `specs/SPEC-007-deploy-observability.md`
- `docs/PHASE-1-CLOSEOUT.md`

## Design Goal

Mimico V1 should feel like a warm, playful party game that happens to be technically solid.

The UI should communicate:

- friends gathering quickly
- game-night energy
- clear turn ownership
- video-first mime moments
- low-friction guessing
- trustworthy real-time state
- portfolio-level polish without overbuilding

## Visual Direction

Direction name:

- `Warm Game Night`

Keywords:

- playful
- warm
- social
- tactile
- readable
- slightly theatrical
- not childish
- not enterprise dashboard

The UI should avoid:

- generic SaaS dashboard feel
- excessive glassmorphism
- dark-mode-first aesthetic
- purple/blue AI-template palette
- overly dense panels
- sterile default Next.js look

## Existing Direction To Preserve

Keep and refine:

- cream/warm background
- coral primary action
- teal secondary/team accent
- amber highlight/special tile accent
- dark slate text/accent
- rounded cards and pill buttons
- logo and current illustration language
- avatars for player identity
- simple motion already introduced in the about page
- approachable Portuguese-first tone

Current useful references:

- `mimico-game/app/page.tsx`
- `mimico-game/app/about/page.tsx`
- `mimico-game/src/components/Button.tsx`
- `mimico-game/src/components/Card.tsx`
- `mimico-game/src/components/Logo.tsx`
- `mimico-game/src/components/Avatar.tsx`

## Visual System

### Color Roles

Recommended palette roles:

| Role | Target | Existing Direction |
| --- | --- | --- |
| Background | warm cream paper | `#FFF8E8` or close refinement |
| Surface | warm white card | white with subtle warmth |
| Primary action | coral/orange | `#FF7B54` |
| Primary hover | deeper coral | refined from primary |
| Team A | teal | `#60BFB2` |
| Team B | amber/orange | `#FFB54A` |
| Accent text | dark slate | `#2D3142` |
| Success | teal/green | aligned with Team A but distinct when needed |
| Error | soft red | `#F38181` |
| Special tile | amber glow | aligned with Team B but distinct when needed |
| Paused/reconnecting | blue-gray or amber status | calm, not alarming unless timeout is near |

Rules:

- primary action should remain coral
- teal and amber should identify gameplay roles, not random decoration
- status colors must not be color-only
- keep enough contrast for core text and controls
- avoid introducing purple as a main gameplay color

### Typography

The current Inter/Poppins direction is acceptable but too generic for a portfolio game.

Recommended implementation direction:

- keep a highly readable sans for body text
- use a more expressive rounded/display font for headings, logo-adjacent labels, and major game moments
- avoid fonts that feel childish or hard to read

Suggested type roles:

| Role | Requirement |
| --- | --- |
| Display/Heading | rounded, friendly, high personality |
| Body | readable at small sizes, strong Portuguese accent support |
| Numeric/timer | bold, tabular or stable width if practical |
| Chat | highly readable, no decorative font |

Exact font choice can be finalized during frontend implementation, but the choice must be deliberate and documented.

### Shape And Depth

Use:

- large rounded cards
- pill primary buttons
- soft shadows
- subtle borders on structured gameplay panels
- tactile board tiles
- elevated active-turn/action panel

Avoid:

- flat white rectangles everywhere
- heavy black shadows
- tiny sharp controls
- too many competing cards on mobile

### Motion

Motion should feel like game feedback, not decoration.

Required motion moments:

- page entrance or section reveal
- invite/toast appearance
- dice roll
- correct guess celebration
- timeout urgency
- reconnect countdown/pause state
- final winner reveal

Motion rules:

- respect reduced motion where practical
- avoid endless attention-grabbing animation during active guessing except timer urgency
- do not animate video containers in a way that resets streams
- keep motion short and meaningful

## Screen Layout Direction

### Home

Goal:

- quickly explain the game and send user to login/register/about.

Preserve:

- centered logo
- warm background
- side illustrations on desktop
- simple CTA stack

Improve:

- make hero feel more like a game invitation
- add slightly richer background texture or shapes
- make language switch look intentional or defer if not functional
- avoid default empty space on small mobile

### About / How To Play

Goal:

- explain the game in three steps and build confidence.

Preserve:

- three-step card structure
- icons
- light motion
- rules modal

Improve:

- align cards with final visual system
- clarify special tile/steal concept if needed
- make rules modal concise and scannable

### Auth

Goal:

- login/register should feel like entering a game table, not filling an enterprise form.

Requirements:

- compact mobile form
- clear validation states
- warm card surface
- primary action coral
- secondary navigation obvious
- no decorative overload that hides form errors

### Lobby

Goal:

- social waiting room with chat and table creation.

Desktop:

- online users panel left or right
- global chat primary
- create table action prominent
- invite notifications visible

Mobile:

- chat primary
- online users and create-table actions accessible without taking over the screen permanently
- keyboard-safe chat input

Visual intent:

- feel like a lively pre-game room
- empty chat should be friendly, not dead

### Table Setup

Goal:

- make four-player team setup clear and host-driven.

Desktop:

- teams visible side-by-side
- host assignment controls obvious
- table chat secondary but available
- start match action has clear readiness explanation

Mobile:

- teams stacked with a compact host assignment flow
- chat reachable but not dominant
- start match CTA sticky or easy to find for host

Visual intent:

- teams should look like two squads preparing for a round
- Team A/Team B colors should be consistent with gameplay

### Match - Dice And Word Selection

Goal:

- current action is unmistakable.

Dice phase:

- current team/player is prominent
- dice action has tactile motion
- ineligible players see waiting state
- board summary visible or reachable

Word selection:

- only mime player sees words
- word cards feel like game cards
- categories are visually distinct but not rainbow-noisy
- non-mime waiting state must not feel broken

### Match - Guessing

Goal:

- mime video, timer, and guess input are the heart of the screen.

Desktop:

- board/progress main or large secondary panel
- video and chat in stable side panels
- timer always visible
- selected word visible only to mime

Mobile:

- mime video + timer primary
- guess input reachable with keyboard
- board/team summary compact and accessible
- no horizontal scrolling

Visual intent:

- guessing phase should feel energetic and focused
- special tile should feel exciting and dangerous because opponents can steal

### Paused / Reconnecting

Goal:

- make the game feel fair and controlled.

Requirements:

- pause state clearly overlays/disables gameplay controls
- disconnected player shown
- countdown visible
- reason clear: connection or mime media
- final timeout state replaces pause when forfeit happens

Visual intent:

- calm but visible, not panic-red unless near timeout

### Final / Rematch

Goal:

- satisfying ending and clear next action.

Requirements:

- winning team obvious
- finish reason visible
- final positions visible
- rematch CTA prominent
- lobby return secondary

Visual intent:

- small celebration, not a generic alert page

## Component Direction

Required component families:

- `Button`
- `Card`
- `Badge`
- `Avatar`
- `AppHeader`
- `ChatPanel`
- `PlayerList`
- `TeamPanel`
- `Board`
- `VideoTile`
- `Timer`
- `ActionPanel`
- `PausedOverlay`
- `FinalResult`
- `Toast/Invite`

Rules:

- components should use design tokens rather than one-off hex values where practical
- existing components can be evolved instead of replaced
- disabled states must explain why
- loading states must not collapse layout
- chat and video components should be phase-aware

## Board Direction

The board is a differentiator for the portfolio version.

Requirements:

- 52 tiles
- Team A and Team B positions visible
- special tiles visually distinct
- current team highlighted
- final tile feels like finish line
- compact summary for mobile

Recommended feel:

- tactile board-game path
- warm paper/card surface
- subtle tile depth
- team tokens with clear color and labels

Avoid:

- tiny unreadable tile numbers on mobile as the only representation
- board taking priority over video during guessing on mobile

## Accessibility And Readability

Requirements:

- visible focus states
- readable text sizes on mobile
- tap targets at least 44px for primary interactions
- timer urgency not color-only
- team identity not color-only
- video tiles named
- modals keyboard-accessible
- form errors visible near fields

## Product Quality Bar

V1 is portfolio-ready when:

- main flows look visually cohesive
- mobile gameplay is usable
- desktop layout is intentionally multi-panel
- visual states exist for loading/error/paused/final
- no major screen looks like a default framework template
- game state hierarchy is obvious in every phase
- visual polish supports gameplay instead of hiding it

## Known Current UI Gaps

These are not implementation tasks yet; they are future task inputs.

| Current UI Behavior | Design Target |
| --- | --- |
| Game screen uses mock state and placeholder video areas. | Real phase-aware layout with authoritative state and video states. |
| Some screens rely heavily on plain white cards and generic spacing. | Keep card language but add stronger game-night visual identity. |
| Inter/Poppins setup is readable but generic. | Choose deliberate display/body typography for portfolio polish. |
| Tailwind/theme tokens and component colors mix CSS variables and raw hex values. | Consolidate color tokens and component usage. |
| Table setup uses ready/auto-start UI from legacy behavior. | Host assignment and explicit start should drive layout. |
| Board is functional but visually basic and may be hard to read on mobile. | Board should become tactile and summarized on mobile. |
| Language switch appears in home but bilingual readiness is not complete. | Either make language support coherent or visually mark current scope. |

## Accepted Decisions

These decisions are accepted and must be carried into frontend tasks, visual QA, implementation prompts, and review checklists.

| ID | Decision |
| --- | --- |
| `PRODUCT-DESIGN-001-AD-001` | Preserve the current warm/coral/teal/amber direction and refine it rather than replacing the visual identity. |
| `PRODUCT-DESIGN-001-AD-002` | Treat portfolio-level visual polish as part of V1, not post-MVP. |
| `PRODUCT-DESIGN-001-AD-003` | Add a more distinctive heading/display font while keeping body/chat highly readable. |
| `PRODUCT-DESIGN-001-AD-004` | Make the board a tactile visual differentiator, but keep video/timer primary during mobile guessing. |
| `PRODUCT-DESIGN-001-AD-005` | Use meaningful, limited motion for game feedback instead of decorative animation everywhere. |
