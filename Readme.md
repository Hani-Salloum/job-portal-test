# Gym Management System frontend

Responsive Next.js and Tailwind CSS application shell for internal gym operations.

Implementation tracks central issues [#2](https://github.com/Hani-Salloum/gym_management_system/issues/2), [#4](https://github.com/Hani-Salloum/gym_management_system/issues/4), [#5](https://github.com/Hani-Salloum/gym_management_system/issues/5), and [#6](https://github.com/Hani-Salloum/gym_management_system/issues/6).

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Install dependencies: `npm install`.
3. Start the backend API on port 4000.
4. Start the frontend: `npm run dev`.
5. Open `http://localhost:3000`.

Requests under `/api` are rewritten to `API_URL`, keeping the session cookie on the application origin. The backend's `GYM_EDITION` deployment setting controls the read-only edition indicator and available Staff responsibility controls; it must not be exposed as an Owner-editable setting.

## Validation

- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`
- `npm run test:e2e:staff` (selective Staff Account lifecycle, Chromium only)
- `npm test -- e2e/members.spec.ts --project=chromium --workers=1` (Member registration, search, and card replacement)
- `npm test`
- `npm run test:e2e:full-stack` (one-command Trainer Edition PostgreSQL/backend/frontend/browser harness)
- `npm run test:e2e:base:full-stack` (one-command Base Edition entitlement browser harness)

The standard browser command expects a migrated and seeded backend to be running; set `E2E_OWNER_USERNAME` and `E2E_OWNER_PASSWORD` to its seed credentials. Set `E2E_GYM_EDITION` to match the backend deployment (it defaults to `BASE` for the Base entitlement journey). The Staff Account and Member journeys run only in Chromium with one worker because they deliberately mutate shared account and Member state. Backend integration tests provide the broader contract coverage.

The full-stack command requires Docker Compose and creates its own test database and credentials. After the run, tear down the disposable stack with `docker compose -f docker-compose.e2e.yml down -v`.

## Browser and camera validation

The standard suite runs the non-mutating login, validation, theme, and password-recovery coverage in Chromium, Firefox, WebKit (Safari engine), and emulated mobile Chromium. It also runs the manual Check-In journey in every standard browser project. Install the matching Playwright browsers before running the suite:

```sh
npx playwright install chromium firefox webkit
```

Run the login-validation smoke test and the manual Check-In journey against locally installed Stable Chrome and Microsoft Edge before release:

```sh
E2E_INCLUDE_SYSTEM_BROWSERS=true npm test -- e2e/owner-login.spec.ts e2e/check-ins.spec.ts --workers=1
```

The Stable browser projects are opt-in because the Docker E2E image contains Playwright browsers but not locally installed Chrome or Edge channels. This command requires a migrated, seeded backend. Install or update both browsers before running it; a missing installation is a test-environment failure, not evidence of browser support. WebKit is a useful Safari-engine check, but release validation must also manually confirm the same journey in the current Safari browser on macOS or iOS.

QR scanning uses the browser camera API and needs an HTTPS secure context outside `localhost`, a camera-capable device, and permission from the signed-in staff member. Rear-camera selection is a preference and cannot be guaranteed by every browser/device. The automated suite validates QR-token access rules through the API and browser manual lookup; it cannot validate a physical camera, device-specific focus, or permission prompts. Test those on supported physical mobile devices before release. If a camera is denied, unavailable, or unsupported, staff must use the manual Member lookup Check-In fallback.
