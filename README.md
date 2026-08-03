This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment configuration

This project uses Supabase for auth and data. No Supabase URL, key or project ID is hardcoded — everything is read from `process.env`. To switch between **production** and **development**, swap the values in your env files (see `.env.example`):

```bash
# Development — creates .env.development from the template
cp .env.example .env.development
# then edit .env.development with your dev Supabase project + anon key

# Production — values live in .env / .env.production (Vercel env vars for deploys)
```

Next.js loads `.env.local`, `.env.development`, `.env.production` and `.env` automatically based on `NODE_ENV`.

### OAuth redirect URLs (required for sign in to work)

The app builds its OAuth `redirectTo` from `window.location.origin`, so it points at `http://localhost:3000/auth/callback` in dev and your domain in prod. Supabase **only** redirects back to URLs you allowlist, otherwise it falls back to the project's Site URL (which is why local sign-in can end up on the prod domain).

For every Supabase project you use, go to **Dashboard → Authentication → URL Configuration → Redirect URLs** and add:

- `http://localhost:3000/**` (dev — adjust the port if you run on something else)
- `https://your-domain/**` (prod)

Also make sure **Google OAuth is enabled** under **Authentication → Providers** for that project, and that the Google OAuth client (in Google Cloud Console) lists `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI.

Regenerate the generated DB types against the active project with:

```bash
pnpm gentypes   # derives the project ID from NEXT_PUBLIC_SUPABASE_URL
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
