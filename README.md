# LinkedFolio - Portfolio Builder From Resume/Linkedin

A modern portfolio builder that allows users to create professional profiles from PDF resumes using AI.

## Features

- 📄 PDF Resume Upload & Parsing
- 🤖 AI-powered Profile Generation
- 🎨 Beautiful, Customizable Profiles
- 🔗 Custom Profile URLs
- 📱 Responsive Design
- 🔐 Google OAuth Authentication
- 🚀 Real-time Profile Editing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenRouter AI (optional)
OPENROUTER_API_KEY="your-openrouter-api-key"
```

### Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to update these for production:

```bash
NEXTAUTH_URL="https://yourdomain.com"
DATABASE_URL="your-production-database-url"
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI**: OpenRouter API
- **Deployment**: Vercel

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
