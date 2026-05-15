# Requirements Document

## Introduction

EduCompass is an AI-powered study assistant for Moroccan students (lycée and university level). This document captures the requirements for seven enhancement areas: (1) AI performance improvements with better prompts and calibrated token budgets per tool; (2) UI/style polish while preserving the existing beige/brown theme and adding the SVG logo; (3) automatic multilingual AI responses in French, Darija, Arabic MSA, and English; (4) replacing all inline emoji icons with react-icons Bootstrap Icons; (5) introducing a guest mode that allows unauthenticated access to all AI tools with ephemeral sessions; (6) expanding the language switcher from FR/AR to FR/AR/Darija/EN; and (7) adding contextual illustrations and images to the hero section, feature cards, and empty states.

## Glossary

- **EduCompass**: The AI-powered study assistant application for Moroccan students.
- **AI_Router**: The Express.js route handler module (`server/src/routes/aiRoutes.js`) that processes all AI tool requests.
- **Groq_SDK**: The Groq JavaScript SDK used to call the `llama-3.3-70b-versatile` and `llama-3.2-11b-vision-preview` models.
- **AuthContext**: The React context that manages authentication state, including the `user` object and `guestMode` flag.
- **LangContext**: The React context that manages the active UI locale and provides translation strings.
- **HistoryContext**: The React context that manages the user's session history entries.
- **Navbar**: The top navigation bar component rendered on all pages.
- **GuestBanner**: A dismissible informational strip shown on AI tool pages when the user is in guest mode.
- **SmartRoute**: The updated route wrapper that replaces `PrivateRoute`, allowing guest access to AI tool pages while still protecting dashboard and profile routes.
- **optionalAuth**: The Express middleware that attaches `req.user` from a valid JWT or sets it to `null` for unauthenticated requests, and always calls `next()`.
- **safeParseJSON**: The utility function in `aiRoutes.js` that parses a JSON array from an AI response string, returning a fallback on failure.
- **buildMultilingualSystemPrompt**: The function that prepends a language-detection instruction to a tool-specific system prompt.
- **Locale**: One of the four supported UI language codes: `fr`, `ar`, `darija`, `en`.
- **Guest_Mode**: A UX state where an unauthenticated user can access AI tools with ephemeral (non-persisted) sessions, indicated by a `sessionStorage` flag.
- **Bootstrap_Icons**: The icon set from the `react-icons/bs` package used to replace all emoji characters in the UI.
- **RTL**: Right-to-left text direction, applied when the active locale is `ar` or `darija`.
- **Token_Budget**: The `max_tokens` value passed to the Groq SDK per AI tool call, calibrated to balance response quality and latency.

---

## Requirements

### Requirement 1: AI Prompt Quality and Token Budget Optimization

**User Story:** As a Moroccan student, I want the AI tools to give me more accurate, well-structured, and contextually relevant responses, so that I can study more effectively.

#### Acceptance Criteria

1. WHEN a request is sent to any AI tool endpoint, THE AI_Router SHALL use the tool-specific optimized system prompt defined in `buildOptimizedPrompt` rather than the previous generic prompt.
2. WHEN a chat request is processed, THE AI_Router SHALL set `max_tokens` to 1000.
3. WHEN a summary request is processed, THE AI_Router SHALL set `max_tokens` to 1500.
4. WHEN a quiz request is processed, THE AI_Router SHALL set `max_tokens` to 2500.
5. WHEN a flashcards request is processed, THE AI_Router SHALL set `max_tokens` to 1800.
6. WHEN an orientation request is processed, THE AI_Router SHALL set `max_tokens` to 1500.
7. WHEN an exam request is processed, THE AI_Router SHALL set `max_tokens` to 3000.
8. THE AI_Router SHALL include explicit JSON format instructions in the system prompts for the quiz, flashcards, and exam endpoints to minimize malformed responses.
9. WHEN the Groq_SDK throws an error during any AI route call, THE AI_Router SHALL return HTTP 500 with `{ error: err.message }`.

---

### Requirement 2: UI and Style Preservation with SVG Logo

**User Story:** As a student using EduCompass, I want the application to display a proper branded logo and maintain the existing beige/brown visual theme, so that the interface feels polished and consistent.

#### Acceptance Criteria

1. THE Navbar SHALL render the SVG file at `client/src/images/educompass_logo.svg` as an `<img>` element for the brand logo.
2. THE Navbar SHALL display the text "EduCompass" alongside the SVG logo as the brand name.
3. WHEN the SVG logo is rendered, THE Navbar SHALL never fall back to an emoji or text-only placeholder.
4. THE application SHALL preserve the existing beige/brown CSS color palette across all pages and components.
5. WHEN the theme toggle is activated, THE ThemeContext SHALL switch between light and dark variants of the beige/brown palette without altering the base color scheme.

