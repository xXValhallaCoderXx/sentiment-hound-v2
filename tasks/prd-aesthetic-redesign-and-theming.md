# Product Requirements Document: Aesthetic Redesign & Theming for `apps/web`

## 1. Introduction/Overview

This document outlines the requirements for a comprehensive aesthetic redesign of the `sentiment-hound-v2` web application (`apps/web`). The goal is to implement a new visual identity characterized as "Energetic Insight, Approachable Power." This vision aims to make the application feel modern, youthful, vibrant, clean, authentic, and dynamic, moving away from a corporate feel to something more accessible and enjoyable for small businesses and content creators.

The core of this redesign involves establishing a new color palette, implementing it through a custom Mantine theme, and refactoring existing components to utilize this theme for both light and dark modes.

## 2. Goals

- Implement the "Digital Dawn" primary palette and "Expressive Hues" accent palette as the basis for the **light mode** theme.
- Design and implement a complementary **dark mode** theme that aligns with the "Energetic Insight, Approachable Power" aesthetic and ensures excellent legibility.
- Integrate these color palettes into a custom Mantine theme within the `apps/web` Next.js application.
- Refactor existing UI components in `apps/web` to derive their styling (especially colors) from the new Mantine theme, minimizing or eliminating custom inline styles or separate CSS for color definitions.
- Ensure the new aesthetic is applied consistently across all views and components within `apps/web`.
- All color combinations for both light and dark modes must meet WCAG AA contrast standards.
- Set a clear visual standard for future UI/UX development within the `sentiment-hound-v2` platform.

## 3. User Stories

- **As a Product Owner, I want** the `sentiment-hound-v2` web application to have a distinct, modern, and energetic visual identity, **so that** it feels approachable and engaging for users like small businesses and content creators, enhancing their overall experience.
- **As a Developer, I want** a centralized Mantine theme with clearly defined light and dark mode palettes and typographic styles, **so that** I can build and update UI components consistently, efficiently, and with less custom styling.
- **As a User, I want** the application to be visually appealing and easy to navigate, with clear distinctions between different types of information (e.g., sentiment scores), **so that** I can understand data insights quickly and intuitively.
- **As a User, I want** to be able to switch between a light and a dark theme for the application, **so that** I can choose the mode that is most comfortable for my viewing preferences and environment.

## 4. Functional Requirements

1.  **Mantine Theme Creation:**
    1.1. A custom Mantine theme configuration file must be created within `apps/web`.
    1.2. This theme must define color schemes for both "light" and "dark" modes.
    1.3. The theme should also define base typography settings (font families, sizes, weights) that align with the "personable typography" aspect of the aesthetic.
2.  **Light Mode Palette Implementation:**
    2.1. The "light" mode color scheme must be based on the "Digital Dawn" primary palette:
    _ Primary Brand Color (e.g., for headers, primary actions): Electric Teal/Aqua (e.g., `#0695B4` or `#5DC7B7`)
    _ Secondary Brand Color (e.g., for secondary actions, accents): Warm Coral/Optimistic Orange (e.g., `#FF654F`)
    _ Default Background: Soft Off-White/Cream (e.g., `#E6D6CC`)
    _ Default Text/Foreground: Deep Charcoal/Warm Dark Gray (e.g., `#161313` or `#474747`)
    2.2. Accent colors from the "Expressive Hues" palette must be integrated for UI states, data visualizations, and highlights:
    _ Energetic Accent 1: Celestial Yellow (e.g., `#EDEAB1`)
    _ Energetic Accent 2: Vibrant Pink/Magenta (e.g., `#DF678C`)
    _ Calm/Neutral Data Accent: Retro Blue (e.g., `#71ADBA`)
    _ Subtle Depth Accent: Future Dusk (e.g., `#4C5578`)
3.  **Dark Mode Palette Implementation:**
    3.1. A "dark" mode color scheme must be designed and implemented.
    3.2. This palette should be an inversion of the light mode, using dark neutrals (e.g., `#161313` or a darker variant) as the base background.
    3.3. Accent colors from "Digital Dawn" and "Expressive Hues" must be adapted for dark mode to ensure vibrancy, appeal, and proper contrast.
4.  **Sentiment Visualization Colors:**
    4.1. Specific colors for sentiment visualization must be defined in the theme for both light and dark modes:
    _ Positive Sentiment: Warm Coral (`#FF654F`) or Vibrant Pink/Magenta (`#DF678C`).
    _ Negative Sentiment: A muted Retro Blue (`#71ADBA`) or a desaturated Lavender (to be less jarring). \* Neutral/Mixed Sentiment: Electric Teal (`#0695B4`) or a Light Neutral (e.g., `#E6D6CC` for light mode, an equivalent for dark mode).
5.  **Component Refactoring:**
    5.1. All existing UI components within `apps/web` (located in `components/`, `app/`, etc.) must be reviewed and refactored.
    5.2. Custom color styles (inline, CSS modules, etc.) must be replaced with references to the Mantine theme's color properties (e.g., `theme.colors.primary[6]`, `theme.colors.gray[0]`).
    5.3. This includes but is not limited to: buttons, navigation elements, cards, charts, form inputs, backgrounds, and text.
6.  **Theme Toggling:**
    6.1. The application must provide a user-accessible mechanism (e.g., a toggle switch in the settings or header) to switch between light and dark modes.
    6.2. The selected theme preference should ideally be persisted (e.g., using local storage).
