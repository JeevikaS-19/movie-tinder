-- Update likes table to track TMDB IDs instead of database movie IDs
ALTER TABLE public.likes DROP COLUMN IF EXISTS movie_id;
ALTER TABLE public.likes ADD COLUMN tmdb_id INTEGER NOT NULL;
ALTER TABLE public.likes ADD COLUMN movie_title TEXT;
ALTER TABLE public.likes ADD CONSTRAINT unique_tmdb_like UNIQUE(user_id, tmdb_id);
