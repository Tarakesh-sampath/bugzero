# BugZero Server

Node.js Express project with TypeScript and Prisma (PostgreSQL).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and update the `DATABASE_URL`.
   ```bash
   cp .env.example .env
   ```

3. Initialize the database:
   ```bash
   npx prisma db push
   ```
   (Or run migrations if you have existing migrations: `npx prisma migrate dev`)

4. Run the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Start development server with hot-reload (using `tsx`).
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start`: Run the compiled project.
- `npm run lint`: Run type checking.
