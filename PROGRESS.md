# Ski Stock Market Progress

Last updated: 2026-04-19

## Purpose

This file is the current AI handoff document for the Ski Stock Market project.
It merges the earlier detailed project snapshot, the newer trading-progress notes, and the actual workspace state verified from the codebase on 2026-04-19.

Where the git history and the working tree differ, this document calls that out explicitly.

## Project Snapshot

- Stack: React 19 + TypeScript + Vite on the client, Express 5 + TypeScript on the server, Prisma + PostgreSQL for persistence.
- Styling: Tailwind CSS v4 is installed and used lightly.
- Domain: a simulated stock market around ski-related companies, driven by a backend price engine.
- Product direction from prior handoff notes:
  - competitive/leaderboard gameplay
  - richer trading loop
  - event-driven market moves
- Actual implemented product scope today:
  - auth endpoints
  - company list/detail browsing
  - stock history and live-ish chart polling
  - market clock endpoint
  - backend buy/sell trade flows
- Frontend scope is still narrow:
  - browsing and charting exist
  - auth UI, trading UI, portfolio UI, and leaderboard UI do not

## Current Architecture

### Frontend

- Entry: `client/src/main.tsx`
- Routing: `client/src/App.tsx`
- Pages:
  - `client/src/pages/companyListPage.tsx`
  - `client/src/pages/companyPage.tsx`
  - `client/src/pages/auth/signIn.tsx`
  - `client/src/pages/auth/signUp.tsx`
  - `client/src/pages/portflioPage.tsx`
- Components:
  - `client/src/components/header.tsx`
  - `client/src/components/chart.tsx`
  - `client/src/components/renderGraph.tsx`
  - `client/src/components/renderLongGraph.tsx`
  - `client/src/components/companyPageComponents.tsx`
- API client: `client/src/api/api.ts`
- Helpers/data:
  - `client/src/utils/util.ts`
  - `client/src/data/data.ts`

### Backend

- Server bootstrap: `server/src/server.ts`
- Database client: `server/src/config/db.ts`
- Price engine: `server/src/priceEngine/priceEngine.ts`
- Controllers:
  - `server/src/controllers/authController.ts`
  - `server/src/controllers/compayController.ts`
  - `server/src/controllers/stockController.ts`
  - `server/src/controllers/marketController.ts`
  - `server/src/controllers/tradeController.ts`
- Routes:
  - `server/src/routes/authRoutes.ts`
  - `server/src/routes/companyRoutes.ts`
  - `server/src/routes/stockRoutes.ts`
  - `server/src/routes/marketRoutes.ts`
  - `server/src/routes/tradeRoutes.ts` in the current workspace
- Middleware and helpers:
  - `server/src/middlewares/authMiddleware.ts`
  - `server/src/utils/generateToken.ts`
  - `server/src/utils/gaussian.ts`
  - `server/src/utils/avgBuyPrice.ts`
- In-memory market cache:
  - `server/src/services/marketState.ts`

### Database

- Schema: `prisma/schema.prisma`
- Seed file: `prisma/seed.ts`
- Migrations currently present:
  - 2026-02-16 through 2026-03-24
- Latest schema additions include:
  - `User.balance`
  - `ledger` model
  - `transaction` enum
  - `ledger.quantity`
  - `ledger.avgBuyPrice`

## What Is Implemented Right Now

### Auth

- `POST /home/register`
  - Creates a user with `username`, `email`, and hashed `password`.
- `POST /home/login`
  - Validates username/password and returns a JWT.
- `tokenVerification`
  - Reads Bearer token
  - verifies JWT
  - loads the user from Prisma
  - attaches the Prisma `User` object to `req.user`
- Current workspace behavior:
  - trade routes use `tokenVerification`
  - frontend sign-up and sign-in pages now exist
  - login stores the returned JWT in browser storage for protected requests
  - navigation after sign-up/sign-in now uses React Router's `useNavigate`
- Current limitations:
  - auth is token/localStorage based for now, not httpOnly-cookie based
  - no logout UI yet
  - no full session restore/auth context yet

### Company Data

- `GET /company`
  - Returns all companies.
- `GET /company/:companyId`
  - Returns one company, its related stock, and current market-clock data as `time`.
- Frontend usage:
  - `client/src/pages/companyListPage.tsx` fetches the company list on mount.
  - `client/src/pages/companyPage.tsx` now performs an immediate fetch and then polls a single company every 5 seconds.

### Stock Data

- `GET /stock/:id/history`
  - Returns ordered historical price points from `priceHistory`.
