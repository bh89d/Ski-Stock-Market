# 🎿 Ski Stock Market

A real-time stock market simulator built around fictional ski companies.

This project focuses on implementing the **core mechanics of a stock market** rather than creating a polished user interface. The goal of Version 1 was to build a working backend simulation with live price updates, trading, portfolios, and market logic.

> **Current Status:** MVP (Version 1)
>
> The application is functional, but the UI/UX is still under development. Future versions will improve the interface and add more gameplay mechanics.

---

# Features

- 📈 Live stock price simulation
- 🏢 Multiple fictional ski companies
- 💹 Dynamic price engine
- 📊 Live price charts
- 💰 Buy & Sell stocks
- 👤 User authentication (JWT)
- 📁 Portfolio tracking
- 📜 Transaction ledger
- ⏰ Market clock simulation
- 📉 Market regimes (Bull / Bear / Sideways)
- ⚡ Random market shocks
- 📦 PostgreSQL database with Prisma ORM

---

# Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)

### Authentication

- JWT
- bcrypt

### Deployment

- Frontend: Vercel
- Backend: Render

---

# Project Structure

```
Frontend
│
├── React
├── TypeScript
├── Recharts
└── API Layer

Backend
│
├── Express
├── Controllers
├── Routes
├── Price Engine
├── Authentication
└── Prisma ORM

Database
│
└── PostgreSQL (Neon)
```

---

# Current Version (V1)

Version 1 focuses primarily on the **simulation logic**.

Implemented:

- Live market simulation
- Dynamic pricing engine
- Company pages
- Price history
- Trading system
- Portfolio management
- Transaction history
- Authentication
- REST API

Not yet implemented:

- Modern responsive UI
- Better dashboard
- Leaderboards
- Market news/events
- Order book
- Watchlists
- Search & filtering
- Advanced analytics
- Improved charts
- Mobile responsiveness

---

# Future Plans

- Improved UI/UX
- Portfolio analytics
- Company news & events
- Dividend system
- Limit & Stop orders
- Market leaderboards
- Achievements
- AI-driven market events
- Better stock charts
- Performance optimizations

---

# Why this project?

Most stock market demo projects simply generate random prices.

This project attempts to simulate more realistic market behavior by introducing:

- Bull/Bear/Sideways market regimes
- Volatility multipliers
- Momentum
- Liquidity factors
- Random market shocks
- Market phases
- Continuous price updates

The emphasis was on building the underlying simulation first, with UI improvements planned for later versions.

---

# Running Locally

## Backend

```bash
npm install
npm run dev
```

## Frontend

```bash
npm install
npm run dev
```

---

# Disclaimer

This is a fictional stock market simulator created for learning purposes.

It is **not intended for financial advice or real trading.**

---

## Author

Made by Bhaumik Trivedi
