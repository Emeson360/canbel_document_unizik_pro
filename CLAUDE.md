# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Canbel Document Pro: a Laravel 10 + Inertia.js + React (TypeScript) app for issuing and approving academic result-notification documents. Three roles — Registrar, Supervisor, Admin — each get their own route group, controller, and page tree.

## Commands

Backend (PHP):
- `php artisan serve` — run the app
- `php artisan migrate` / `php artisan migrate:fresh --seed` — run migrations (see `database/seeders`)
- `composer install`
- `php artisan test` or `vendor/bin/phpunit` — run tests (only stub `ExampleTest`s exist in `tests/Unit` and `tests/Feature` currently)
- `vendor/bin/phpunit --filter TestName` — run a single test
- `vendor/bin/pint` — code style fixer (Laravel Pint is installed)

Frontend (Node):
- `npm install`
- `npm run dev` — Vite dev server
- `npm run build` — production build

There is no ESLint config in the repo despite the `es-lint-cleanup` branch name — if asked to set up linting, it needs to be added from scratch.

## Architecture

**Role-based routing/rendering pattern.** `routes/web.php` defines three parallel route groups under `admin`/`registrar`/`supervisor` prefixes, gated by `AdminMiddleware`/`RegistrarMiddleware`/`SupervisorMiddleware` (in `app/Http/Middleware`), which check `Auth::user()->role` against `App\Constants\UserRoles`. Each controller (`AdminController`, `RegistrarController`, `SupervisorController`) mirrors the same shape: `dashboard()`, `show_documents()`, document CRUD/preview, `show_settings()`. Controllers set `$this->role_name` from `UserRoles::ROLES_ALPHA` in their constructor and use it to select the Inertia page path, e.g. `Inertia::render("dashboard/$this->role_name/Documents", [...])` — so page components live in matching folders: `resources/js/pages/dashboard/{admin,registrar,supervisor}/`. Note: `RegistrarController`/`SupervisorController` (and their route prefixes/middleware) are pinned to the literal `UserRoles` labels (0=Registrar, 1=Supervisor), but the *responsibilities* behind each label are not implied by the class name — see Document lifecycle below for which controller currently owns issuing vs. approving.

**Inertia page resolution gotcha.** `resources/js/app.tsx` globs `./Pages/**/*.tsx`, but the actual directory is lowercase `resources/js/pages/`. This only works because of case-insensitive filesystem lookups (macOS default) — it will break on a case-sensitive filesystem (most Linux CI/prod). Be aware of this when touching `app.tsx` or moving page files.

**Document lifecycle** (`app/Models/Document.php`, `App\Constants\DocumentStatuses`): `PENDING → AWAITING_APPROVAL → APPROVED | REFUSED`.
- A document row is first created as blank "paper stock" (`PENDING`), pre-allocated with a `unique_name` (see the "nor" paper ID prefix logic from recent commits).
- Supervisor picks a pending paper and fills it in via `SupervisorController::issue_document` (also owns the student-submission intake queue that feeds into it) → status becomes `AWAITING_APPROVAL`.
- Registrar approves/refuses via `RegistrarController::approve_refuse_document` → `APPROVED` or `REFUSED` (+ `refusal_comment`).
- If refused, the supervisor can edit and resubmit via `SupervisorController::update_document`, which pushes status back to `AWAITING_APPROVAL`. If approved, the supervisor prints it.
- `Document::issuer()`/`approver()` relations (belongsTo `User` via `registered_by`/`approved_by`) are role-neutral by design — they describe who performed the action, not which literal role label performed it.
- `App\Constants\DocumentTypes` currently only has undergraduate/postgraduate result notifications.

**Shared data via Inertia middleware.** `app/Http/Middleware/HandleInertiaRequests.php` shares `user` (with `role` translated to its alpha string via `UserRoles::ROLES_ALPHA`), `flash` messages (`message`/`success`/`error` session keys — controllers return these via `back()->with(...)` / `redirect()->with(...)`), and `fsUrl` (base URL for uploaded images under `storage/uploaded_img`).

**Frontend structure:**
- `resources/js/pages/dashboard/{role}/` — per-role pages (Dashboard, Documents, Settings, Issue/Update/Preview Document).
- `resources/js/components/dashboard/Layout.tsx` + `components/dashNav/` — shared dashboard chrome (sidebar/top nav), applied per-page in `app.tsx` based on whether the page name starts with `dashboard/{admin,registrar,supervisor}/`.
- `resources/js/utils/` — a large shared kit of form/UI primitives (custom inputs, select, date picker, modal, pagination, document menu/search, currency input) reused across role pages rather than duplicated.
- `resources/js/utils/types.ts` — `UserRoleEnum` (`admin`/`supervisor`/`registrar`) must stay in sync with `App\Constants\UserRoles::ROLES_ALPHA` on the backend.
- Chakra UI is the component library (`theme/index.tsx` for the custom theme), wired up in `app.tsx`.
- Path alias `@` → `resources/js` (configured in both `vite.config.js` and `tsconfig.json`).


## Development Notes

- Only use the @resources/js/utils/DocumentMenu.tsx component when there is a large data set of more than 20 items else use the @resources/js/utils/CustomMenu.tsx component, except where explicitly told otherwise.

- Always use soft delete for delete features unless explicitly told otherwise.

- If prompt includes creating migration or seeder files, do not also run migration/seeder unless explicitly specified in the prompt.