# Employee Support Portal

A client-side React demonstration application for submitting, tracking, filtering, and discussing employee support tickets.

## Commands

- `npm run dev` — Start the Vite development server on port 3000 (`0.0.0.0:3000`)
- `npm test` — Run the Vitest and React Testing Library test suite
- `npm run build` — Build the production bundle
- `npm run lint` — Run ESLint across `src/`

## Onboarding & Demonstration Profiles

> **Demonstration only. Role selection is not real authentication.**

- On first visit, the **Employee Support Portal** welcome screen prompts for your name and position (**Employee** or **Support Team**).
- Returning users are taken directly to their dashboard until they click **Change Profile** in the header.
- **Ravi** (`Employee`) — Entering `Ravi` as an Employee accesses his five preloaded sample tickets (`tkt-1001` through `tkt-1005`).
- Newly registered employees start with an empty dashboard and see only their own tickets.
- Support Team members view all employee tickets, update ticket statuses, and add comments.

## Persistence & Reset

- Application state is persisted in browser `localStorage` under the key `support-ticket-demo-v1`.
- Use **Reset demonstration data** in the header (with confirmation) to restore the original five seed tickets and four seed comments and return to the welcome screen.

## Scope Limits

This demonstration has no backend, database, real authentication, passwords, ticket deletion, ticket assignment, attachments, email notifications, comment editing/deletion, or status-history audit log.