- `GET /stock/:id`
  - Returns a minimal stock payload:
    - `stockId`
    - `currentPrice`
    - nested `company.companyName`
- `GET /stock`
  - Intended to return a stock list with a computed `changePercent`.
- Current limitations:
  - `GET /stock` depends on `server/src/services/marketState.ts`.
  - `setStock()` is never called anywhere in the current codebase.
  - That makes the in-memory stock list route effectively non-functional.
  - The `changePercent` there is also computed against `basePrice`, not `previousClose`.

### Trading

- Controller logic exists for:
  - `buyStock`
  - `sellStock`
- Current workspace route wiring:
  - `POST /trade/buy`
  - `POST /trade/sell`
- `buyStock` currently does all of the following inside a Prisma transaction:
  - loads user balance
  - loads current stock price
  - reads existing portfolio row
  - computes weighted average buy price
  - upserts the portfolio row
  - increments stock volume
  - decrements user balance
  - writes a `ledger` row with `transaction = BUY`
- `sellStock` currently does all of the following inside a Prisma transaction:
  - loads current stock price
  - verifies holdings exist
  - verifies quantity is available
  - updates or deletes the portfolio row
  - increments stock volume
  - increments user balance
  - writes a `ledger` row with `transaction = SELL`
- Current limitations:
  - there is no polished `GET /portfolio/ledger` frontend yet
  - `buyStock` rejects negative quantity, but still allows `0`
  - `sellStock` does not currently reject `0` or negative quantity explicitly

### Ledger

- Schema model name is `ledger` (lowercase in Prisma schema).
- Current fields:
  - `id`
  - `stockId`
  - `userId`
  - `transaction`
  - `quantity`
  - `avgBuyPrice`
  - `price`
  - `time`
- Current write behavior:
  - buy entries store `avgBuyPrice: null`
  - sell entries store `avgBuyPrice` from the portfolio row

### Market Simulation

- The server starts a repeating loop in `server/src/server.ts`.
- `priceEngine()` runs every 5 seconds.
- The engine:
  - reads all stocks from Prisma
  - reads the single `marketClock` row
  - updates prices only when phase is not `CLOSED`
  - persists stock and history changes back to Prisma
- Price movement logic currently includes:
  - Gaussian random noise
  - per-stock volatility
  - liquidity factor
  - bull/bear/side regimes
  - regime duration (`regimeTicksLeft`)
  - drift
  - momentum counter
  - volatility multiplier
  - random shocks with cooldown
- Data currently persisted by the engine:
  - `Stock.currentPrice`
  - `Stock.dayHigh`
  - `Stock.dayLow`
  - `priceHistory` rows
  - `activeStock` state fields
  - `marketClock.currentMarketTick`
  - `marketClock.currentPhase`
  - `marketClock.days`

### Market Clock

- `marketClock` model exists in Prisma.
- `GET /market/clock`
  - Returns:
    - `currentMarketTick`
    - `currentPhase`
    - `currentTime`
    - `days`
- The phase transition logic currently does this:
  - market closes at tick `420`
  - market reopens at tick `600`
  - reopening resets tick to `0` and increments `days`
- Current limitation:
  - the engine only transitions between `OPEN` and `CLOSED`
  - `PRE_MARKET` and `AFTER_HOURS` exist in the enum and dampening logic, but are never entered

### Frontend UI

- `/`
  - Renders a simple company list with links to company pages.
- `/company/:companyId`
  - Shows:
    - company name and industry in the header
    - current price
    - percent change vs `previousClose`
    - a day-range indicator
    - calculated analytical metrics derived from real company/stock fields
    - a live Recharts chart
    - working buy/sell flow in progress on the company page
- `/portfolio`
  - Basic portfolio rendering now exists.
  - Current state is functional but still needs real UI polish.
- The live chart flow:
  - loads recent history from `/stock/:id/history`
  - keeps a local live price window in `client/src/components/renderGraph.tsx`
  - keeps a local `liveTick` state so the X axis continues updating between page-level refreshes
  - renders simulated market-time labels using `tickToTime(...)`
- Current chart direction:
  - live chart is now being treated as a recent-window chart rather than full-history view
  - long-term chart work has started in `client/src/components/renderLongGraph.tsx`, but it is intentionally paused until there is enough historical data to make a 7-day trend chart look meaningful
