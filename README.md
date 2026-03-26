
# 💳 Neo Banking System 

A full-stack, modular Neo Banking System developed collaboratively, simulating real-world digital banking operations based on RBI-inspired guidelines. This project demonstrates how modern fintech platforms (like UPI and neo banks) handle transactions, authentication, analytics, and security in a scalable architecture.


## 🚀 Project Overview

This system replicates a **digital-first banking ecosystem**, where multiple modules interact to provide:

- Secure transactions
- Real-time account management
- Fraud detection
- Financial insights
- User authentication & KYC



---

## 🧩 Modules Breakdown

### 1. Customer Onboarding & KYC
- Add user details
- Validate PAN/Aadhaar format
- Store user profile

### 2. Authentication System
- PIN-based login
- OTP verification
- Retry limit handling

### 3. Account Management
- Account creation
- Balance tracking
- Account summary

### 4. 💥 Transaction Processing System (Core Module)
- Deposits / Withdrawals
- Fund Transfer
- Transaction logging
- RBI rule enforcement

### 5. Mini Statement Generator
- Last N transactions
- Date-wise filtering

### 6. UPI Payment Simulator
- UPI ID-based transfers
- Format validation

### 7. Expense Analyzer
- Categorization of spending
- Monthly reports
- Budget insights

### 8. Fraud Detection Module
- High-value transaction alerts
- Pattern-based detection
- Risk scoring

### 9. Credit Score Estimator
- Based on income & behavior
- User risk classification

### 10. Savings / Investment Planner
- Savings suggestions
- Basic financial planning

### 11. Notification System
- OTP alerts
- Transaction alerts
- Fraud alerts

---

## ⚙️ Core Features

- 🔐 Secure Authentication (PIN + OTP)
- 💸 Real-time Transaction Processing
- 📊 Expense Tracking & Analytics
- 🚨 Fraud Detection System
- 📩 Notification Engine
- 🧾 Transaction History & Statements

---

## 🇮🇳 RBI-Inspired Constraints

- UPI Transaction Limit: ₹1,00,000 per transaction/day
- Daily Transaction Count Limit
- KYC-based access control
- Fraud flags for high-value transactions
- Secure transaction logging

---

## 🔄 Transaction Flow

1. User initiates transaction
2. Authentication (PIN/OTP)
3. KYC validation
4. Balance check
5. RBI limit validation
6. Transaction execution
7. Logging & storage
8. Data sent to:
   - Statement module
   - Fraud detection
   - Notifications
   - Analytics

