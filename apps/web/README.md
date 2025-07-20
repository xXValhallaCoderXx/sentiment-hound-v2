This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
# Using pnpm (recommended for this monorepo)
pnpm dev

# Other package managers (if you are managing this app independently)
# npm run dev
# yarn dev
# bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Testing

This application uses [Vitest](https://vitest.dev/) with jsdom environment for React component testing.

### Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test

# Run tests from the monorepo root
pnpm turbo test --filter=web
```

### Testing Setup

- **Framework**: Vitest with jsdom environment for React component testing
- **Testing Library**: @testing-library/react for component rendering and queries
- **Assertions**: @testing-library/jest-dom for DOM-specific matchers
- **Path Aliases**: Tests support Next.js path aliases (e.g., `@/components`, `@/lib`)

### Test File Organization

- Test files are co-located with components using `.test.tsx` extension
- Example: `page.tsx` → `page.test.tsx`
- Test setup files: `vitest.config.ts` and `vitest.setup.ts`

### Writing Tests

Tests should follow React Testing Library best practices:

- Test user interactions and behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`, etc.)
- Mock external dependencies and Next.js specific modules as needed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
