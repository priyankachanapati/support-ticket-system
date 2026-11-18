# Employee Support Ticket Management App — Specification

**Status:** Approved  
**Version:** 1.2  
**Date:** 18 Nov 2026

This document is the product specification. It records the approved requirements and the decisions confirmed on 18 Nov 2026, including storage-failure handling, plain-text rendering, and the React, Vite, Tailwind CSS, Lucide React, React Router, Vitest, and React Testing Library frontend. It does not describe an implementation plan or application code.

## 1. Purpose

Employees need one place to submit technical support requests and follow them. Support staff need one place to see every request, update its status, and discuss it with the employee.

The application is a small lab demonstration. It shows the ticket lifecycle from submission through closure, with separate employee and support-staff experiences.

## 2. Scope

The application is a client-side React application written in JavaScript with JSX. Vite provides the development server and the production build. Tailwind CSS provides the styling. Lucide React provides icons. React Router's HashRouter provides the routes in section 2.1. The application stores data in `localStorage`. It does not use a backend, a database server, accounts, or external company systems. Automated tests use Vitest and React Testing Library.

People choose a fictional user from a demonstration role switcher. The switcher is labeled as a demonstration. It is not authentication and it is not server-side authorization.

### 2.1 Routes

| Hash | Who can use it | Screen |
|---|---|---|
| `#/dashboard` | Ravi and Priya | Employee dashboard |
| `#/dashboard` | Alex | Support-staff dashboard |
| `#/tickets/new` | Ravi and Priya | Submission form |
| `#/tickets/new` | Alex | Redirect to `#/dashboard` |
| `#/tickets/<id>` | A user allowed to view that ticket | Ticket detail |
| `#/tickets/<id>` | Anyone else | Redirect to `#/dashboard` |
| `#/tickets/<id>/edit` | Owning employee, status Open, In Progress, or Resolved | Edit form |
| `#/tickets/<id>/edit` | Anyone else, and the owner when the ticket is Closed | Redirect to `#/dashboard` |
| Any other hash | Any user | Redirect to `#/dashboard` |

## 3. Demonstration users

Three users exist. Their identities are fixed.

| Id | Name | Role | Starting tickets |
|---|---|---|---|
| `user-ravi` | Ravi | Employee | All five seed tickets |
| `user-priya` | Priya | Employee | None |
| `user-alex` | Alex | Support Staff | None (views every ticket) |

The active user starts as Ravi the first time the app loads. The browser remembers the active user after that.

The role switcher is visible on every screen. It shows the three users with name and role. Nearby text states, in plain language, that role switching is a demonstration and is not real authentication.

Choosing a user replaces the current experience immediately:

- Ravi and Priya see the employee experience.
- Alex sees the support-staff experience.
- If the current screen is a ticket the new user is not allowed to see, the app opens that user's dashboard.

Employees submit tickets only as themselves. Alex does not submit tickets and does not edit ticket fields. Alex views every ticket, changes status, searches, filters, and comments.

## 4. Screens

The app has five screens. The hash for each screen is defined in section 2.1.

### 4.1 Employee dashboard

Shown to Ravi and Priya.

- Lists tickets created by the active employee.
- Each row shows title, category, priority, status, and created date.
- A row opens that ticket's detail screen.
- A control opens the submission form.
- Search and combined filters apply to this list (section 8).
- The list is sorted by created date, newest first. When two tickets share a created time, the higher ticket id is shown first.
- When the employee has no tickets, the screen explains that they have not submitted any tickets and offers the submission form.
- When the employee has tickets and the current search or filters match none, the screen explains that nothing matches and offers a way to clear search and filters.

### 4.2 Submission form

Shown to Ravi and Priya. Alex does not see a path to this form.

Fields:

- Title
- Description
- Category
- Priority

