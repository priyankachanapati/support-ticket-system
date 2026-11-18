# Employee Support Ticket Management App — Implementation Plan

**Status:** Approved  
**Spec:** `SPEC.md` version 1.2  
**Date:** 18 Nov 2026

This plan implements the approved specification. It does not authorize application code until implementation is explicitly approved.

Product requirements, users, business rules, sample data, validation, storage behavior, and acceptance criteria 1–14 stay as written in `SPEC.md`. This plan changes only the technology used to build them.

## Technology

- React with JavaScript (JSX)
- Vite for the development server and production build
- Tailwind CSS for responsive styling
- Lucide React for icons
- React Router `HashRouter` for the routes in `SPEC.md` section 2.1
- Browser `localStorage` key `support-ticket-demo-v1`
- Vitest and React Testing Library for automated tests

There is no backend, database server, or real authentication.

Manual verification for every browser step uses `npm run dev`. Viewport checks use a narrow width of about 375px and a desktop width of about 1280px.

The demonstration notice text is:

`Demonstration only. Role switching is not real authentication.`

User-provided titles, descriptions, and comments render as React text children, `{value}`. Form fields are controlled inputs. Shared layout, list, form, and banner components are reused by the employee and support pages.

## Project structure

```
src/components/   Reusable UI
src/pages/        Route screens
src/data/         Users, enums, and seed data
src/utils/        Dates, validation, tickets, query, and storage
src/context/      Application state
src/test/         Test setup and source checks
```

Page tests live next to their pages. Utility tests live next to their utilities.

## Step 1 — Vite, React, Tailwind, and test foundation

**Depends on:** none.

**Files created or replaced by the Vite React JavaScript template, then adjusted in this step:**

- `package.json`
- `package-lock.json`
- `vite.config.js`
- `index.html`
- `.gitignore`
- `src/main.jsx`
- `src/App.jsx`
- `src/index.css`
- `src/test/setup.js`
- `src/App.test.jsx`

**Files removed if the template adds them:** `src/App.css`, `src/assets/react.svg`, and the default Vite favicon markup that the shell does not use.

**Left untouched:** `SPEC.md`, `IMPLEMENTATION_PLAN.md`, and `README.md`.

**Functionality:** Create the Vite React JavaScript app in the existing project without overwriting `SPEC.md`, `IMPLEMENTATION_PLAN.md`, or `README.md`. Add React Router, Lucide React, Tailwind CSS through the official Vite plugin, Vitest, jsdom, React Testing Library, and jest-dom. `vite.config.js` registers the React and Tailwind plugins and the Vitest jsdom setup. `src/index.css` contains only the Tailwind import. `src/App.jsx` renders the text “Employee Support Ticket Management” as a React text child. `src/App.test.jsx` asserts that heading. Scripts are `dev`, `build`, and `test`.

**Manual verification:**

- `npm test` passes.
- `npm run dev` shows the heading, with no console errors.
- `npm run build` completes.
- `src/` contains no `dangerouslySetInnerHTML`, `innerHTML`, `insertAdjacentHTML`, `document.write`, or `eval`.

**Commit message:** `Add the Vite React app shell and test setup.`

## Step 2 — Application shell and demonstration role switcher

**Depends on:** Step 1.

**Files created:**

- `src/data/constants.js`
- `src/components/AppShell.jsx`
- `src/components/DemoNotice.jsx`
- `src/components/RoleSwitcher.jsx`

**Files modified:**

- `src/App.jsx`
- `src/main.jsx`
- `src/App.test.jsx`

**Functionality:** `constants.js` defines Ravi, Priya, and Alex with the ids and roles from the spec, plus the category, priority, and status lists. `AppShell` uses Tailwind for a header and a main region that work at about 375px and about 1280px. `DemoNotice` shows the demonstration notice. `RoleSwitcher` lists the three users with name and role. The active user starts as Ravi and is held in React state. Ravi and Priya render an employee placeholder. Alex renders a support placeholder. A Lucide icon may accompany the switcher; the name and role remain text. `HashRouter` is mounted, with every path showing this shell until the later routes exist.

