# NeoBank 🏦

NeoBank is a modern, full-stack, mobile-first FinTech web application. It simulates a comprehensive digital banking platform, featuring an atomic transaction engine, cross-account synchronized ledgers, live beneficiary lookup, and a stunning dark-themed glassmorphism interface.

## 🌟 Key Features

*   **Atomic Transactions:** Powered by a SQLite backend, ensuring money sent from one user instantly credits the receiving user reliably.
*   **Live Beneficiary Lookup:** Search for users dynamically by Phone Number, UPI ID, or Name before initiating a transfer.
*   **Dual-Entry Ledger:** Computes user balances dynamically on the server by calculating all credits against all debits — just like a real bank.
*   **Fraud Detection Engine:** Server-side logic that automatically flags suspicious transfers.
*   **Glassmorphism UI:** Built completely in raw CSS, utilizing beautiful backdrop blurs, rich gradients, and fluid micro-animations.

## 🛠️ Technology Stack

The project runs on a robust, modern Full-Stack architecture:

### Frontend
- **React (v19.x)**: Client-side UI execution utilizing Context API for global state management.
- **Vite (v8.x)**: Lightning-fast bundler and dev server.
- **React Router DOM (v7.x)**: Handles seamless client-side routing.
- **Lucide React** & **Recharts**: For comprehensive iconography and interactive financial data visualization.

### Backend & Database
- **Node.js**: The core runtime environment.
- **Express.js**: Exposes RESTful API endpoints (`/api/login`, `/api/transactions`, etc.) handling all business logic.
- **Node:SQLite**: Utilizes Node's powerful native SQLite module to run a reliable relational database without any external native-compilation dependencies.

## 📁 Project Architecture

```text
NeoBank/
├── server/
│   ├── index.js             # The Express Backend API Server
│   ├── db.js                # SQLite schema and initialization
│   └── neobank.db           # Physical SQLite database file 
├── src/
│   ├── components/          # Reusable UI parts (Modal, UPIWidget, CreditCard)
│   ├── context/
│   │   └── DataContext.jsx  # Frontend state manager & API client
│   ├── pages/               # Full routes (Login, Onboarding, Dashboard)
│   ├── App.css              # Global styles & Glassmorphism theming
│   └── main.jsx             # React DOM injection point
└── package.json             # App dependencies and runtime scripts
```

## 🚀 Running Locally

To run the full stack simultaneously (both the API Server and the React Frontend):

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed (v22.5 is the minimum recommended for `node:sqlite` support, but v25.x is used here).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the environment**:
   ```bash
   npm run dev:all
   ```
   *(This launches the backend API on port 3001 and the Vite frontend on port 5173).*

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`. 

> **Note:** The SQLite database (`server/neobank.db`) will be automatically created on the server's first boot if it doesn't exist.