On a successful save, the app creates one ticket (section 6) and opens that ticket's detail screen. Opening detail is the confirmation that the ticket was saved. If validation fails, section 7 applies. If validation passes and the save fails, the app stays on this form, keeps the entered title, description, category, and priority, shows the error in section 10, and does not open detail or any success message.

### 4.3 Support-staff dashboard

Shown to Alex.

- Lists every ticket.
- Each row shows title, category, priority, status, created by, and created date.
- A row opens that ticket's detail screen.
- Search and combined filters apply to this list (section 8).
- Sort order matches the employee dashboard.
- There is no submission control and no field-editing control.
- When filters match nothing, the screen explains that nothing matches and offers a way to clear search and filters.

### 4.4 Ticket detail

Shows every stored field for one ticket:

- Title
- Description
- Category
- Priority
- Status
- Created by (the employee's name)
- Created date
- Last updated date
- Comment thread

Employees can open a ticket only when they created it. Support staff can open any ticket. A direct link to a ticket outside those rules opens the active user's dashboard.

Employees see an edit action when the ticket belongs to them and the status is Open, In Progress, or Resolved. The edit action is absent when the status is Closed, and absent for Alex.

Alex sees a status control with the four statuses. The current status is the selected value. Choosing another status saves immediately and keeps the user on this screen. After the save succeeds, the screen shows the new status and the new last-updated time. If the save fails, the control shows the last saved status, the last-updated time stays unchanged, and the screen shows the error in section 10. Employees do not see a status control.

Anyone who can view the ticket sees the comment form, including when the status is Closed.

Comments are listed oldest first. Each comment shows the author's name, the timestamp, and the comment text.

When a ticket has no comments, the thread says that there are no comments yet.

A comment is added to the thread only after the save succeeds. If the save fails, the thread is unchanged, the comment field keeps the entered text, and the screen shows the error in section 10.

### 4.5 Edit form

Available from detail for the owning employee when the status is Open, In Progress, or Resolved.

The form opens with the current title, description, category, and priority. The employee can change those four fields. Status, created by, created date, and last updated date are not editable controls.

Save validates the fields. After validation and the save both succeed, the app stores the new values, updates the last-updated time, and returns to detail. If validation fails, section 7 applies. If validation passes and the save fails, the app stays on this form, keeps the entered values, leaves the stored ticket unchanged, and shows the error in section 10. Cancel returns to detail and keeps the previous stored values.

## 5. Data model

### 5.1 Ticket

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. Seed ids are `tkt-1001` through `tkt-1005`. New ids continue from the highest existing numeric suffix, formatted `tkt-` plus that number. |
| `title` | string | Required after trim. Maximum 100 characters. |
| `description` | string | Required after trim. Maximum 2000 characters. |
| `category` | enum | `Hardware`, `Software`, `Network`, `Access`, `Other` |
| `priority` | enum | `Low`, `Medium`, `High` |
| `status` | enum | `Open`, `In Progress`, `Resolved`, `Closed` |
| `createdBy` | user id | Set to the active employee at creation. Never edited. |
| `createdAt` | ISO-8601 UTC | Set at creation. Never edited. |
| `updatedAt` | ISO-8601 UTC | Set to `createdAt` at creation. Updated when fields are edited, status changes, or a comment is added. |

### 5.2 Comment

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. Seed ids are `cmt-2001` through `cmt-2004`. New ids continue from the highest existing numeric suffix, formatted `cmt-` plus that number. |
| `ticketId` | ticket id | The ticket this comment belongs to. |
| `authorId` | user id | The active user at the time the comment is added. |
| `body` | string | Required after trim. Maximum 1000 characters. |
| `createdAt` | ISO-8601 UTC | Set when the comment is added. |

Comments cannot be edited or deleted during normal use. Resetting demonstration data replaces the whole store with the seed, which removes comments created during the session.

### 5.3 Stored application state

One JSON object in `localStorage` under the key `support-ticket-demo-v1`:

- `users`: the three users in section 3
- `tickets`: all tickets
- `comments`: all comments
- `activeUserId`: `user-ravi`, `user-priya`, or `user-alex`

## 6. Ticket lifecycle

New tickets always start as Open. The employee chooses title, description, category, and priority. The app sets id, created by, created time, last-updated time, and status.

Support staff can set a ticket to any of the four statuses from any current status. They may skip a status or move backward, including reopening a Closed ticket. Changing status updates `updatedAt` and does not add an automatic comment.

The usual path shown in the product is Open, then In Progress, then Resolved, then Closed. The app does not block other paths.

Employees see status and cannot change it.

Employees can edit title, description, category, and priority on their own tickets when the status is Open, In Progress, or Resolved. Closed tickets reject those edits. Employees cannot edit another person's ticket.

Comments can be added in every status, including Closed, by an employee on their own ticket and by support staff on any ticket. Adding a comment updates the ticket's `updatedAt`.

There is no ticket delete, assignment, attachment, or status-history log. Progress is the current status, the last-updated date, and the comment thread.

## 7. Validation

The app trims title, description, and comment text before validation and before saving. Category and priority are chosen from the enums.

| Condition | Message |
|---|---|
| Title is empty after trim | Title is required. |
| Title is longer than 100 characters | Title must be 100 characters or fewer. |
| Description is empty after trim | Description is required. |
| Description is longer than 2000 characters | Description must be 2000 characters or fewer. |
| Category is missing or outside the enum | Select a category. |
| Priority is missing or outside the enum | Select a priority. |
| Comment is empty after trim | Comment is required. |
| Comment is longer than 1000 characters | Comment must be 1000 characters or fewer. |

A failed validation stays on the form, keeps the entered values, and shows the messages next to the relevant fields. Nothing is saved. A failed save after valid input follows section 10.

Duplicate titles are allowed.

## 8. Search, filter, and sort

Both dashboards provide:

- A title search. Matching is case-insensitive. The title contains the query with leading and trailing spaces ignored. An empty query matches every title.
- A status filter: All, Open, In Progress, Resolved, Closed.
- A category filter: All, Hardware, Software, Network, Access, Other.
- A priority filter: All, Low, Medium, High.

Filters combine. A ticket appears only when it matches the query and every filter that is not All. The employee dashboard still limits the set to that employee's tickets before search and filter. The support dashboard searches all tickets.

Results update as the query or a filter changes. A clear control resets the query to empty and every filter to All. That control is available when the query is non-empty or any filter is not All.

## 9. Dates shown in the interface

Values are stored as ISO-8601 UTC strings.

- Created date and last updated date display the UTC calendar date as `D MMM YYYY`, for example `18 Nov 2026`.
- Comment timestamps display UTC date and time as `D MMM YYYY, HH:mm`, for example `17 Nov 2026, 16:30`.

Using UTC for display keeps the seed dates stable in every timezone.

## 10. Persistence and seed behavior

On load, the app reads `support-ticket-demo-v1`.

- When the key is missing, or the value is not valid JSON, or the value does not contain the three users, a `tickets` array, a `comments` array, and an `activeUserId` of one of those users, the app writes the seed state and sets the active user to Ravi. The five seed tickets are shown only after that write succeeds.
- When the stored state is valid, the app uses it, including tickets and comments created in an earlier visit.
- When `localStorage` is missing or reading it throws, the app does not present an in-memory copy as saved data. It shows: **Browser storage is unavailable. Changes cannot be saved.**

A save is any write of the whole application state: seed, repair, new ticket, edit, comment, status change, active-user change, or reset. The write succeeds only when `localStorage` accepts the full JSON value. If the write throws, the last successful stored state stays in place.

The app then shows an error and does not show a success message. It does not open a new ticket, add a comment, change a status, switch the active user, or present a reset as complete.

Entered values stay on screen when the screen has them:

- Ticket submission and edit keep the title, description, category, and priority the user entered.
- The comment field keeps the text the user entered.
- A failed status change shows the last saved status and the last saved last-updated time.
- A failed active-user change leaves the previous demonstration user active.
- A failed reset leaves the current tickets, comments, and active user unchanged.

| Situation | Message |
|---|---|
| Storage cannot be read, or a write fails because storage is unavailable | Browser storage is unavailable. Changes cannot be saved. |
| Creating or editing a ticket fails because the write was rejected, including when storage is full | The ticket could not be saved. Your entries are still in the form. |
| Saving a comment fails because the write was rejected, including when storage is full | The comment could not be saved. Your text is still in the form. |
| Saving a status fails because the write was rejected, including when storage is full | The status could not be saved. The ticket still shows the previous status. |
| Saving the active user fails because the write was rejected, including when storage is full | The selected user could not be saved. This demonstration is still using {name}. |
| Reset fails because the write was rejected, including when storage is full | Demonstration data could not be reset. The current tickets are unchanged. |

`{name}` is the name of the demonstration user who remains active. When storage itself is unavailable, every failed save uses the first message.

A **Reset demonstration data** action is available to every user. The control's label makes clear that it restores the original sample. The app asks for confirmation. After confirmation, the reset counts as complete only when the seed write succeeds. The store then matches section 11 and the active user is Ravi. Cancel leaves the data unchanged. A failed reset write shows the error above and leaves the current data unchanged.

## 11. Seed data

All five tickets are created by Ravi. Titles, categories, priorities, and statuses match the product sample exactly. Descriptions other than ticket 1 are fictional. Ticket 1 uses the description given in the product requirements.

### 11.1 Tickets

| Id | Title | Description | Category | Priority | Status | Created by | Created at (UTC) | Updated at (UTC) |
|---|---|---|---|---|---|---|---|---|
| `tkt-1001` | Laptop not charging | My laptop shows 0% even when plugged in. | Hardware | High | Open | Ravi | 2026-11-18T09:15:00.000Z | 2026-11-18T09:15:00.000Z |
| `tkt-1002` | Cannot log in to VPN | The VPN client rejects my sign-in and then times out after about 30 seconds. Other websites work on the office Wi-Fi. | Network | High | In Progress | Ravi | 2026-11-16T11:00:00.000Z | 2026-11-17T16:30:00.000Z |
| `tkt-1003` | Need access to the shared project folder | I need read access to the shared project folder that holds the onboarding documents. The folder returns an access-denied message for my account. | Access | Medium | Open | Ravi | 2026-11-15T14:20:00.000Z | 2026-11-15T14:20:00.000Z |
| `tkt-1004` | Excel keeps crashing on startup | Excel closes immediately after the splash screen. The other Office apps on this laptop open normally. | Software | Medium | Resolved | Ravi | 2026-11-10T08:40:00.000Z | 2026-11-12T13:10:00.000Z |
| `tkt-1005` | Request a second monitor | I need a second monitor at my desk so I can compare spreadsheets side by side. | Hardware | Low | Closed | Ravi | 2026-11-02T10:05:00.000Z | 2026-11-06T09:45:00.000Z |

Displayed created dates, newest first: 18 Nov 2026, 16 Nov 2026, 15 Nov 2026, 10 Nov 2026, 2 Nov 2026.

### 11.2 Comments

| Id | Ticket | Author | Body | Created at (UTC) |
|---|---|---|---|---|
| `cmt-2001` | `tkt-1002` | Alex | I am checking the VPN profile assigned to your account. | 2026-11-17T16:30:00.000Z |
| `cmt-2002` | `tkt-1004` | Alex | A repair build was applied. Please reopen this ticket if Excel still closes at startup. | 2026-11-12T13:10:00.000Z |
| `cmt-2003` | `tkt-1005` | Ravi | One external display is enough. HDMI is fine. | 2026-11-04T09:00:00.000Z |
| `cmt-2004` | `tkt-1005` | Alex | A second monitor has been issued and this request is closed. | 2026-11-06T09:45:00.000Z |

`tkt-1001` and `tkt-1003` have no seed comments. Each seed comment's time is on or before that ticket's `updatedAt`. The two tickets whose latest change is a seed comment share that comment's timestamp as `updatedAt`.

## 12. Presentation

The layout works on a narrow phone width and on a desktop width. Primary actions remain reachable without horizontal scrolling.

Form controls have visible labels. Status and priority are written as words. Color may reinforce a status and is never the only way to tell statuses apart.

The demonstration notice stays visible with the role switcher.

Tailwind CSS implements this layout with mobile-first utilities. Lucide icons may sit beside an action or a status. The visible words remain the labels: an icon does not replace the status name, the priority name, or the demonstration notice.

### 12.1 Safe rendering

Ticket titles, descriptions, and comment text are user-provided. Everywhere they appear, including dashboards, detail, comments, and form values, the app shows them as plain text.

The app does not interpret those strings as HTML or run them as JavaScript. It does not insert them through HTML markup. Characters such as `<`, `>`, `&`, quotes, and text that looks like a tag or a script remain visible as characters.

In the React interface, those strings are rendered as React text content. The application does not pass them through `dangerouslySetInnerHTML` or any other HTML parser.

## 13. Out of scope

This version does not include:

- Real authentication, passwords, or server-side authorization
- A backend, hosted API, or database
- Deleting a ticket
- Assigning a ticket to a support person
- Attachments
- Email or other notifications
- Editing or deleting a comment
- A separate audit log of status changes
- Production-grade security claims

## 14. Acceptance criteria

1. The first visit with an empty store shows Ravi's five seed tickets with the titles, categories, priorities, and statuses in section 11, in the order Laptop, VPN, shared folder, Excel, second monitor.
2. Priya's dashboard is empty until she submits a ticket. After she submits one, she sees only that ticket. Ravi still sees his own tickets and does not see Priya's.
3. Alex sees all tickets, including any Priya creates, and sees the creator's name.
4. A new ticket saves trimmed title, description, category, and priority, status Open, creator set to the active employee, and created and updated times set together. It appears on detail only after that save succeeds.
5. Empty or whitespace-only title, description, or comment is rejected with the messages in section 7. Titles over 100 characters, descriptions over 2000, and comments over 1000 are rejected. Category and priority can only be the listed values.
6. Ravi can edit his Open, In Progress, and Resolved tickets. Those edits change `updatedAt` and leave created time, creator, and status unchanged. His Closed ticket has no edit action, and the stored fields stay unchanged.
7. Alex can move any ticket to any of the four statuses, including backward and skipped steps. Each change updates `updatedAt`. Ravi and Priya have no status control.
8. Ravi, Priya (on her own tickets), and Alex can add a comment in every status, including Closed. The comment shows the author's name and a UTC timestamp. The ticket's last-updated date advances to that comment's time. Existing comments stay after a ticket is Closed.
9. Title search is a case-insensitive partial match. Status, category, and priority filters combine with search on both dashboards. Clearing restores the full list that role is allowed to see.
10. While storage is available, refreshing the browser keeps tickets, comments, and the active user. Resetting demonstration data, after confirmation and a successful write, restores section 11 and selects Ravi.
11. The role switcher is labeled as a demonstration, not real authentication.
12. The employee experience and the support experience are both usable on a narrow viewport and a desktop viewport.
13. If storage is unavailable, or a seed, create, edit, comment, status, active-user, or reset write fails, the app shows the matching message from section 10. It does not show a success message, and it does not show the failed change as saved. Submission, edit, and comment fields still contain what the user entered. A failed status change still shows the previous status.
14. A title, description, or comment that contains HTML or script markup is shown as literal characters on the dashboard, on detail, and in the comment thread. The app does not interpret that input as HTML or JavaScript.