7.  **Accessibility:**
    7.1. All text and UI elements must maintain a contrast ratio that meets WCAG AA standards against their backgrounds in both light and dark modes.
    7.2. Color should not be the sole means of conveying information or distinguishing visual elements.
8.  **Illustrations & Animations (Initial Consideration):**
    8.1. While full implementation of custom illustrations is not in the initial scope, the theme should not hinder their future integration.
    8.2. The theme should support subtle, purposeful animations and micro-interactions (e.g., hover states, focus indicators) consistent with Mantine's capabilities.

## 5. Non-Goals (Out of Scope)

- A complete overhaul of the existing UI layout, information architecture, or component structure (the focus is on visual styling and theming).
- Creation of a comprehensive, custom illustration library. Placeholder icons or simple, style-aligned graphics are acceptable for this phase.
- Implementation of complex animations or micro-interactions beyond standard UI feedback (e.g., hover, focus, active states).
- Applying this new theme or aesthetic to any other application in the monorepo (e.g., `apps/server`, `apps/sentiment-analysis-service`) during this phase.
- Introducing new features or functionalities beyond the aesthetic redesign.

## 6. Design Considerations

- **Light Mode Primary Palette ("Digital Dawn"):**
  - Primary: Electric Teal/Aqua (e.g., `#0695B4` or `#5DC7B7`)
  - Secondary: Warm Coral/Optimistic Orange (e.g., `#FF654F`)
  - Light Neutral (Backgrounds): Soft Off-White/Cream (e.g., `#E6D6CC`)
  - Dark Neutral (Text): Deep Charcoal/Warm Dark Gray (e.g., `#161313` or `#474747`)
- **Light Mode Accent & Extended Palette ("Expressive Hues"):**
  - Energetic Accent 1: Celestial Yellow (e.g., `#EDEAB1`)
  - Energetic Accent 2: Vibrant Pink/Magenta (e.g., `#DF678C`)
  - Calm/Neutral Data Accent: Retro Blue (e.g., `#71ADBA`)
  - Subtle Depth Accent: Future Dusk (e.g., `#4C5578`)
- **Dark Mode Palette:**
  - To be derived, using a dark primary background (e.g., `#161313` or a slightly lighter variant like `#2A2A2A`).
  - Text color should be a light neutral (e.g., a variant of `#E6D6CC` or pure white if contrast allows).
  - Accent colors (Teal, Coral, Yellow, Pink, etc.) need to be tested and potentially adjusted for vibrancy and legibility on dark backgrounds. They should generally be brighter or more saturated than their light mode counterparts if used directly.
- **Typography:**
  - Select a primary and optionally a secondary font family that feels "personable," "modern," and "approachable." Consider sans-serif fonts that are clean and highly legible. (e.g., Inter, Rubik, Nunito Sans, or similar).
  - Define a clear typographic scale within the Mantine theme.
- **Mantine UI:**
  - Leverage Mantine's theming capabilities as much as possible, including `theme.colors`, `theme.primaryColor`, `theme.fontFamily`, `theme.headings`, etc.
  - Utilize Mantine components and their styling props (`color`, `variant`, `size`) to apply the theme.

## 7. Technical Considerations

- **Theme Implementation:**
  - The custom Mantine theme will be defined in a dedicated file (e.g., `apps/web/lib/theme.ts` or `apps/web/config/theme.ts`).
  - This theme will be applied globally using MantineProvider at the root of the Next.js application (`apps/web/app/layout.tsx`).
- **Component Refactoring:**
  - Systematically review components in `apps/web/components/` and page-specific components in `apps/web/app/`.
  - Prioritize removing hardcoded color values and replacing them with theme tokens.
  - Use Mantine's `sx` prop or `createStyles` for more complex styling needs that still require access to the theme, but prefer direct component props where possible.
- **Dark Mode Toggle:**
  - Implement a theme context or use a state management solution (e.g., Zustand, Jotai, or React Context with `useReducer`) to manage the current theme (light/dark).
  - The MantineProvider will consume this state to switch themes.
  - Persist user preference in `localStorage`.
- **Accessibility Testing:**
  - Use browser developer tools and accessibility checking extensions (e.g., Axe DevTools) to verify contrast ratios and other accessibility concerns during development.
- **Code Quality:**
  - Adhere to existing ESLint (`packages/eslint-config`) and TypeScript (`packages/typescript-config`) configurations.

## 8. Success Metrics

- A fully functional custom Mantine theme is implemented in `apps/web`, providing both light and dark mode color palettes and typography.
- All major UI components and views in `apps/web` consistently use colors and styles derived from the Mantine theme.
- Custom CSS for color definitions within components is significantly reduced or eliminated.
- Users can successfully toggle between light and dark modes, and the preference is persisted.
- Visual inspection confirms the "Energetic Insight, Approachable Power" aesthetic is achieved.
- Automated and manual accessibility checks confirm WCAG AA compliance for color contrast across themed components in both modes.
- The codebase for theming is clean, maintainable, and easy for other developers to understand and extend.

## 9. Open Questions

- What specific font(s) should be chosen for the "personable typography"? (Needs selection and approval)
- Are there any existing brand guidelines or logos whose colors need to be considered or harmonized with the new palette?
- What are the detailed specifications or examples for "subtle, purposeful animations and micro-interactions" if they are to be included beyond basic themed component states? (Can be deferred to a follow-up PRD/task).
