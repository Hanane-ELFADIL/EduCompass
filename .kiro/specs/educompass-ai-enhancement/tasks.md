# Tasks

## Task 1: Create optionalAuth middleware and update AI routes to support guest access
- [x] 1.1 Create `server/src/middleware/optionalAuth.js` that verifies `Authorization: Bearer <token>`, sets `req.user` to the decoded JWT payload on success or `null` on failure/absence, and always calls `next()` without sending 401/403
- [x] 1.2 Update `server/src/routes/aiRoutes.js` to import and apply `optionalAuth` on all AI endpoints (`/chat`, `/summary`, `/quiz`, `/flashcards`, `/orientation`, `/extract`)
- [x] 1.3 Update `server/src/app.js` to ensure the AI router is mounted correctly with the new middleware in place

**Requirements**: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6

---

## Task 2: Implement buildMultilingualSystemPrompt and upgrade AI prompts with calibrated token budgets
- [x] 2.1 Add `buildMultilingualSystemPrompt(basePrompt, uiLang)` function to `aiRoutes.js` that prepends the correct language-detection instruction (in the target language) for each of the four locales (`fr`, `ar`, `darija`, `en`), defaulting to French for unrecognized values
- [x] 2.2 Update the `/chat` endpoint to use the optimized system prompt (400-word limit, Moroccan context, encouraging tone) with `max_tokens: 1000` and pass `uiLang` from the request body
- [x] 2.3 Update the `/summary` endpoint to use the structured summary prompt (markdown format, idées principales / concepts clés / résumé) with `max_tokens: 1500`
- [x] 2.4 Update the `/quiz` endpoint to use the improved QCM prompt with explicit JSON format instructions and `max_tokens: 2500`
- [x] 2.5 Update the `/flashcards` endpoint to use the improved flashcard prompt (exactly 8 cards, JSON only) with `max_tokens: 1800`
- [x] 2.6 Update the `/orientation` endpoint to use the Moroccan education system counselor prompt with `max_tokens: 1500`
- [x] 2.7 Add an `/exam` endpoint (or update existing quiz logic) with the exam-specific prompt and `max_tokens: 3000`
- [x] 2.8 Apply `buildMultilingualSystemPrompt` to every endpoint so all six tools receive the language-detection prefix

**Requirements**: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 10.1, 10.2, 10.3, 10.4

---

## Task 3: Enhance AuthContext with guestMode support
- [x] 3.1 Add `guestMode` state to `AuthContext` initialized from `sessionStorage.getItem('educompass_guest') === 'true'`
- [x] 3.2 Implement `enterGuestMode()` that sets `guestMode = true` and writes `'true'` to `sessionStorage` key `educompass_guest` (only callable when `user === null`)
- [x] 3.3 Implement `exitGuestMode()` that sets `guestMode = false` and removes the `sessionStorage` key
- [x] 3.4 Update `login()` to call `exitGuestMode()` so `user !== null` and `guestMode === true` never hold simultaneously
- [x] 3.5 Update `logout()` to also clear the `guestMode` flag and `sessionStorage` entry
- [x] 3.6 Expose `guestMode`, `enterGuestMode`, and `exitGuestMode` in the context value

**Requirements**: 5.8, 5.9, 5.10, 9.1

---

## Task 4: Expand LangContext to support four locales (fr / ar / darija / en)
- [x] 4.1 Add `darija` and `en` translation maps to `LangContext.jsx` covering all existing UI string keys present in the `fr` and `ar` maps
- [x] 4.2 Update `isRTL` computation to `lang === 'ar' || lang === 'darija'`
- [x] 4.3 Update `setLang` to persist the selected locale to `localStorage` under key `educompass_lang` and read it on initialization (defaulting to `'fr'` for unrecognized values)
- [x] 4.4 Change the `lang` type to `Locale = 'fr' | 'ar' | 'darija' | 'en'` and validate on set

**Requirements**: 6.1, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8

---

## Task 5: Install react-icons and replace all emoji icons across the codebase
- [x] 5.1 Install `react-icons@^5.x` as a dependency in `client/package.json`
- [x] 5.2 Replace emoji icons in `Navbar.jsx`: `🌙` → `BsMoon`, `☀️` → `BsSun`, `👤` → `BsPersonCircle`, `🎓` logo placeholder → SVG logo img
- [x] 5.3 Replace emoji icons in `Chat.jsx`: `💬` → `BsChatDots`, `🤖` → `BsRobot`, `👤` → `BsPersonCircle`, `⏳` → `BsHourglass`, `➤` → `BsSend`, `❌` → `BsXCircle`
- [x] 5.4 Replace emoji icons in `Summary.jsx`, `Quiz.jsx`, `Flashcards.jsx`, `Orientation.jsx`, and `Exam.jsx` using the icon mapping defined in the design document
- [x] 5.5 Replace emoji icons in `Dashboard.jsx`, `Profile.jsx`, `Home.jsx`, and any other pages that contain emoji characters in JSX'
- [x] 5.6 Verify no emoji characters remain in any rendered JSX component after migration

