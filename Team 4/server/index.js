import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// HELPER: compute balance for a phone number by scanning
// the transactions table — sum credits, subtract debits.
// ─────────────────────────────────────────────────────────────
function computeBalance(phone) {
  const row = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN entry_type = 'debit'  THEN amount ELSE 0 END), 0) AS balance
    FROM transactions
    WHERE owner_phone = ?
  `).get(phone);
  return row ? row.balance : 0;
}

// ─────────────────────────────────────────────────────────────
// HELPER: find a user by phone, UPI ID, or name
// ─────────────────────────────────────────────────────────────
function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  const id = identifier.trim().toLowerCase();
  return db.prepare(`
    SELECT * FROM users
    WHERE phone = ?
       OR LOWER(upi_id) = ?
       OR LOWER(name)   = ?
    LIMIT 1
  `).get(identifier.trim(), id, id) || null;
}

// ══════════════════════════════════════════════════════════════
// USER ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/register — onboard a new user
app.post('/api/register', (req, res) => {
  const { name, phone, email, age, gender, employment, aadhaar,
          pin, upiPin, accountNo, upiId, ifsc, createdAt } = req.body;

  try {
    // Check for duplicate phone or email
    const existing = db.prepare('SELECT phone FROM users WHERE phone = ? OR email = ?').get(phone, email);
    if (existing) {
      return res.status(409).json({ error: 'Phone or email already registered.' });
    }

    db.prepare(`
      INSERT INTO users (name, phone, email, age, gender, employment, aadhaar,
                         pin, upi_pin, account_no, upi_id, ifsc, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, phone, email, age, gender, employment, aadhaar,
           pin, upiPin, accountNo, upiId, ifsc || 'NEO0000123', createdAt);

    // Give the new user their ₹10,000 welcome bonus
    db.prepare(`
      INSERT INTO transactions
        (tx_ref, date, owner_phone, entry_type, tx_type, amount, category, description, counterparty)
      VALUES (?, ?, ?, 'credit', 'deposit', 10000, 'Account Opening Deposit', 'NeoBank Welcome Bonus', NULL)
    `).run(`bonus_${phone}`, new Date().toISOString(), phone);

    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    return res.status(201).json({ success: true, user: formatUser(user) });
  } catch (err) {
    console.error('[register]', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/login — authenticate a user
app.post('/api/login', (req, res) => {
  const { phone, pin } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE phone = ? AND pin = ?').get(phone, pin);
    if (!user) return res.status(401).json({ error: 'Invalid phone or PIN.' });
    return res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/users/find?q=<phone|upiId|name> — lookup a registered user
app.get('/api/users/find', (req, res) => {
  const q = req.query.q || '';
  const user = findUserByIdentifier(q);
  if (!user) return res.json({ found: false, user: null });
  return res.json({ found: true, user: formatUser(user) });
});

// ══════════════════════════════════════════════════════════════
// TRANSACTION ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/transactions — add a transaction
// Body: { senderPhone, type ('deposit'|'withdraw'), amount, recipient, category, desc, method }
// The server scans the users table to find the recipient and writes
// both a DEBIT for the sender and a CREDIT for the recipient atomically.
app.post('/api/transactions', (req, res) => {
  const { senderPhone, type, amount, recipient, category, desc, method } = req.body;

  if (!senderPhone || !amount || amount <= 0) {
    return res.status(400).json({ error: 'senderPhone and amount are required.' });
  }

  try {
    const sender = db.prepare('SELECT * FROM users WHERE phone = ?').get(senderPhone);
    if (!sender) return res.status(404).json({ error: 'Sender not found.' });

    // ── Fraud detection removed ───────────────────────────────
    const fraudScore = 0;
    const isFraud = 0;

    const now    = new Date().toISOString();
    const txRef  = `tx_${Date.now()}`;

    // ── Execute inserts inside a transaction manually ───────────
    try {
      db.exec('BEGIN IMMEDIATE');

      if (type === 'deposit') {
        db.prepare(`
          INSERT INTO transactions
            (tx_ref, date, owner_phone, entry_type, tx_type, amount,
             category, description, method, counterparty, fraud_score, is_fraud)
          VALUES (?, ?, ?, 'credit', 'deposit', ?, ?, ?, ?, NULL, ?, ?)
        `).run(txRef, now, senderPhone, amount,
               category || 'Income', desc || 'Deposit', method || 'bank', fraudScore, isFraud);
        db.exec('COMMIT');
      } else {
        // ── SEND / TRANSFER ──────────────────────────────────────
        const recipientIdentifier = (recipient || '').trim();
        const balance = computeBalance(senderPhone);

        if (balance < amount) {
          throw new Error('Insufficient balance.');
        }

        // DEBIT for sender
        db.prepare(`
          INSERT INTO transactions
            (tx_ref, date, owner_phone, entry_type, tx_type, amount,
             category, description, method, counterparty, fraud_score, is_fraud,
             sender_phone, sender_name)
          VALUES (?, ?, ?, 'debit', 'withdraw', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(txRef, now, senderPhone, amount,
               category || 'Payment', desc || `Sent to ${recipientIdentifier}`,
               method || 'bank', recipientIdentifier, fraudScore, isFraud,
               senderPhone, sender.name);

        // Look up recipient in users table
        const recipientUser = findUserByIdentifier(recipientIdentifier);

        if (recipientUser && recipientUser.phone !== senderPhone) {
          // CREDIT for recipient
          db.prepare(`
            INSERT INTO transactions
              (tx_ref, date, owner_phone, entry_type, tx_type, amount,
               category, description, method, counterparty, fraud_score, is_fraud,
               sender_phone, sender_name)
            VALUES (?, ?, ?, 'credit', 'transfer_in', ?, 'Money Received', ?, ?, ?, 0, 0, ?, ?)
          `).run(`${txRef}_cr`, now, recipientUser.phone, amount,
                 `Received from ${sender.name || senderPhone}`,
                 method || 'bank', senderPhone, senderPhone, sender.name);
        }
        db.exec('COMMIT');
      }
    } catch (txnErr) {
      db.exec('ROLLBACK');
      throw txnErr;
    }

    // Return updated balance for sender
    const newBalance = computeBalance(senderPhone);
    return res.json({ success: true, isFraud: !!isFraud, fraudScore, newBalance });

  } catch (err) {
    console.error('[transactions]', err.message);
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/transactions/:phone — get all transactions for a user
app.get('/api/transactions/:phone', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM transactions
      WHERE owner_phone = ?
      ORDER BY date DESC
    `).all(req.params.phone);
    return res.json({ transactions: rows.map(formatTx) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/balance/:phone — compute balance by scanning transactions table
app.get('/api/balance/:phone', (req, res) => {
  try {
    const balance = computeBalance(req.params.phone);
    return res.json({ balance });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// FORMAT HELPERS (snake_case DB → camelCase frontend)
// ══════════════════════════════════════════════════════════════
function formatUser(u) {
  if (!u) return null;
  return {
    id:         u.id,
    name:       u.name,
    phone:      u.phone,
    email:      u.email,
    age:        u.age,
    gender:     u.gender,
    employment: u.employment,
    pin:        u.pin,
    upiPin:     u.upi_pin,
    accountNo:  u.account_no,
    upiId:      u.upi_id,
    ifsc:       u.ifsc,
    createdAt:  u.created_at,
  };
}

function formatTx(t) {
  return {
    id:           t.id,
    txRef:        t.tx_ref,
    date:         t.date,
    ownerPhone:   t.owner_phone,
    entryType:    t.entry_type,
    type:         t.entry_type === 'credit'
                    ? (t.tx_type === 'withdraw' ? 'transfer_in' : t.tx_type)
                    : t.tx_type,
    amount:       t.amount,
    category:     t.category,
    desc:         t.description,
    method:       t.method,
    counterparty: t.counterparty,
    fraudScore:   t.fraud_score,
    isFraud:      !!t.is_fraud,
    senderPhone:  t.sender_phone,
    senderName:   t.sender_name,
  };
}

// ══════════════════════════════════════════════════════════════
app.get('/api/health', (_, res) => res.json({ status: 'ok', db: 'neobank.db' }));

app.listen(PORT, () => {
  console.log(`\n🏦 NeoBank API Server running on http://localhost:${PORT}`);
  console.log(`📦 SQLite database: server/neobank.db`);
  console.log(`   Tables: users | transactions\n`);
});