- Current frontend limitations:
  - long-term chart is still incomplete and is currently deprioritized until the app accumulates more meaningful price history
  - live chart polling in `renderGraph.tsx` is currently set to `1000ms` even though the backend market loop still runs every `5000ms` in dev
  - live chart X-axis logic has been substantially improved, but should still be sanity-checked again once backend tick cadence and production timing are finalized
  - basic auth UI exists, but still needs polish and broader session handling
  - buy/sell logic plus UI are now reported working, but still need final stabilization and deployment-level validation
  - portfolio data is rendering, but the portfolio page still needs UI work
  - transaction history / ledger page still needs to be built out on the frontend
  - there is no leaderboard UI

## Important Data Model Evolution

The schema and migrations show a clear progression:

1. Initial core tables:
   - `User`
   - `Portfolio`
   - `Company`
   - `Stock`
2. Early schema cleanup:
   - fixed `establishedAt`
   - fixed `liquIdityFactor` typo to `liquidityFactor`
   - added uniqueness for `companyName`, `tickerSymbol`, and `username`
   - corrected `industryType` enum spelling for `INFRASTRUCTURE`
3. Portfolio changes:
   - added `avgBuyPrice`
   - changed uniqueness to `@@unique([userId, stockId])`
4. Price history:
   - added `priceHistory`
   - later removed incorrect uniqueness on `priceHistory.stockId`
5. Simulation-state normalization:
   - moved volatility/liquidity fields into `activeStock`
   - added `marketRegime`
   - added `lastReturn`
6. Market-session state:
   - added `previousClose`
   - added `volume`
   - added `marketClock`
   - added `days`
7. Trading state:
   - added `User.balance`
   - added `ledger`
   - added `transaction` enum
   - added `ledger.quantity`
   - added `ledger.avgBuyPrice`

## Timeline From Git History

### 2026-02-16

- `45cf028` Initial commit
- `c30f55f` Created the schema and partially created the seed file

### 2026-02-17

- `c46d4fb` Completed seed work and seeded the database

### 2026-02-18

- `c5495ed` Created register controller and route
- `51f126e` Created login route with JWT

### 2026-02-19

- `c82182b` Created price engine, base simulation logic, and `priceHistory`

### 2026-02-21

- `92a0c1f` Created routes for frontend stock and history fetching

### 2026-02-23

- `f71ccd3` Rendered graphs for stocks
- `a48ca9c` Created logic for specific company pages

### 2026-02-27

- `4fa4855` Price engine v1 is ready
  - `activeStock`
  - regimes
  - gaussian return generation
  - momentum
  - volatility multiplier
  - shock logic

### 2026-03-03

- `88d1acf` Installed Tailwind

### 2026-03-09

- `2874ef3` Created basic frontend UI

### 2026-03-12

- `38b7e1c` Added market `OPEN` and `CLOSED` logic

### 2026-03-23

- `22ec002` Implemented buy stock controller

### 2026-03-24

- `5fd8778` Created sell stock logic

### 2026-03-25

- `1c5dfbe` Ran `npm run build`

### 2026-03-26 to 2026-04-03

- `b4db7ec` Stat data is calculated, values update by tick on backend
- `9efb345` Live graph working better

### 2026-04-04

- Live graph logic was pushed further:
  - local `liveTick` state now drives the X-axis between page refreshes
  - chart uses simulated market-time labels instead of raw relative seconds
  - visible live-chart range is treated as a recent window rather than all history
  - Y-axis now scales from visible live prices rather than the broader dataset
- Long-term graph was explored with a 7-day fixed-range approach, but the current dataset is too sparse to make it visually useful yet.
- Decision for now:
  - pause long-term graph work
  - revisit it later once enough historical data exists
  - move next to page alignment/layout work and buy/sell UI/logic on the company page

### 2026-04-15

- Basic frontend auth pages were added:
  - `client/src/pages/auth/signUp.tsx`
  - `client/src/pages/auth/signIn.tsx`
- React Router auth routes are wired in `client/src/App.tsx`:
  - `/home/register`
  - `/home/signin`
- Sign-up flow now successfully calls the backend register API.
- Sign-in flow now successfully calls the backend login API and stores the returned JWT token.
- Fixed an `Invalid hook call` issue caused by calling `Navigate(...)` like a function; the auth pages now use `useNavigate()` for redirects after successful signup/signin.
- This unblocks authenticated API calls needed by the buy/sell flow, assuming the Axios auth header/interceptor is wired correctly.

### 2026-04-19

- Buy and sell logic plus UI are now reported working end-to-end from the company page.
- Portfolio API response structure was revisited to better support frontend rendering needs.
- Basic portfolio rendering now exists in `client/src/pages/portflioPage.tsx`.
- Current portfolio state:
  - data fetch/render path exists
  - page still needs UI polish
  - transaction history / ledger page is still the next major user-facing page to build

