# MovieMingle

A Tinder-style movie discovery app built with Next.js, React, TypeScript, and Supabase.

## Features

- Swipe through popular movies from TMDB
- Like and save your favorite movies
- View all your liked movies
- User authentication with Supabase
- Real-time data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase project
- A TMDB API key

### Environment Setup

1. Clone this repository
2. Copy `.env.local.example` to `.env.local`
3. Fill in your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `TMDB_API_KEY` - Your TMDB API key from [TMDB](https://www.themoviedb.org/settings/api)

### Installation

\`\`\`bash
npm install
\`\`\`

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Database Setup

The app uses Supabase with two main tables:

### `movies` table (optional, for caching)
- Stores movie data with TMDB IDs
- Can be pre-populated for faster loads

### `likes` table (required)
- `id`: UUID primary key
- `user_id`: References authenticated user
- `tmdb_id`: TMDB movie ID
- `movie_title`: Movie title for reference
- `created_at`: Timestamp

Run the migration scripts if needed:
\`\`\`sql
-- Create likes table
CREATE TABLE likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  tmdb_id integer not null,
  movie_title text not null,
  created_at timestamp default now(),
  unique(user_id, tmdb_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own likes
CREATE POLICY "Users can view their own likes" 
  ON likes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own likes
CREATE POLICY "Users can insert their own likes" 
  ON likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own likes
CREATE POLICY "Users can delete their own likes" 
  ON likes 
  FOR DELETE 
  USING (auth.uid() = user_id);
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TMDB_API_KEY`
4. Deploy!

### Deploy to Other Platforms

Ensure your hosting platform supports:
- Node.js 18+
- Environment variables
- Serverless functions (for API routes)

Set the required environment variables and run:
\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
movie-mingle/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main app page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── movie-card.tsx    # Movie card component
│   └── matches-view.tsx  # Matches display component
├── lib/
│   └── supabase/         # Supabase utilities
├── types/
│   └── movie.ts          # TypeScript types
├── public/               # Static assets
├── middleware.ts         # Auth middleware
├── next.config.mjs       # Next.js configuration
└── package.json          # Dependencies
\`\`\`

## Technologies

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Movie Data**: TMDB API
- **Analytics**: Vercel Analytics

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
