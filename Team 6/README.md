<div align="center">

<!-- Animated Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1aff,50:3b3bff,100:00c6ff&height=200&section=header&text=Neo%20Bank&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=UPI%20Payment%20Simulator&descAlignY=62&descSize=22&animation=fadeIn" width="100%"/>

<!-- Animated Logo -->
<br/>
<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=28&pause=1000&color=4F8EF7&center=true&vCenter=true&width=600&lines=🏦+Neo+Bank+UPI+Simulator;💸+Send+%7C+Receive+%7C+Track;🔐+Secure+%7C+Fast+%7C+Reliable;Built+with+❤️+by+Team+6" alt="Typing SVG" />

<br/>

<!-- Badges Row 1 -->
<p>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

<!-- Badges Row 2 -->
<p>
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square&logo=statuspal" />
  <img src="https://img.shields.io/badge/Team-6-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/UPI-Simulator-blue?style=flat-square&logo=googlepay" />
  <img src="https://img.shields.io/badge/PRs-Welcome-ff69b4?style=flat-square" />
</p>

</div>

---

<div align="center">

## 🌟 &nbsp; Project Snapshot

</div>

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
      <h3>🖥️ Login Screen</h3>
      <p><em>Clean UPI ID-based authentication with sample user hints for quick testing</em></p>
    </td>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%"/>
      <h3>💳 Dashboard</h3>
      <p><em>Real-time balance tracking, send money, and full transaction history</em></p>
    </td>
  </tr>
</table>

---

<div align="center">

## ✨ &nbsp; Features at a Glance

</div>

<table align="center">
<tr>
<td>

```
🔐  UPI ID Login         — No passwords, just your UPI ID
💸  Send Money           — Real-time P2P transfers
📊  Dashboard            — Live balance + stats
📜  Transaction History  — Full log with status
🛡️  Validations          — Format, PIN, balance checks
🚫  Self-Transfer Guard  — Blocked automatically
```

</td>
<td>

```
⚡  Instant API          — Flask REST backend
🗄️  SQLite DB            — Lightweight, portable
🌐  Responsive UI        — Works on any screen
🔄  Live Health Check    — "API Connected" badge
📝  Error Logging        — All failures recorded
🎯  Sample Users         — Ready for demo & testing
```

</td>
</tr>
</table>

---

<div align="center">

## 📁 &nbsp; Project Structure

</div>

```
📦 UPI-Payment-Simulator (Team 6)
 ┃
 ┣ 📂 backend/
 ┃  ┣ 📜 app.py              ← Flask application & routes
 ┃  ┣ 📜 database.py         ← DB connection & queries
 ┃  ┣ 🗄️ neobank.db          ← SQLite database
 ┃  ┗ 📋 requirements.txt    ← Python dependencies
 ┃
 ┣ 📂 frontend/
 ┃  ┣ 🌐 index.html          ← Login / Auth page
 ┃  ┣ 🌐 dashboard.html      ← Main dashboard
 ┃  ┣ 🌐 register.html       ← New user registration
 ┃  ┣ 🌐 send_money.html     ← Payment screen
 ┃  ┣ 🌐 transactions.html   ← Transaction history
 ┃  ┗ 🎨 style.css           ← Global styles
 ┃
 ┣ 📄 README.md
 ┗ 📄 start.txt
```

---

<div align="center">

## ⚙️ &nbsp; Quick Setup

</div>

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Sayandevxyz/upi-payment-simulator.git
cd upi-payment-simulator
```

### Step 2 — Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 3 — Launch the Flask API

```bash
python app.py
# ✅ API running at → http://localhost:5000
```

### Step 4 — Open the Frontend

```
📂 Open frontend/index.html in your browser
   OR serve it via Live Server (VS Code extension)

