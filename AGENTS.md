# Frontend Project Instructions

## Project Overview

This project is the frontend of a movie discovery and management platform. It provides movie details, advanced filtering, recommendations, ratings, collections, user profiles, and administrative features.

## Technology Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-intl — internationalization and localization
- next-themes — light and dark theme management
- Framer Motion — animations
- NextAuth (Auth.js) — authentication
- Zustand — client-side state management
- Recharts — charts and data visualization
- REST API integration with the backend

## General Guidelines

- Inspect existing implementations before writing new code.
- Follow the established project architecture, naming conventions, and coding patterns.
- Prefer reusable, maintainable, and strongly typed solutions.
- Preserve the existing distinction between Server Components and Client Components. Use Client Components only when necessary.
- Keep changes focused on the requested task.
- Reuse existing utilities, hooks, types, and API integrations whenever possible.

## File Structure and Feature Organization

- Maintain a consistent hierarchy between Next.js App Router routes (`src/app`) and their corresponding components (`src/components`).
- Place feature-specific components within the corresponding domain and page directory. For example, movie details page components belong in `src/components/movie/movie-page/`.
- Always create a dedicated subdirectory for each new feature. Do not place feature-specific files directly into the parent directory or mix them with unrelated features.
- Follow existing directory structures and naming conventions. Keep shared components separate from page-specific and feature-specific components.
- Keep `page.tsx` focused on page composition and move feature implementations into their corresponding component directories.

## UI Components

### shadcn/ui

- Always prefer shadcn/ui components when implementing user interfaces.
- Use native HTML elements for UI controls only when shadcn/ui does not provide sufficient functionality for the requirement.
- Do not replace existing shadcn/ui components with custom implementations without a valid reason.

### Shared Components

- Before creating a component, inspect `src/components/my-custom-ui` for existing reusable components.
- Reuse or appropriately extend existing components instead of duplicating functionality.
- Preserve existing component APIs and behavior unless changes are explicitly required.

### ItemsSelector

- Always use the shared `ItemsSelector` component for large lists, especially dynamic lists.
- Component location: `src/components/my-custom-ui/items-list-selector.tsx`.
- Inspect its existing API and usage examples before implementation.
- Do not create alternative list components that duplicate its functionality.

## Styling and Theming

- Every UI feature must support both light and dark themes.
- The primary source of design tokens and shared style definitions is `src/app/globals.css`.
- Inspect existing color tokens, CSS variables, reusable style definitions, and utility classes before introducing new styles.
- Prefer existing design tokens over hardcoded colors and duplicated style definitions.
- Follow the established visual language of the application.
- Ensure layouts are responsive and work correctly on mobile and desktop.
- Verify both themes when implementing or modifying visual elements.

## Design Consistency and Creative Styling

- **Default behavior:** When no specific styling or design improvements are requested, strictly follow the project's existing visual language. Reuse established components, design tokens, layouts, spacing, and styling patterns. Do not introduce new visual concepts or decorative effects unnecessarily.

- **When creative styling is explicitly requested:** Treat requests for attractive, modern, or polished styling without a specific design reference as an invitation to make creative design decisions. Aim for a contemporary, visually engaging, and refined appearance that balances simplicity and creativity. Avoid both generic, primitive UI templates and overly elaborate, experimental, or showcase-oriented designs.

- Introduce thoughtful animations, transitions, visual effects, and modern UI patterns where appropriate. The feature should have its own visual identity while still feeling like a natural part of the existing project.

- Maintain consistency with the project's color palette, typography, design tokens, and overall atmosphere. Creative styling should enhance the existing design language rather than replace it.

- Keep visual effects lightweight, purposeful, and performant. Prefer CSS, Tailwind CSS, and existing animation libraries. Do not introduce heavy 3D rendering, additional styling libraries, or unnecessary third-party dependencies.

- Ensure that all creative styling works equally well in both light and dark themes, remains responsive, and does not compromise usability or readability.

## Localization

- Use the existing `next-intl` localization system.
- All new user-facing text must be localized.
- Add translations for every supported locale when introducing or modifying translation keys.
- Reuse existing translation keys when their meaning matches the intended usage.
- Follow the existing translation file structure, namespaces, and naming conventions.
- Use the project's existing locale-aware navigation and formatting utilities where applicable.
- Avoid hardcoded user-facing strings in components.
- Ensure localized text works correctly within the layout, including longer translations.

## Navigation and Movie Page Links

- **Every link that navigates to a movie details page MUST explicitly set `prefetch={false}`.**
- This rule applies to all movie page links, including cards, lists, search results, recommendations, collections, and shared link components.
- The movie details endpoint records page visits in the Audit Log. Automatic prefetching can generate false visit records.
- Do not rely on default prefetch behavior or introduce manual prefetching for movie details pages.
- Preserve this restriction when refactoring existing navigation components.

Example:

```tsx
<Link href={movieUrl} prefetch={false}>
  {movieTitle}
</Link>
```

## Testing

### General Testing Guidelines

- Add tests ONLY for substantial features, complex components with multiple responsibilities, critical business logic, or components that other parts of the application depend on or are significantly affected by.
- Evaluate the importance, complexity, and potential impact of a feature before deciding whether tests are necessary. Testing is not mandatory for every implementation.
- Do NOT add tests for trivial UI elements, simple buttons, straightforward event handlers, basic state updates, or minor functionality with limited impact.
- Follow the existing testing framework, utilities, and conventions.
- Prefer a small number of valuable tests over exhaustive or repetitive coverage.
- When testing is warranted, focus on the component's primary functionality and its most important interactions.
- For forms, test representative interactions and submission behavior instead of testing every input individually.
- Add additional tests only when they cover distinct, important behavior, critical business logic, or meaningful edge cases.
- Do not create tests solely to increase coverage or test count.
- When the value of a new test is questionable and the consequences of a potential failure are insignificant, prefer not to add the test.

### Layout and Styling Tests

- Add layout and styling tests only for important structural aspects of the interface.
- Focus on the overall layout, major component structure, and mobile responsiveness.
- Do not test individual colors, spacing values, Tailwind classes, or minor decorative details unless explicitly required or critical to functionality.
- Avoid brittle tests tied to incidental implementation details.

## Restrictions

- Do not install new dependencies without explicit approval.
- Do not introduce alternative UI libraries, CSS frameworks, or styling systems.
- Do not introduce alternative localization, theming, state management, or testing libraries without explicit approval.
- Do not duplicate existing shared components, utilities, or design tokens.
- Do not modify global styles in ways that affect unrelated parts of the application.
- Do not change existing API contracts or authentication behavior unless explicitly requested.
- Do not perform unrelated refactoring or modify unrelated files.
- Do not disable TypeScript, linting, or test checks to hide errors.
- Do not remove existing functionality or tests merely to simplify an implementation.
- Do not expose secrets or server-only configuration to client-side code.