---

### Requirement 3: Multilingual AI Responses

**User Story:** As a Moroccan student who may write in French, Darija, Arabic MSA, or English, I want the AI to respond in the same language I used, so that I receive answers I can understand naturally.

#### Acceptance Criteria

1. WHEN any AI tool endpoint receives a request, THE AI_Router SHALL call `buildMultilingualSystemPrompt` to prepend a language-detection instruction to the tool's base system prompt.
2. WHEN `buildMultilingualSystemPrompt` is called with `uiLang = 'fr'`, THE AI_Router SHALL always prepend the French-language detection instruction.
3. WHEN `buildMultilingualSystemPrompt` is called with `uiLang = 'ar'`, THE AI_Router SHALL prepend the Arabic-language detection instruction.
4. WHEN `buildMultilingualSystemPrompt` is called with `uiLang = 'darija'`, THE AI_Router SHALL prepend the Darija-language detection instruction.
5. WHEN `buildMultilingualSystemPrompt` is called with `uiLang = 'en'`, THE AI_Router SHALL prepend the English-language detection instruction.
6. IF `uiLang` is not one of the four valid locale codes, THEN THE AI_Router SHALL default to the French-language detection instruction.
7. THE AI_Router SHALL fully preserve the base system prompt content in the enriched prompt returned by `buildMultilingualSystemPrompt`.
8. WHEN a student sends a message in language `L`, THE Groq_SDK SHALL receive a system prompt instructing it to respond in language `L`, regardless of the `uiLang` value.

---

### Requirement 4: Icon Replacement with Bootstrap Icons

**User Story:** As a student using EduCompass, I want the interface to use consistent, professional icons instead of emoji characters, so that the UI looks polished across all browsers and operating systems.

#### Acceptance Criteria

1. THE application SHALL install and use the `react-icons` package (version `^5.x`) as the sole icon library.
2. THE application SHALL replace every emoji icon in JSX with the corresponding `react-icons/bs` (Bootstrap Icons) component as defined in the icon mapping in the design document.
3. WHEN the Navbar renders, THE Navbar SHALL use `BsMoon` and `BsSun` icons for the theme toggle instead of the `🌙` and `☀️` emoji.
4. WHEN the Navbar renders, THE Navbar SHALL use `BsPersonCircle` for the profile link instead of the `👤` emoji.
5. WHEN any AI tool page renders, THE application SHALL use Bootstrap Icons components for all action buttons, avatars, and status indicators.
6. IF an emoji character has no direct semantic equivalent in the icon map, THEN THE application SHALL use `BsQuestionCircle` as the fallback icon.
7. AFTER the migration, THE application SHALL contain no emoji characters in any rendered JSX component.

---

### Requirement 5: Guest Mode for AI Tools

**User Story:** As a student who has not registered, I want to access all AI tools without creating an account, so that I can try the application before committing to registration.

#### Acceptance Criteria

1. WHEN an unauthenticated user navigates to any AI tool page (`/chat`, `/summary`, `/quiz`, `/orientation`, `/flashcards`, `/exam`), THE SmartRoute SHALL render the page without redirecting to `/login`.
2. WHEN an unauthenticated user navigates to `/dashboard` or `/profile`, THE SmartRoute SHALL redirect to `/login`.
3. WHEN an unauthenticated user accesses an AI tool page, THE application SHALL display the GuestBanner below the Navbar.
4. THE GuestBanner SHALL provide a Login button that navigates to `/login` and a Register button that navigates to `/register`.
5. WHEN a guest user dismisses the GuestBanner, THE GuestBanner SHALL not reappear for the remainder of that browser session.
6. WHEN a guest user submits a request to any AI tool endpoint, THE AI_Router SHALL process the request and return the AI response without requiring authentication.
7. WHEN a guest user receives an AI response, THE HistoryContext SHALL NOT create a history entry and SHALL NOT write to `localStorage`.
8. WHEN a guest user logs in, THE AuthContext SHALL clear the `guestMode` flag and set `user` to the authenticated user object.
9. THE AuthContext SHALL ensure that `user !== null` and `guestMode === true` never hold simultaneously.
10. THE AuthContext SHALL store the `guestMode` flag in `sessionStorage` (key: `educompass_guest`) so it is ephemeral and does not persist across browser sessions.
11. WHEN the Chat page is in guest mode, THE Chat page SHALL display a soft login prompt after a configurable number of messages without blocking further use.

---

### Requirement 6: Language Switcher Expansion (FR / AR / Darija / EN)

**User Story:** As a Moroccan student, I want to switch the application interface between French, Arabic, Darija, and English, so that I can use the app in my preferred language.