🟢 Look for the "API Connected" badge — you're ready!
```

---

<div align="center">

## 🌐 &nbsp; API Reference

</div>

<div align="center">

| Method | Endpoint | Description | Auth |
|:------:|:---------|:------------|:----:|
| `GET` | `/api/health` | 💚 Liveness check | ❌ |
| `GET` | `/api/dashboard` | 📊 Aggregate stats | ❌ |
| `GET` | `/api/users` | 👥 All users | ❌ |
| `POST` | `/api/users/create` | ➕ Create account | ❌ |
| `POST` | `/api/users/login` | 🔐 Fetch by UPI ID | ❌ |
| `POST` | `/api/users/balance` | 💰 Check balance | ✅ |
| `POST` | `/api/payments/send` | 💸 Send payment | ✅ |
| `POST` | `/api/transactions` | 📜 Last N transactions | ✅ |
| `GET` | `/api/transactions/all` | 📋 All transactions | ✅ |

</div>

---

<div align="center">

## 🗄️ &nbsp; Database Schema

</div>

```sql
-- ══════════════════════════════════════════
--   TABLE 1 : users
-- ══════════════════════════════════════════
CREATE TABLE users (
    id         INTEGER  PRIMARY KEY AUTOINCREMENT,
    name       TEXT     NOT NULL,
    upi_id     TEXT     NOT NULL UNIQUE,           -- e.g. sayan@okicici
    balance    REAL     NOT NULL DEFAULT 0.0
                        CHECK(balance >= 0),        -- never negative
    pin        TEXT     NOT NULL,                   -- 4-digit PIN (hashed)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ══════════════════════════════════════════
--   TABLE 2 : transactions
-- ══════════════════════════════════════════
CREATE TABLE transactions (
    id           INTEGER  PRIMARY KEY AUTOINCREMENT,
    sender_upi   TEXT     NOT NULL,
    receiver_upi TEXT     NOT NULL,
    amount       REAL     NOT NULL CHECK(amount > 0),
    status       TEXT     NOT NULL
                          CHECK(status IN ('Success','Failed')),
    note         TEXT     DEFAULT '',
    timestamp    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

<div align="center">

## ✅ &nbsp; Validations Built In

</div>

<div align="center">

| Validation | Rule | Outcome on Fail |
|:-----------|:-----|:----------------|
| 🔤 UPI Format | Must match `username@bank` regex | ❌ Rejected |
| 🔢 PIN Length | Exactly 4 digits | ❌ Rejected |
| 💰 Balance Check | Sender must have sufficient funds | ❌ Failed txn logged |
| 🚫 Self Transfer | Sender ≠ Receiver | ❌ Blocked |
| 📉 Non-negative Balance | Balance ≥ 0 enforced at DB level | ❌ DB constraint error |
| 📝 Failure Logging | All failed transactions are stored | ✅ Auditable |

</div>

---

<div align="center">

## 🧪 &nbsp; Sample Users for Testing

</div>

<div align="center">

| 👤 Name | 🔑 UPI ID | 🏦 Bank |
|:--------|:----------|:--------|
| Sayan Mondal | `sayan@okicici` | ICICI |
| Team 6 User | `team6@ybl` | Yes Bank (PhonePe) |
| Test User | `csbs@okhdfcbank` | HDFC |

</div>

> 💡 Use these IDs on the login screen to explore the simulator without registration.

---

<div align="center">

## 🛠️ &nbsp; Tech Stack

</div>

<div align="center">
<p>
  <img src="https://skillicons.dev/icons?i=python,flask,sqlite,html,css,js,vscode,git,github" />
</p>
</div>

---

<div align="center">

## 👑 &nbsp; Project Leader

</div>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:1a1aff,100:00c6ff&height=120&section=header&text=Sayan%20Mondal&fontSize=36&fontColor=ffffff&desc=Project%20Lead%20%7C%20Team%206&descSize=16&descAlignY=75&animation=twinkling" width="70%"/>

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Sayandevxyz-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sayandevxyz)
&nbsp;
[![Profile Views](https://komarev.com/ghpvc/?username=Sayandevxyz&color=4F8EF7&style=for-the-badge&label=PROFILE+VIEWS)](https://github.com/Sayandevxyz)

<br/>

<a href="https://github.com/Sayandevxyz">
  <img src="https://github-readme-stats.vercel.app/api?username=Sayandevxyz&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" height="150"/>
  &nbsp;&nbsp;
  <img src="https://github-readme-streak-stats.herokuapp.com?user=Sayandevxyz&theme=tokyonight&hide_border=true" height="150"/>
</a>

</div>

---

<div align="center">

## 👥 &nbsp; Team 6

</div>

<div align="center">

> 🎓 Built with passion as part of a full-stack simulation project.
> Every line of code crafted to simulate a real-world UPI banking experience.

</div>

---

<div align="center">

## 🤝 &nbsp; Contributing

</div>

Contributions are always welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request 🎉
```

---

<div align="center">

## 📜 &nbsp; License

</div>

<div align="center">

Distributed under the **MIT License**. See `LICENSE` for more information.

</div>

---

<div align="center">

<!-- Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00c6ff,50:3b3bff,100:1a1aff&height=120&section=footer&text=Made%20with%20❤️%20by%20Team%206&fontSize=18&fontColor=ffffff&animation=fadeIn" width="100%"/>

<br/>

⭐ **Star this repo** if you found it helpful!

[![Star History Chart](https://img.shields.io/github/stars/Sayandevxyz?style=social)](https://github.com/Sayandevxyz)

</div>