**Manual verification:**

- Fresh load shows Ravi, the employee placeholder, and the demonstration notice.
- Choosing Priya keeps the employee placeholder and shows Priya.
- Choosing Alex shows the support placeholder, Alex’s name, and Alex’s role.
- The notice remains visible at narrow and desktop widths, without horizontal scrolling.
- `npm test` passes, including an assertion that the notice text is present.

**Commit message:** `Add the demonstration role switcher and application shell.`

## Step 3 — localStorage, seed data, and reset

**Depends on:** Step 2.

**Files created:**

- `src/data/seed.js`
- `src/utils/storage.js`
- `src/context/AppState.jsx`

**Files modified:**

- `src/data/constants.js`
- `src/components/AppShell.jsx`
- `src/App.jsx`

**Functionality:** `seed.js` matches `SPEC.md` section 11 field for field, including tickets `tkt-1001` through `tkt-1005` and comments `cmt-2001` through `cmt-2004`. `storage.js` reads and writes `support-ticket-demo-v1`. A write succeeds only when `localStorage` accepts the full JSON value. Missing, invalid, or incomplete data is replaced by the seed only after that write succeeds. A valid store is reused. If `localStorage` is missing or a read throws, the context exposes `Browser storage is unavailable. Changes cannot be saved.` and does not present an in-memory copy as saved data.

`AppState` loads that result once and provides the state through a hook. The shell shows the storage message when one exists. **Reset demonstration data** asks for confirmation. Cancel leaves the store unchanged. A successful reset restores section 11 and selects Ravi. A failed reset shows `Demonstration data could not be reset. The current tickets are unchanged.` Changing user persists `activeUserId`. If that write is rejected because storage is full, the previous user stays active and the app shows `The selected user could not be saved. This demonstration is still using {name}.`

The employee and support placeholders list loaded ticket titles as React text, so the seed is visible before the real dashboards.

**Manual verification:**

- Clear the key, reload, and confirm Ravi and the titles in this order: Laptop not charging, Cannot log in to VPN, Need access to the shared project folder, Excel keeps crashing on startup, Request a second monitor.
- Confirm the five statuses and the four seed comments in Application storage.
- Reload and confirm the tickets and selected user remain.
- Select Alex, reload, and confirm Alex remains selected.
- Reset, cancel, and confirm the store stays. Reset, confirm, and confirm the seed and Ravi return.
- Store `{` under the key and reload. The seed appears only after the repair write succeeds.
- Make `localStorage.setItem` throw and run reset. Confirm the reset error and the previous tickets.

**Commit message:** `Persist demo state in localStorage and seed the sample tickets.`

## Step 4 — Employee dashboard

**Depends on:** Step 3.

**Files created:**

- `src/utils/dates.js`
- `src/components/TicketList.jsx`
- `src/components/EmptyState.jsx`
- `src/pages/EmployeeDashboardPage.jsx`

**Files modified:**

- `src/App.jsx`
- `src/components/AppShell.jsx`

**Functionality:** `#/dashboard` for Ravi and Priya renders `EmployeeDashboardPage`. It lists tickets whose `createdBy` is the active user. `TicketList` shows title, category, priority, status, and the UTC created date as `D MMM YYYY`. Sort is `createdAt` newest first, then higher ticket id. Status and priority are words. A Lucide icon may accompany a status and does not replace the word. Ravi’s order is Laptop, VPN, shared folder, Excel, second monitor. Priya sees `EmptyState`: she has not submitted any tickets. Rows are not links yet. Alex still sees the support placeholder.

**Manual verification:**