**Requirements**: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7

---

## Task 6: Update Navbar with SVG logo and four-language switcher
- [x] 6.1 Update `Navbar.jsx` to import `educompass_logo.svg` from `../images/educompass_logo.svg` and render it as an `<img>` element with `alt="EduCompass"` alongside the brand text "EduCompass"
- [x] 6.2 Replace the two language buttons (FR / عر) with four buttons: `FR`, `عر`, `دارجة`, `EN`, each calling `setLang` with the corresponding locale code
- [x] 6.3 Apply the `active` CSS class to the currently selected language button
- [x] 6.4 Replace emoji theme toggle icons with `BsMoon` / `BsSun` from `react-icons/bs`
- [x] 6.5 Replace the `👤` profile link with `BsPersonCircle` icon

**Requirements**: 2.1, 2.2, 2.3, 4.3, 4.4, 6.2, 6.9

---

## Task 7: Create GuestBanner component
- [x] 7.1 Create `client/src/components/GuestBanner.jsx` that renders a dismissible informational strip with a translated message, a Login button (navigates to `/login`), and a Register button (navigates to `/register`)
- [x] 7.2 Implement dismiss logic using `sessionStorage` so the banner does not reappear after dismissal within the same browser session
- [x] 7.3 Use `useLang` to display the banner message in the current locale (add translation keys for all four locales in `LangContext`)
- [x] 7.4 Style the banner to appear below the Navbar without blocking page content (non-modal)

**Requirements**: 5.3, 5.4, 5.5

---

## Task 8: Replace PrivateRoute with SmartRoute and enable guest access to AI tool pages
- [x] 8.1 Create a `SmartRoute` component in `App.jsx` (or a separate file) that: renders children for authenticated users; redirects to `/login` when `requireAuth` prop is set; renders children with guest mode auto-entered for AI tool pages when the user is unauthenticated
- [x] 8.2 Update `App.jsx` to use `SmartRoute` (without `requireAuth`) for `/chat`, `/summary`, `/quiz`, `/orientation`, `/flashcards`, `/exam`
- [x] 8.3 Update `App.jsx` to use `SmartRoute` with `requireAuth` for `/dashboard` and `/profile`
- [x] 8.4 Remove the old `PrivateRoute` component

**Requirements**: 5.1, 5.2

---

## Task 9: Integrate GuestBanner into AI tool pages and add guest-mode history guard
- [x] 9.1 Import and render `GuestBanner` at the top of `Chat.jsx`, `Summary.jsx`, `Quiz.jsx`, `Orientation.jsx`, `Flashcards.jsx`, and `Exam.jsx`, shown only when `guestMode === true`
- [x] 9.2 Update `HistoryContext.jsx` to import `useAuth` and make `addEntry` a no-op (no state update, no `localStorage` write) when `AuthContext.user === null`
- [x] 9.3 Add a soft login nudge to `Chat.jsx` that displays a non-blocking prompt after a configurable number of messages (e.g., 5) when in guest mode, without preventing further use
- [x] 9.4 Pass `uiLang` from `LangContext` in the request body of all API calls in the AI tool pages so the backend can apply the correct multilingual prompt

**Requirements**: 5.3, 5.6, 5.7, 5.11, 9.1, 9.2, 9.3, 9.4

---

## Task 10: Add contextual illustrations to Home page and empty states
- [x] 10.1 Source at least one free SVG illustration (e.g., from unDraw or Storyset) compatible with the beige/brown palette and save it to `client/src/images/`
- [x] 10.2 Add the hero illustration to `Home.jsx` hero section with descriptive `alt` text
- [x] 10.3 Add a relevant illustration or icon image to each feature card on the Home page with descriptive `alt` text
- [ ] 10.4 Add empty-state illustrations to each AI tool page (Chat, Summary, Quiz, Flashcards, Orientation, Exam) that display when no results are available yet, with descriptive `alt` text

**Requirements**: 7.1, 7.2, 7.3, 7.4, 7.5