## Current Workspace Notes

As of 2026-04-19, the project has moved meaningfully past the 2026-03-24 snapshot:

- TypeScript/build blockers mentioned in the older handoff have been addressed.
- Company-page stats are now calculated from real data instead of static placeholders.
- `previousClose` is now updated on market close in the backend.
- `GET /company/:companyId` now includes market-clock context under `time`.
- Live chart work is underway with simulated tick-to-time labels and a recent-window approach.
- Basic sign-up/sign-in frontend pages are working and can store the login token.
- Basic portfolio rendering is now present.

## Current Build / Workspace Health

`npm run build` was previously failing on 2026-03-24, but that blocker was later cleared in the workspace.

There is still no automated test script in `package.json` right now.

## Known Gaps / Partial Areas

These are the main places where the project is incomplete, inconsistent, or only partially wired:

- `prisma/seed.ts` is fully commented out and contains stale imports, so seeding is not runnable as-is.
- `README.md` is still the default Vite template and does not describe the actual project.
- `GET /stock` depends on an in-memory cache that is never populated.
- `previousClose` has now been wired into market-close handling, but day/session reset behavior still needs another careful pass.
- `marketClock.currentTime` is returned by the API but not updated during ticks.
- `PRE_MARKET` and `AFTER_HOURS` are modeled but never used in phase transitions.
- Day-level session fields are incomplete:
  - `dayHigh` and `dayLow` reset logic still needs verification
  - session reset behavior should be validated against all stocks, not just visually on one page
- `volume` is incremented by trade flows, but the engine does not manage session resets around it.
- `client/src/components/renderLongGraph.tsx` is not finished yet and is intentionally parked for now until there is more useful price history to display.
- `client/src/components/chart.tsx` now has a clearer split between live-chart and long-term-chart data shapes, but the long-term side still needs another pass when that work resumes.
- Long-term chart currently should not be treated as product-ready even if it renders; the data volume is not yet sufficient for the intended 7-day experience.
- Live-chart polling cadence and backend tick cadence are not yet aligned for dev vs production.
- Auth pages now exist, but auth/session handling is still early and not yet polished.
- Portfolio rendering exists, but the portfolio page is not yet polished.
- Trading UI is now reported working, but still needs final validation before deployment.
- Ledger frontend is still missing.
- There is no leaderboard screen.
- The project vision mentions event-driven market moves and a scoreboard, but neither exists in code yet.

## Practical Reading Order For A Future AI

If you need to continue this project, read in this order:

1. `prisma/schema.prisma`
2. `server/src/priceEngine/priceEngine.ts`
3. `server/src/server.ts`
4. `server/src/controllers/*.ts`
5. `client/src/api/api.ts`
6. `client/src/pages/companyPage.tsx`
7. `client/src/components/renderGraph.tsx`
8. `server/src/services/marketState.ts`

That path gives the fastest understanding of both the real product flow and the current breakpoints.

## Suggested Next Priorities

The highest-value next steps are:

1. Build the transaction history / ledger page on the frontend.
2. Do the UI pass for portfolio and ledger:
   - clean layout
   - readable holding rows / cards
   - readable transaction rows / cards
   - empty states
3. Finish deployment-oriented stabilization:
   - validate login token is attached to protected API calls
   - validate buy flow updates balance/portfolio/ledger correctly
   - validate sell flow updates balance/portfolio/ledger correctly
4. Validate and fix day/session reset behavior in the engine:
   - `dayHigh`
   - `dayLow`
   - `previousClose`
   - session boundaries across all stocks
5. Replace the temporary/hard-to-reason-about simulated-time logic with a final stable version once backend timing rules are locked.
6. Make seeding runnable again and document setup in `README.md`.
7. Either populate `marketState` correctly or remove the in-memory dependency from `GET /stock`.
8. Revisit the long-term graph once enough real historical data exists to support 7-day, monthly, and yearly views.
9. Add logout/session restore after portfolio/ledger are stable.

## Bottom Line

This project has moved past scaffold status.
It already has a real Prisma schema, a functioning simulation loop, historical price persistence, auth foundations, market clock exposure, and backend buy/sell trading logic.

The main missing work is now in product completion and cleanup:
polishing portfolio/ledger into usable user pages, validating the trading loop for deployment, tightening market-session bookkeeping, parking the long-term chart until data catches up, and then finishing the session/logout experience.
