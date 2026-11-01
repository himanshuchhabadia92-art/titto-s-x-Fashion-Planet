# Titto's X Fashion Planet

E-commerce storefront and admin panel (Next.js, Tailwind, Prisma + PostgreSQL, Razorpay, Cloudinary, Gmail SMTP).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill it in (database URL, `SESSION_SECRET`, admin login, Razorpay, Cloudinary, SMTP).
3. `npx prisma migrate deploy` to create the tables.
4. `npm run db:seed` creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. On an empty database it also adds demo categories and products - delete them from the admin panel before launch.
5. `npm run dev`, then open http://localhost:3000 (store) and http://localhost:3000/admin (admin panel).

The database variable is called `TITTOS_DATABASE_URL`, not `DATABASE_URL`.

## What's inside

- **Store**: home page, collections (filter by availability / price / size, sort), product page, wishlist, cart, checkout (Razorpay online payment or cash on delivery), order confirmation email.
- **Admin** (`/admin`): products, categories, orders (status updates email the customer), customers with purchase history.
- Cart and wishlist are saved in the visitor's browser. Customers don't have accounts; a customer record is created from the details entered at checkout.
