# Fullstack Project (React + Node.js + Sequelize)

## 📌 Description

This is a fullstack web application built with React on the frontend and Node.js + Express on the backend.  
It uses Sequelize ORM for database management and includes a social platform system with users, posts, comments, likes, subscriptions, payments, and chat functionality.

Integrations:
- Claude API (AI chatbot)
- Stripe (payments & subscriptions)
- Tools-based AI system (cart, products, subscriptions)

---

## ⚙️ Tech Stack

Frontend:
- React

Backend:
- Node.js
- Express.js
- Sequelize (PostgreSQL / MySQL)
- JWT Authentication
- bcrypt

Integrations:
- Stripe API
- Claude API

---

## 🚀 Setup & Run

Clone project:
git clone <your-repo-url>  
cd <project-folder>  

Start backend:
npm i  
cd server  
npm run dev  

Start frontend:
npm i  
cd client  
npm run dev  

---

## 🗄️ Database Setup

npx sequelize-cli db:migrate  
npx sequelize-cli db:seed:all  

---

## 👤 Default Users (Seed Data)

- User: `lena@test.com` / `12345678`
- User: `john@test.com` / `12345678`
- Admin: `771397len@mail.ru` / `12345678`

> ⚠️ Admin account is required for system management. Only admin users can add categories and products.

---

## 💳 Stripe Setup

cd stripe  
stripe.exe login  
(approve access in browser)

stripe.exe listen --forward-to http://localhost:5000/stripe/webhook  

---

## 🌐 Ngrok (optional)

ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN  
ngrok http 5000  

---

## 📦 Features

- Auth (JWT)
- Posts system
- Comments
- Likes
- Chat system
- Stripe subscriptions
- AI chatbot (Claude API)
- Tools-based AI system (cart, products, subscription, payment)

---

## 🧠 Example User Questions to AI (Tools Usage)

### 🛒 Cart
- What is in my cart?
- Add iPhone to cart
- Remove iPhone from cart
- Add Xiaomi laptop to cart

### 🔍 Products
- Show me smartphones
- Find laptops under 1000
- Show electronics

### 💳 Subscription
- Am I subscribed?
- Subscribe me
- Check my subscription status

### 💰 Payment
- I want to buy this product
- Pay for my order
- Process payment for cart
