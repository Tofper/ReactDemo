# DailyRewards App

A sample project, modular React + TypeScript application demonstrating a AAA-quality daily rewards UI. Built with a focus on maintainability, performance, and extensibility for modern game development.

---

## Features
- **React 18 + TypeScript (strict mode):** Modern, type-safe UI development
- **MVVM Architecture:** Clear separation of View, ViewModel, and Service layers
- **SCSS Modules & Design Tokens:** Theming and scalable styles with design tokens
- **Service Abstraction:** Business logic and data operations are isolated for easy testing and future API integration
- **Context API:** Global state for currency and media queries
- **Custom Hooks:** For responsive design and button interactions
- **Performance Optimized:** Memoization, animation hooks, and efficient rendering
- **Extensible:** Add new reward types, cards, or features with minimal friction

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```

---

## Project Structure & Architecture

```
src/
  components/         # Shared UI components (e.g., PremiumButton)
  context/            # Global state providers (Currency, Media)
  features/
    dailyRewards/     # Daily rewards feature (MVVM pattern)
      components/     # Feature-specific UI components
      model/          # ViewModel hooks (state & logic)
      service/        # Business logic & data abstraction
      types.ts        # Feature-specific types & enums
  hooks/              # Custom reusable hooks
  styles/             # SCSS modules, variables, and mixins
  types/              # Global/shared types
  App.tsx             # App root
  main.tsx            # Entry point
```

### MVVM Example (Daily Rewards)
- **View:** `DailyRewardsScreen.tsx` (renders UI, delegates logic)
- **ViewModel:** `useDailyRewardsScreenModel.ts` (state, actions, computed values)
- **Service:** `dailyRewardsService.ts` (business logic, data fetching)

---

## Daily Rewards Feature

### `DailyRewardsScreen`
- Main UI component for the daily rewards feature.
- Handles rendering, animation, and user interaction.

### `useDailyRewardsScreenModel()`
- Returns `{ state, actions, computed }` for MVVM pattern:
  - `state.cards: CardData[]` — Current reward cards
  - `state.rerollCount: number` — Rerolls used
  - `actions.reroll()` — Reroll rewards
  - `actions.claimReward(day: number)` — Claim a reward
  - `computed.currentDay: number` — Current day index
  - `computed.canReroll: boolean` — If reroll is available

### `dailyRewardsService`
- Singleton for business logic and data:
  - `getInitialCards(): CardData[]`
  - `generateRandomRewards(cards: CardData[]): CardData[]`
  - `getMaxRerolls(): number`
  - `getCurrentDay(): number`

### Types
- `CardType`: `Free | Premium | Locked`
- `RewardType`: `COINS | GEMS | TOKENS | XP`
- `CardData`: `{ day, type, rewardType, rewardAmount, claimed? }`

---

## Theming & Design Tokens

All colors, spacing, typography, and animation timings are defined in `src/styles/_variables.scss`.
- Example:
  ```scss
  $color-reward-coins: #ffd94d;
  $font-family-primary: 'Bebas Neue', sans-serif;
  ```
- SCSS modules ensure styles are encapsulated and maintainable.

---

## Code
- **Linting:**
  - `npm run lint` (TypeScript/JS)
  - `npm run lint:css` (SCSS)
- **Style:**
  - Following MVVM and feature-based folder structure
  - Using strong typing and avoid `any`

## License
MIT 