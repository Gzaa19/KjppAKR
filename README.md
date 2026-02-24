<div align="center">
  <img src="https://raw.githubusercontent.com/Gzaa19/KjppAKR/main/public/image/logoAKR.png" alt="KJPP AKR Logo" width="250"/>
  
  # KJPP Anas Karim Rivai & Rekan (AKR)
  
  **Company Profile & Portal Application for KJPP AKR**
</div>

<br />

<div align="center">
  <img src="https://raw.githubusercontent.com/Gzaa19/KjppAKR/main/public/image/hero/hero3.jpg" alt="KJPP AKR Preview" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"/>
</div>

## 📌 About the Project

This is a modern web application built for **KJPP Anas Karim Rivai & Rekan (AKR)**. It serves as both a comprehensive public-facing company profile and an administrative portal/dashboard.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) & [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) / GSAP / Tailwind-Animate
- **Media Storage:** [Cloudinary](https://cloudinary.com/)
- **Email Service:** [Resend](https://resend.com/) & Nodemailer

## 🛠️ Getting Started

First, install the project dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Set up your `.env` file with the required environment variables (Database URL, Supabase config, Cloudinary config, Resend API key, etc.). Then, run the Prisma migration:

```bash
npx prisma generate
npx prisma db push

# Optional: Seed the database with initial data
npm run db:seed
```

Run the local development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

- `src/app/` - Next.js App Router pages (public pages, portal, and API routes)
- `src/components/` - Reusable React components (UI components, page sections)
- `src/lib/` - Shared utility functions and global configuration
- `prisma/` - Database schema (`schema.prisma`) and seeding scripts
- `public/` - Static files and assets (images, icons)

## 🌐 Deployment

This project is configured and optimized for deployment on [Vercel](https://vercel.com/new).

<br />

<div align="center">
  <sub>Built with ❤️ for KJPP AKR</sub>
</div>