- As Ravi, confirm the five rows, columns, and dates 18 Nov 2026, 16 Nov 2026, 15 Nov 2026, 10 Nov 2026, and 2 Nov 2026.
- As Priya, confirm the empty state and no seed titles.
- Return to Ravi and confirm his five tickets.
- Check about 375px and about 1280px.

**Commit message:** `Show each employee only their own tickets.`

## Step 5 — Ticket details

**Depends on:** Step 4.

**Files created:**

- `src/components/CommentList.jsx`
- `src/pages/TicketDetailPage.jsx`

**Files modified:**

- `src/components/TicketList.jsx`
- `src/App.jsx`

**Functionality:** Routes from `SPEC.md` section 2.1 are registered with `HashRouter`. A ticket row links to `#/tickets/<id>`. Detail shows every ticket field and `CommentList`. Comments are oldest first and show the author name, the UTC timestamp as `D MMM YYYY, HH:mm`, and the body as React text. Tickets with no comments say there are no comments yet. An employee route for another person’s ticket redirects to `#/dashboard`. This page has no edit action, status control, or comment form.

**Manual verification:**

- As Ravi, open each seed ticket and match section 11, including both monitor comments and the VPN and Excel comments.
- Open `#/tickets/tkt-1001` directly as Ravi.
- As Priya, open `#/tickets/tkt-1001` and confirm the employee dashboard.
- Confirm the closed monitor ticket has no edit control.
- Confirm the comment times `17 Nov 2026, 16:30`, `12 Nov 2026, 13:10`, `4 Nov 2026, 09:00`, and `6 Nov 2026, 09:45`.

**Commit message:** `Show full ticket details for tickets the active user may open.`

## Step 6 — Ticket submission and validation

**Depends on:** Step 5.

**Files created:**

- `src/utils/validate.js`
- `src/utils/tickets.js`
- `src/components/TicketForm.jsx`
- `src/pages/TicketFormPage.jsx`

**Files modified:**

- `src/context/AppState.jsx`
- `src/pages/EmployeeDashboardPage.jsx`
- `src/App.jsx`

**Functionality:** Employees reach `#/tickets/new` from the dashboard. Alex opening that hash is redirected to `#/dashboard`. `TicketForm` is a labeled, controlled form for title, description, category, and priority. `validate.js` trims text and returns the section 7 messages. A validation failure stays on the form, keeps the entered values, and does not save. A valid save uses `tickets.js` to build the next `tkt-` id, status Open, the active employee as creator, and equal `createdAt` and `updatedAt`. The context writes the whole store. After `localStorage` accepts it, React Router navigates to that ticket’s detail. Detail is the success confirmation. Duplicate titles are allowed. The new ticket appears only on the author’s dashboard.

**Manual verification:**

- As Priya, submit a blank form and confirm the required messages, the preserved fields, and no new stored ticket.
- Confirm the messages for a whitespace-only title, a title over 100 characters, and a description over 2000 characters.
- Submit a valid ticket and confirm detail shows Priya, Open, and matching created and updated dates.
- Confirm Priya’s list contains only her ticket and Ravi still has his five.
- Submit a duplicate title and confirm ids `tkt-1006` and `tkt-1007`.
- As Alex, open `#/tickets/new` and confirm the redirect.

**Commit message:** `Let employees submit a ticket with field validation.`

## Step 7 — Employee ticket editing

**Depends on:** Step 6.

**Files modified:**

- `src/utils/tickets.js`
- `src/utils/validate.js`
- `src/components/TicketForm.jsx`
- `src/pages/TicketFormPage.jsx`
- `src/pages/TicketDetailPage.jsx`
- `src/context/AppState.jsx`
- `src/App.jsx`

**Functionality:** The owner sees an edit link to `#/tickets/<id>/edit` when the status is Open, In Progress, or Resolved. The link is absent for Closed tickets and for Alex. `TicketFormPage` prefills the four editable fields. Save reuses submission validation. A successful write changes `updatedAt` and leaves `createdAt`, `createdBy`, and `status` unchanged, then opens detail. Cancel returns to detail without writing. A forbidden edit URL redirects to `#/dashboard`.