#### Acceptance Criteria

1. THE LangContext SHALL support four locale codes: `fr`, `ar`, `darija`, and `en`.
2. THE Navbar SHALL display four language buttons labeled `FR`, `عر`, `دارجة`, and `EN`.
3. WHEN a language button is clicked, THE LangContext SHALL update the active locale and persist it to `localStorage` under the key `educompass_lang`.
4. WHEN the active locale is `ar` or `darija`, THE LangContext SHALL set `isRTL = true` and apply `dir="rtl"` to the root wrapper element.
5. WHEN the active locale is `fr` or `en`, THE LangContext SHALL set `isRTL = false` and apply `dir="ltr"` to the root wrapper element.
6. THE LangContext SHALL provide complete translation maps for all four locales covering all existing UI string keys.
7. WHEN the application loads and `localStorage` contains a valid locale code, THE LangContext SHALL restore that locale as the active language.
8. IF `localStorage` contains an unrecognized locale value, THEN THE LangContext SHALL default to `fr`.
9. THE Navbar SHALL visually highlight the currently active language button.

---

### Requirement 7: Visual Improvements with Illustrations

**User Story:** As a student visiting EduCompass, I want to see appealing illustrations in the hero section, feature cards, and empty states, so that the application feels welcoming and visually engaging.

#### Acceptance Criteria

1. WHILE the user is on the Home page, THE Home page hero section SHALL display at least one contextual illustration image sourced from a free SVG library (e.g., unDraw or Storyset) that complements the beige/brown palette.
2. WHEN feature cards are rendered on the Home page, THE Home page SHALL display a relevant illustration or icon image within each feature card.
3. WHEN an AI tool page has no results yet (empty state), THE application SHALL display a contextual empty-state illustration rather than a blank area.
4. THE application SHALL store all illustration assets in `client/src/images/` and import them as static assets via Vite.
5. WHEN illustrations are rendered, THE application SHALL provide descriptive `alt` text for each `<img>` element for accessibility.

---

### Requirement 8: optionalAuth Middleware

**User Story:** As a system operator, I want AI endpoints to accept both authenticated and unauthenticated requests, so that guest users can use AI tools without a token while authenticated users retain full functionality.

#### Acceptance Criteria

1. THE optionalAuth middleware SHALL attempt to verify the `Authorization: Bearer <token>` header on every request to `/api/ai/*`.
2. WHEN a valid JWT is present, THE optionalAuth middleware SHALL attach the decoded payload to `req.user` and call `next()`.
3. WHEN no `Authorization` header is present, THE optionalAuth middleware SHALL set `req.user = null` and call `next()`.
4. WHEN an invalid or expired JWT is present, THE optionalAuth middleware SHALL set `req.user = null` and call `next()`.
5. THE optionalAuth middleware SHALL never send an HTTP 401 or 403 response.
6. THE optionalAuth middleware SHALL always call `next()` exactly once per request.
7. WHEN `req.user` is not null after optionalAuth, THE AI_Router SHALL be capable of persisting history for the authenticated user.
8. WHEN `req.user` is null after optionalAuth, THE AI_Router SHALL return only the AI-generated content without any user-specific data, logging, or anonymous usage tracking.

---

### Requirement 9: History Guard for Guest Sessions

**User Story:** As a guest user, I want my AI interactions to work without creating a persistent history, so that my session remains private and ephemeral.

#### Acceptance Criteria

1. WHEN `addEntry` is called and `AuthContext.user === null`, THE HistoryContext SHALL perform no operation and SHALL NOT modify `localStorage`.
2. WHEN `addEntry` is called and `AuthContext.user !== null`, THE HistoryContext SHALL prepend a new entry to the history array and update `localStorage`.
3. THE HistoryContext SHALL ensure `history.length` never exceeds 50 entries regardless of how many `addEntry` calls are made.
4. WHEN a guest user completes any AI tool interaction, THE application SHALL NOT display a history save confirmation or error to the guest user.

---

### Requirement 10: safeParseJSON Robustness

**User Story:** As a developer, I want the JSON parsing utility to handle malformed AI responses gracefully, so that quiz and flashcard generation never crashes the server.

#### Acceptance Criteria

1. WHEN `safeParseJSON` receives a string containing a valid JSON array, THE AI_Router SHALL return the parsed array.
2. WHEN `safeParseJSON` receives a malformed or non-JSON string, THE AI_Router SHALL return the provided fallback value without throwing an exception.
3. THE safeParseJSON function SHALL never throw an exception for any string input.
4. WHEN the AI returns no parseable questions or flashcards, THE AI_Router SHALL return HTTP 500 with `{ error: 'Aucune question générée' }` or equivalent.
