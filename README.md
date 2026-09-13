# 🛒 Instacart Clone

A full-stack grocery shopping and real-time order tracking application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**. 

This project demonstrates core backend integration, real-time database synchronization, custom state management for cart management, and dynamic routing in a modern web app.

---

## 🚀 Live Demo

- **Live URL:** https://instacart-clone-chi.vercel.app

---

## ✨ Features

- **Storefront & Product Catalog:** Browse available grocery items pulled dynamically from the database.
- **Cart Management:** Custom React hook (`useCart.ts`) handling cart operations (add/remove items, quantity adjustments, live total calculation).
- **Checkout Flow:** Interactive checkout interface processing order details into Supabase database tables.
- **Real-Time Order Tracking (`/orders/[id]`):** Live order status updates using **Supabase Realtime subscriptions** (`Pending` ➔ `Shopping` ➔ `Out for Delivery` ➔ `Delivered`).
- **Admin Dashboard (`/admin`):** Interface to view orders and trigger real-time status updates across clients.
- **Responsive UI:** Clean, modern interface designed with Tailwind CSS.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime Subscriptions)
- **Hosting:** [Vercel](https://vercel.com/)

---

## 📁 Key Project Structure

```text
instacart-clone/
├── app/
│   ├── admin/             # Admin dashboard for updating order statuses
│   ├── checkout/          # Checkout page & form handling
│   ├── orders/
│   │   └── [id]/          # Real-time order tracker dynamic route
│   ├── globals.css        # Global CSS & Tailwind imports
│   ├── layout.tsx         # Root layout structure
│   └── page.tsx           # Storefront home page
├── lib/
│   ├── supabase.ts        # Supabase Client initialization
│   └── useCart.ts         # Custom state hook for shopping cart logic
└── public/                # Static assets & favicon
```

---

## ⚙️ Environment Variables & Local Setup
### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/skup13/instacart-clone.git
cd instacart-clone
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the app locally.

## 🔑 Key Engineering & Technical Highlights

1. **Supabase Realtime Channel:** Subscribes to PostgreSQL UPDATE events on the orders table using Supabase Realtime so status changes reflect immediately on the client without manual page refreshes.
2. **Custom Hook Architecture:** Separated cart domain logic into useCart.ts to keep page components lightweight, readable, and focused strictly on UI rendering.
3. **Dynamic App Routing:** Utilizes Next.js App Router dynamic parameter resolution ([id]) and UUID validation to safely fetch specific orders.