**Manual verification:**

- As Ravi, edit the laptop ticket’s title and category. Confirm the created date stays 18 Nov 2026, the status stays Open, and the last-updated date changes.
- Edit the Resolved Excel ticket and confirm the status stays Resolved.
- Confirm the Closed monitor ticket has no edit link. Open `#/tickets/tkt-1005/edit` and confirm the dashboard, with the ticket unchanged.
- As Priya, open `#/tickets/tkt-1001/edit` and confirm she does not see Ravi’s form.
- Choose Cancel during an edit and confirm the stored title is unchanged.

**Commit message:** `Let employees edit their own tickets until they are closed.`

## Step 8 — Support dashboard and status management

**Depends on:** Step 7.

**Files created:**

- `src/pages/SupportDashboardPage.jsx`
- `src/components/StatusSelect.jsx`

**Files modified:**

- `src/utils/tickets.js`
- `src/pages/TicketDetailPage.jsx`
- `src/context/AppState.jsx`
- `src/App.jsx`
- `src/components/AppShell.jsx`

**Functionality:** Alex’s `#/dashboard` renders `SupportDashboardPage`. It reuses `TicketList` for every ticket, adding the creator’s name, in the same sort order. A row opens detail. The page has no submission control and no field-edit control. `StatusSelect` is shown to Alex on detail, with the current status selected. Choosing any of the four statuses writes immediately. On success, the new status and last-updated time stay on screen and no comment is added. Employees do not see the control. Alex can move forward, backward, or skip statuses.

**Manual verification:**

- As Alex, confirm every Ravi and Priya ticket is listed with the creator.
- Move one ticket from Open to Resolved, to Closed, and back to In Progress. Confirm each status, a new last-updated date, and an unchanged comment count.
- As Ravi, confirm that status is visible and the select is absent.
- Confirm Alex has no new-ticket control and no edit control.
- Check narrow and desktop widths.

**Commit message:** `Add the support dashboard and status updates.`

## Step 9 — Comments

**Depends on:** Step 8.

**Files created:**

- `src/components/CommentForm.jsx`

**Files modified:**

- `src/utils/tickets.js`
- `src/utils/validate.js`
- `src/pages/TicketDetailPage.jsx`
- `src/context/AppState.jsx`

**Functionality:** `CommentForm` is shown to anyone who can view the ticket, including when it is Closed. Validation matches section 7: required after trim, maximum 1000 characters. A successful save appends the next `cmt-` id, the active user as author, the trimmed body, and `createdAt`. `CommentList` stays oldest first. The ticket’s `updatedAt` becomes that comment time. Existing comments remain. The component has no edit or delete control.

**Manual verification:**

- As Alex, comment on the Closed monitor ticket. Confirm it appears under the seed comments with Alex’s name and timestamp, and the last-updated date matches.
- As Ravi, add a comment on that ticket and confirm both remain.
- Submit an empty comment and a comment over 1000 characters. Confirm the messages, the preserved field text, and an unchanged thread.
- As Priya, confirm she cannot open Ravi’s ticket. Comment on her own ticket and confirm Ravi does not see it.
- Reload and confirm the comments remain.

**Commit message:** `Add comments on tickets, including closed tickets.`

## Step 10 — Search and filtering

**Depends on:** Step 9.

**Files created:**

- `src/utils/query.js`
- `src/components/SearchFilters.jsx`

**Files modified:**

- `src/pages/EmployeeDashboardPage.jsx`
- `src/pages/SupportDashboardPage.jsx`

**Functionality:** `SearchFilters` is a controlled title search plus status, category, and priority selects, reused by both dashboards. `query.js` applies a case-insensitive partial title match, ignores surrounding spaces, and combines the filters that are not All. The employee page filters after limiting tickets to the active employee. Results update as the controls change. **Clear search and filters** is visible when the query is non-empty or any filter is not All. A user who has tickets and zero matches sees a no-match `EmptyState` with Clear. Priya’s original empty state remains while she has no tickets.

