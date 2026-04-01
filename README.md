# 🔴 Neo Bank – Mini Transaction Dashboard

A sleek, modern **Flask + MySQL web application** that simulates a digital banking dashboard with advanced transaction filtering.

Built with a **premium red glassmorphism UI** inspired by Apple-style design.

---

## 🚀 Features

* 📊 View latest **N transactions**
* 📅 Filter transactions by **date range**
* 👤 Filter transactions by **user ID**
* 🎨 Modern UI with:

  * Glassmorphism effects
  * Gradient animations
  * Smooth hover interactions
* 🔐 Secure SQL queries (parameterized)

---

## 🛠️ Tech Stack

* **Backend:** Flask
* **Database:** MySQL
* **Frontend:** HTML, CSS (custom styling)

---

## 📂 Project Structure

```id="2gi0ar"
neo-bank/
│── app.py
│── templates/
│   └── index.html
│── static/
│   └── (optional assets)
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash id="gjxj0i"
git clone https://github.com/your-username/neo-bank.git
cd neo-bank
```

### 2. Install dependencies

```bash id="u5zyk7"
pip install flask mysql-connector-python
```

### 3. Setup MySQL Database

Create a database:

```sql id="b1bc40"
CREATE DATABASE vaxtronbank;
```

Create table:

```sql id="q9o2ne"
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount FLOAT,
    date DATE,
    description VARCHAR(255),
    type VARCHAR(50)
);
```

---

## 🔑 Environment Variables (IMPORTANT)

⚠️ Do NOT hardcode your database password

Set it like this:

**Windows**

```bash id="r0ccnc"
set DB_PASSWORD=yourpassword
```

**Linux / Mac**

```bash id="d4o922"
export DB_PASSWORD=yourpassword
```

---

## ▶️ Run the App

```bash id="3wboib"
python app.py
```

Then open:

```id="rh0mra"
http://127.0.0.1:5000/
```

---

## 📸 Preview

* Clean dashboard UI
* Interactive filters
* Smooth animations

---

## 🧠 Future Improvements

* 🔐 User authentication system
* 📈 Transaction analytics (charts)
* 🌐 Deploy on cloud (AWS / Render)
* 👥 Multi-user support

---

## ⚠️ Disclaimer

This project is for **educational purposes only** and does NOT represent a real banking system.

---

## 👨‍💻 Author

Built by **Buvan** 🚀
Aspiring developer focused on building real-world projects.

---
