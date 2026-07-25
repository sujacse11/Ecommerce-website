# Modern E-Commerce Platform (Full-Stack)

A complete, production-ready E-Commerce platform built with **Django 5 + DRF**, **React (Vite + Tailwind CSS)**, **PostgreSQL**, **Docker Compose**, and **GitHub Actions CI/CD**.

---

## 🌟 Key Features

- **Authentication & Role-Based Permissions**:
  - Roles: `CUSTOMER`, `SELLER`, `ADMIN`.
  - JWT Authentication via `djangorestframework-simplejwt` with automatic token refresh interceptor in React.
  - User registration, login, email verification tokens, password reset requests, and user address management.

- **Product Catalog & Management**:
  - Categories, Brands, Products, Product Images, and Inventory models.
  - Product search, filtering by price/category/brand/featured, and pagination.
  - Stock quantity update endpoints for sellers and admins.

- **Cart, Wishlist & Checkout**:
  - User-bound shopping cart with total calculation and quantity controls.
  - Saved wishlist toggle.
  - Discount coupon validation system (`WELCOME10` pre-seeded).
  - Checkout flow with COD (Cash on Delivery instant support) + Stripe & Razorpay stubbed payment intents ready for production keys.

- **Order Tracking & Management**:
  - Live order status tracking: `PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`.
  - Order cancellation capabilities for customers.

- **AI Floating Chatbot Assistant**:
  - Floating widget powered by rule-based query parser (order tracking, return policies, product search/recommendation) and LLM handler (OpenAI/Gemini).

- **Seller & Admin Dashboards**:
  - Seller: Store product counts, order volume, and revenue metrics.
  - Admin: System-wide platform metrics, total sales, user count, and recent transactions.

---

## 🏗️ Project Structure

```
.
├── backend/
│   ├── core/               # Settings, URLs, WSGI, ASGI
│   ├── accounts/           # User model, JWT Auth, Address, Password Reset
│   ├── common/             # Roles permissions, Custom pagination, Error handler
│   ├── products/           # Categories, Brands, Products, Inventory, Seed command
│   ├── cart/               # Shopping Cart API
│   ├── orders/             # Order, Wishlist, Coupon, Checkout APIs
│   ├── payments/           # COD, Stripe, Razorpay intent APIs
│   ├── reviews/            # Product Ratings & Reviews
│   ├── notifications/      # User Notifications
│   ├── chatbot/            # AI Chatbot endpoint
│   ├── analytics/          # Dashboards data
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance with JWT refresh interceptor
│   │   ├── components/     # Navbar, Footer, ProductCard, ChatbotWidget, ProtectedRoute
│   │   ├── context/        # AuthContext & CartContext
│   │   ├── pages/          # Home, ProductList, Detail, Cart, Wishlist, Checkout, Orders, Dashboards
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Stack runner (Postgres + DRF + React)
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started (Docker Compose)

### 1. Run via Docker Compose (Recommended)
```bash
# Clone repository
git clone https://github.com/your-username/ecommerce-website.git
cd ecommerce-website

# Start containers with automatic database migrations and initial seed data
docker-compose up --build
```
- **Backend API**: `http://localhost:8000/api/v1/`
- **Frontend App**: `http://localhost:5173/`

### 2. Initial Pre-Seeded Accounts
Run `python manage.py seed_data` (automatically executed in Docker) to generate test accounts:
- **Admin**: `admin@ecommerce.com` / `Admin123!`
- **Seller**: `seller@ecommerce.com` / `Seller123!`
- **Customer**: `customer@ecommerce.com` / `Customer123!`
- **Promo Coupon**: `WELCOME10` (10% Off)

---

## ⚡ Manual Local Setup (Without Docker)

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Unix: source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Deployment Instructions

### 1. Database (Supabase PostgreSQL)
1. Create a project at [Supabase](https://supabase.com/).
2. Copy the Connection URI (Transaction Mode).
3. Set `DATABASE_URL` in your backend environment variables on Render.

### 2. Backend (Render Free Tier)
1. Create a Web Service on Render pointing to the `/backend` folder.
2. Build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data`
3. Start command: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`
4. Set Environment Variables from `.env.example`.

### 3. Frontend (Vercel / Netlify / Render Static)
1. Connect repository to Vercel/Netlify pointing to `/frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_BASE_URL` to your live Render backend URL (e.g., `https://ecommerce-backend.onrender.com/api/v1`).

---

## 📄 License
MIT License. Free for commercial and non-commercial use.
