// Uses Node.js built-in SQLite (available in Node v22.5+)
// No external packages needed — zero install issues.
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Database files live at: server/neobank.db ─────────────────────────────
const DB_PATH = join(__dirname, 'neobank.db');
const db = new DatabaseSync(DB_PATH);

// ─────────────────────────────────────────────────────────────────────────────
// TABLE 1: users
// Stores every registered user's profile (from onboarding form).
// ─────────────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    phone       TEXT    UNIQUE NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    age         INTEGER,
    gender      TEXT,
    employment  TEXT,
    aadhaar     TEXT,
    pin         TEXT    NOT NULL,
    upi_pin     TEXT    NOT NULL,
    account_no  TEXT    UNIQUE NOT NULL,
    upi_id      TEXT    UNIQUE NOT NULL,
    ifsc        TEXT    NOT NULL DEFAULT 'NEO0000123',
    created_at  TEXT    NOT NULL
  )
`);

// ─────────────────────────────────────────────────────────────────────────────
// TABLE 2: transactions
// Central ledger — every transfer creates TWO rows:
//   entry_type = 'debit'  for the sender   (owner_phone = sender)
//   entry_type = 'credit' for the receiver (owner_phone = receiver)
//
// Balance for any user = SUM(credit rows) - SUM(debit rows)
//   WHERE owner_phone = user.phone
// ─────────────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    tx_ref        TEXT    NOT NULL,
    date          TEXT    NOT NULL,
    owner_phone   TEXT    NOT NULL,
    entry_type    TEXT    NOT NULL CHECK(entry_type IN ('credit', 'debit')),
    tx_type       TEXT    NOT NULL,
    amount        REAL    NOT NULL CHECK(amount > 0),
    category      TEXT,
    description   TEXT,
    method        TEXT,
    counterparty  TEXT,
    fraud_score   INTEGER DEFAULT 0,
    is_fraud      INTEGER DEFAULT 0,
    sender_phone  TEXT,
    sender_name   TEXT
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_tx_owner
  ON transactions (owner_phone, date DESC)
`);

export default db;
