## Relevant Files

- `apps/web/lib/theme.ts` - New file to define the custom Mantine theme, including color palettes, typography, and other theme overrides. Consistent with `lib/` for shared utilities/configurations in `apps/web`.
- `apps/web/app/layout.tsx` - To wrap the application with MantineProvider and the custom theme, standard for Next.js App Router.
- `apps/web/components/GlobalStylesheet/GlobalStylesheet.tsx` - New component to apply global styles using Mantine's `<Global />` component.
- `apps/web/components/ThemeToggle/ThemeToggle.tsx` - New UI component for the light/dark mode switch, placed in the designated `components/` directory.
- `apps/web/components/ThemeToggle/ThemeToggle.test.tsx` - Unit tests for `ThemeToggle.tsx`.
- `apps/web/hooks/useThemePreference.ts` - New React hook to manage theme state. Placing hooks in `apps/web/hooks/` is a common and good practice.
- `apps/web/hooks/useThemePreference.test.ts` - Unit tests for `useThemePreference.ts`.
- `apps/web/components/**/*.tsx` - Existing UI components in the `components/` directory that will need refactoring.
- `apps/web/app/**/*.tsx` - Existing page components within the Next.js App Router structure that might need refactoring.
- `packages/eslint-config/next.js` - Relevant for ensuring code style consistency.
- `packages/typescript-config/nextjs.json` - Relevant for ensuring TypeScript configuration compatibility.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `pnpm test` or `pnpm turbo test` (depending on project setup) to run tests. You can also target specific tests: `pnpm test apps/web/components/ThemeToggle/ThemeToggle.test.tsx`.

## Tasks

- [x] 1.0 Initialize Mantine Theme Setup
  - [x] 1.1 Create `apps/web/lib/theme.ts` for custom Mantine theme configuration.
  - [x] 1.2 Define the basic structure of the theme object, including placeholders for `colorScheme`, `colors`, `primaryColor`, `fontFamily`, `headings`, etc.
  - [x] 1.3 Select and define primary and (optional) secondary font families in the theme (e.g., Inter, Rubik) aligning with "personable typography".
  - [x] 1.4 Define a typographic scale (font sizes, line heights, font weights) for headings and body text.
  - [x] 1.5 Integrate the `MantineProvider` in `apps/web/app/layout.tsx`, initially with a default theme or the basic structure from 1.2.
- [x] 2.0 Implement Light Mode Palette
  - [x] 2.1 Define the "Digital Dawn" primary palette colors (Electric Teal/Aqua, Warm Coral/Orange, Off-White/Cream, Deep Charcoal/Dark Gray) as custom colors in `apps/web/lib/theme.ts`.
  - [x] 2.2 Set the `primaryColor` in the Mantine theme to the chosen primary brand color (e.g., Electric Teal).
  - [x] 2.3 Set `defaultColorScheme` to `auto` in `MantineProvider` and `ColorSchemeScript` in `apps/web/app/layout.tsx` to respect user's system preference.
  - [x] 2.4 Update application metadata (title, description) in `apps/web/app/layout.tsx` to reflect the new branding "Sentiment Hound" and the aesthetic "Energetic Insight, Approachable Power".
  - [x] 2.5 Ensure all light mode color definitions are correctly applied when `colorScheme` is 'light'.
- [x] 3.0 Implement Dark Mode Palette and Global Styles
  - [x] 3.1 Define "Expressive Hues" dark mode color palette in `theme.ts` (`deepIndigo`, `vibrantTeal`, `richPurple`, `energeticOrange`, `brightLemon`, `darkSlate`, `offBlack`).
  - [x] 3.2 Set `primaryShade.dark` to an appropriate value (e.g., 7 or 8) for good contrast.
  - [x] 3.3 Update `theme.other.colorSchemeDark` with appropriate background, text, and accent colors using the new dark palette.
  - [x] 3.4 Implement global styles by creating `apps/web/components/GlobalStylesheet/GlobalStylesheet.tsx` and using Mantine's `<Global />` component. Apply body background, text color, and heading styles dynamically based on the color scheme. Ensure heading font weights and link styles are consistent with the theme.
  - [x] 3.5 Ensure `GlobalStylesheet` component is correctly imported and applied in `apps/web/app/layout.tsx`.
  - [ ] 3.6 Test dark mode switching and verify colors and styles are applied correctly. _(Manual verification will be needed once theme toggling is implemented)_
- [x] 4.0 Define Sentiment Visualization Colors in Theme
  - [x] 4.1 Add specific color definitions to the theme for positive sentiment (e.g., a vibrant, encouraging green or a warm, inviting orange like `warmPeach`). Store in `theme.other.sentimentPositive`.
  - [x] 4.2 Add specific color definitions to the theme for negative sentiment (e.g., a clear, noticeable red/pink or a distinct, calming blue/purple like `softLavender`). Store in `theme.other.sentimentNegative`.
  - [x] 4.3 Add specific color definitions to the theme for neutral/mixed sentiment (e.g., a balanced gray or a calm, informative blue/teal like `calmAqua`). Store in `theme.other.sentimentNeutral`.
- [ ] 5.0 Refactor Existing Components to Use Theme
  - [ ] 5.1 Identify all UI components in `apps/web/components/` and `apps/web/app/` that use custom color styling (inline styles, CSS modules, hardcoded hex values).
  - [ ] 5.2 Systematically refactor each identified component to use Mantine theme properties (e.g., `theme.colors.primary[6]`, `theme.fn.themeColor()`, component `color` props), reducing reliance on CSS Modules for colors.
  - [ ] 5.3 Prioritize common components first (e.g., `Button`, `Card`, `Input`, `Text`, navigation elements).
  - [ ] 5.4 Ensure components correctly adapt to both light and dark modes based on the theme.
  - [ ] 5.5 Remove redundant or overridden custom color styles.
- [ ] 6.0 Implement Theme Toggling Functionality
  - [ ] 6.1 Create a `useThemePreference` hook in `apps/web/hooks/useThemePreference.ts` to manage the current theme state (light/dark).
  - [ ] 6.2 Implement logic within the hook to persist the user's theme preference to `localStorage` and retrieve it on load.
  - [ ] 6.3 Create a `ThemeToggle` component in `apps/web/components/ThemeToggle/ThemeToggle.tsx` that uses the `useThemePreference` hook to display and change the theme.
  - [ ] 6.4 Add the `ThemeToggle` component to a suitable location in the application layout (e.g., header, settings menu).
  - [ ] 6.5 Connect the theme state from the hook to the `MantineProvider`'s `theme.colorScheme` prop in `apps/web/app/layout.tsx`.
  - [ ] 6.6 Write unit tests for `useThemePreference` hook and `ThemeToggle` component.
- [ ] 7.0 Conduct Accessibility Review and Adjustments
  - [ ] 7.1 For all key UI elements and text, verify color contrast ratios meet WCAG AA standards in both light and dark modes using browser developer tools or accessibility checkers.
  - [ ] 7.2 Adjust theme colors as necessary to meet contrast requirements.
  - [ ] 7.3 Ensure that color is not the sole means of conveying information for critical UI elements.
  - [ ] 7.4 Test keyboard navigation and focus indicators with the new themes.
- [ ] 8.0 Documentation and Final Review
  - [ ] 8.1 Briefly document the new theme structure and how to use it in `apps/web/README.md` or a dedicated theming guide.
  - [ ] 8.2 Perform a final visual review of the application in both light and dark modes across different pages and components to ensure consistency and adherence to the aesthetic vision.
  - [ ] 8.3 Clean up any unused style files or code related to old theming.