**Manual verification:**

- As Ravi, search `vpn` and confirm only the VPN ticket.
- Filter High and Hardware and confirm only the laptop ticket.
- Filter Closed and search `monitor`, then clear and confirm all five return.
- As Alex, filter Access and confirm the shared-folder ticket, then search a Priya title and confirm it appears.
- As Priya with no tickets, confirm the original empty state.
- After Priya has a ticket, search a missing title and confirm the no-match state and Clear.

**Commit message:** `Add title search and combined filters on both dashboards.`

## Step 11 — Storage-failure behavior and safe text rendering

**Depends on:** Step 10.

**Files modified:**

- `src/utils/storage.js`
- `src/context/AppState.jsx`
- `src/components/TicketForm.jsx`
- `src/components/CommentForm.jsx`
- `src/components/StatusSelect.jsx`
- `src/components/RoleSwitcher.jsx`
- `src/components/AppShell.jsx`
- `src/pages/TicketDetailPage.jsx`
- `src/pages/TicketFormPage.jsx`

**Functionality:** Every mutation goes through `storage.js` and updates React state only after the write succeeds. A thrown write leaves the last successful store and the last successful React ticket state in place. The screen shows the exact section 10 message and no success navigation.

- Unavailable storage, for every action: `Browser storage is unavailable. Changes cannot be saved.`
- Failed create or edit: `The ticket could not be saved. Your entries are still in the form.` Controlled fields keep title, description, category, and priority, and the page stays on the form.
- Failed comment: `The comment could not be saved. Your text is still in the form.` The thread does not gain the comment.
- Failed status change: `The status could not be saved. The ticket still shows the previous status.`
- Failed user change and failed reset keep the Step 3 messages.

Titles, descriptions, and comments remain React text children in the list, detail, comment thread, and form values. This step removes any HTML insertion API if one was introduced. Characters such as `<`, `>`, `&`, and quotes stay visible as characters.

**Manual verification:**

- Make `localStorage.setItem` throw. Submit a valid ticket and confirm the ticket error, the filled form, no detail route, and no new stored ticket.
- Repeat for edit, comment, status, role switch, and reset.
- Restore `setItem`. Create a ticket whose title is `<img src=x onerror=alert(1)>` and whose description is `<script>alert(1)</script>`. Confirm those characters appear as text on the dashboard and detail, and that no alert runs.
- Add a comment containing the same markup and confirm the thread shows it as text.
- Confirm `src/` has no `dangerouslySetInnerHTML`.

**Commit message:** `Surface storage failures and keep user text as plain text.`

## Step 12 — Automated tests

**Depends on:** Step 11.

**Files created:**

- `src/data/seed.test.js`
- `src/utils/dates.test.js`
- `src/utils/validate.test.js`
- `src/utils/tickets.test.js`
- `src/utils/query.test.js`
- `src/utils/storage.test.js`
- `src/pages/EmployeeDashboardPage.test.jsx`
- `src/pages/TicketFormPage.test.jsx`
- `src/pages/TicketDetailPage.test.jsx`
- `src/test/safe-render.test.js`

**Files modified:**

- `src/test/setup.js`
- `vite.config.js`, only if the Vitest include path needs the new files

**Functionality:** Vitest covers the pure rules. React Testing Library covers the rendered screens. jsdom supplies `localStorage` for the storage tests.

- Seed, dates, validation, ticket transitions, query, and storage cases match the behaviors required by Steps 3–11, including failed writes and the section 10 messages.
- `EmployeeDashboardPage.test.jsx` renders Ravi’s five titles in order and Priya’s empty state.
- `TicketFormPage.test.jsx` shows a required-field message, keeps entered text, and navigates to detail only after a successful mock write.
- `TicketDetailPage.test.jsx` renders a comment body that contains `<script>` as literal text and shows no status select for Ravi.
- `safe-render.test.js` reads `src/` and fails if `dangerouslySetInnerHTML`, `innerHTML`, `insertAdjacentHTML`, `document.write`, or `eval` appears.

