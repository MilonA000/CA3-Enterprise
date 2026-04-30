# Campus Companion

A web-based Campus Companion application built with Next.js for first-year students to find campus services, events, societies, and support in one place.

## Stack
- Next.js (App Router)
- TypeScript
- Supabase (database and auth)
- Netlify (deployment)

## How to run locally

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root with the following environment variables:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build command

```bash
npm run build
```

## Deployment
This app is deployed on Netlify and connected to this GitHub repository. Every push to the `main` branch triggers an automatic deployment.

Live URL: https://enterpriseca32026.netlify.app/
