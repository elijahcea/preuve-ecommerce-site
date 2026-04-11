# Preuve — E-Commerce Storefront

A full-featured e-commerce storefront supporting products, product variants, collections, and a persistent shopping cart. Exposes a protected REST API consumed by the [Preuve Admin Console](https://github.com/elijahcea/preuve-admin-site) for managing storefront content.

🌐 **Live site:** [www.preuvenewyork.com](https://www.preuvenewyork.com)

---

## Tech Stack

| Technology                                    | Purpose                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| [Next.js](https://nextjs.org/) (App Router)   | UI and API routes                                       |
| [TypeScript](https://www.typescriptlang.org/) |                                                         |
| [Tailwind CSS](https://tailwindcss.com/)      |                                                         |
| [Prisma ORM](https://www.prisma.io/)          |                                                         |
| [PostgreSQL](https://www.postgresql.org/)     |                                                         |
| [Auth0](https://auth0.com/)                   | Authentication and JWT-based API route protection       |
| [Cloudinary](https://cloudinary.com/)         | Cloud image hosting and optimization for product images |

---

## Architecture Overview

This project handles both the customer-facing UI and the backend admin API:

- **Storefront UI** — Product listings, collection pages, and a persistent shopping cart for end users.
- **Admin API** — Protected API routes (secured via Auth0 + JWT) consumed by the Preuve Admin Console to create and manage products and collections.
- **Image pipeline** — Product images are uploaded via the admin console, stored and optimized in Cloudinary, and fetched here using Next.js image optimization.

---

## Project Structure

```
preuve-ecommerce-site/
├── prisma/           # Prisma schema and migrations
├── src/
│   └── app/          # Next.js App Router (pages, layouts, API routes)
├── public/           # Static assets
├── next.config.ts    # Next.js configuration
├── prisma.config.ts  # Prisma client configuration
└── package.json
```

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/)
- A running **PostgreSQL** instance (local or remote)
- An **Auth0** account with an application and API configured
- A **Cloudinary** account

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/elijahcea/preuve-ecommerce-site.git
   cd preuve-ecommerce-site
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   # Database
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

   # Auth0
   AUTH0_SECRET="your-auth0-secret"
   AUTH0_BASE_URL="http://localhost:3000"
   AUTH0_ISSUER_BASE_URL="https://YOUR_AUTH0_DOMAIN"
   AUTH0_CLIENT_ID="your-auth0-client-id"
   AUTH0_CLIENT_SECRET="your-auth0-client-secret"
   AUTH0_AUDIENCE="your-auth0-api-audience"

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Run Prisma migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Related Projects

- **[Preuve Admin Console](https://github.com/elijahcea/preuve-admin-site)** — The Vue.js admin dashboard that manages products and collections via this storefront's API.