**Manual verification:**

- `npm test` passes.
- Temporarily add `dangerouslySetInnerHTML` in a component, confirm `safe-render.test.js` fails, then remove it and confirm the suite passes.

**Commit message:** `Add Vitest and React Testing Library coverage for tickets and screens.`

## Step 13 — Defect reproduction and fixing

**Depends on:** Step 12.

**Files modified:** only files required to fix a reproduced defect, plus a Vitest or React Testing Library test that fails before the fix and passes after it.

**Functionality:** Run `npm test` and the manual checks from Steps 2–11 against `SPEC.md` section 14. For each real defect, add a failing test, fix the cause, and re-run the suite and that check. If nothing fails, make no code change and do not create an empty commit.

**Manual verification:** Re-run the failing case and `npm test`.

**Commit message, only if a fix was required:** `Fix defects reproduced from the acceptance checks.`

## Step 14 — Security review

**Depends on:** Step 13.

**Files modified:** only files required to close a review finding, with a test that reproduces the finding.

**Functionality:** Review the React app against the approved spec:

- The role switcher carries the demonstration notice.
- Employee routes and edit routes redirect when the active user may not see or edit the ticket.
- Alex cannot submit or edit ticket fields.
- Closed tickets reject field edits and still accept comments.
- Failed saves use the section 10 messages and do not navigate to a success screen.
- User text is React text content, and the source scan finds no unsafe HTML insertion.
- The repo contains no passwords, API keys, real personal data, or a production-security claim.
- Delete, assignment, attachments, email, notifications, comment editing, and a status-history log are absent.

A clean review has no code change and no empty commit.

**Manual verification:** Repeat the markup and failed-save checks from Step 11, request Priya’s access to Ravi’s detail and edit routes, request Alex’s new-ticket and edit routes, and run `npm test`.

**Commit message, only if a finding was fixed:** `Fix security-review findings in rendering and storage errors.`

## Step 15 — Final review and README

**Depends on:** Step 14.

**Files modified:**

- `README.md`

**Functionality:** Final pass against acceptance criteria 1–14. `README.md` documents `npm run dev`, `npm test`, and `npm run build`; the three demonstration users; the demonstration notice; the `support-ticket-demo-v1` key; reset; and the lab limits from section 13. It states that role switching is not real authentication.

**Manual verification:** Follow the README from a fresh browser profile through the seed list, Priya’s private ticket, Alex’s status change, a closed-ticket comment, search plus two filters, reset, and one markup-as-text ticket. Run `npm test`. Check both viewport widths on the employee dashboard, support dashboard, and ticket detail.

**Commit message:** `Document how to run the support ticket demonstration.`

## Requirement coverage

| Spec area | Steps |
|---|---|
| React, Vite, Tailwind, Lucide, HashRouter | 1, 2, 5 |
| Three users and the demonstration switcher | 2, 3, 15 |
| Seed tickets and comments | 3, 12 |
| Employee dashboard, sort, empty states | 4, 10 |
| Ticket detail, routes, and direct-link limits | 5 |
| Submission, validation, ids, Open status | 6, 12 |
| Editing rules and Closed lock | 7, 12 |
| Support dashboard and any-status updates | 8, 12 |
| Comments, including on Closed tickets | 5, 9, 12 |
| Search and combined filters | 10, 12 |
| UTC date display | 4, 5, 12 |
| Load, seed, reset, and failed saves | 3, 11, 12 |
| Plain-text React rendering | 1, 11, 12, 14 |
| Responsive layout and text status labels | 2, 4, 8, 15 |
| Acceptance criteria 1–14, defects, security, README | 12–15 |
