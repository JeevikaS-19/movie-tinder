'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MovieCard from '@/components/movie-card';
import MatchesView from '@/components/matches-view';
import { Movie } from '@/types/movie';
import { createClient } from '@/lib/supabase/client';

export default function Page() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Movie[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initializeApp = async () => {
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser(authUser);

      try {
        const response = await fetch(`/api/movies?page=1`);
        if (!response.ok) throw new Error('Failed to fetch movies');
        
        const { movies: tmdbMovies, total_pages } = await response.json();
        setMovies(tmdbMovies);
        setTotalPages(total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setIsLoading(false);
        return;
      }

      // Fetch user's existing likes
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('tmdb_id')
        .eq('user_id', authUser.id);

      if (!likesError && likesData) {
        const likedTmdbIds = likesData.map(like => like.tmdb_id);
        const likedMovies = tmdbMovies.filter((movie: Movie) => 
          likedTmdbIds.includes((movie as any).tmdb_id)
        );
        setMatches(likedMovies);
      }

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const currentMovie = movies[currentIndex];

  const handleLike = async () => {
    if (currentMovie && user) {
      try {
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            tmdb_id: (currentMovie as any).tmdb_id,
            movie_title: currentMovie.title,
          });
        
        setMatches([...matches, currentMovie]);
      } catch (error) {
        console.error('Error saving like:', error);
      }
    }
    handleNext();
  };

  const handlePass = () => {
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentPage < totalPages) {
      loadNextPage();
    } else {
      setShowMatches(true);
    }
  };

  const loadNextPage = async () => {
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/movies?page=${nextPage}`);
      if (!response.ok) throw new Error('Failed to fetch next page');
      
      const { movies: newMovies } = await response.json();
      setMovies(newMovies);
      setCurrentPage(nextPage);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading next page:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </main>
    );
  }

  if (movies.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">MovieMingle</h1>
          <p className="text-muted-foreground">No movies available at the moment</p>
        </div>
      </main>
    );
  }

  if (showMatches) {
    return (
      <MatchesView
        matches={matches}
        onStartOver={() => {
          setShowMatches(false);
          setCurrentIndex(0);
        }}
        onLogout={handleLogout}
      />
    );
  }

  if (!currentMovie) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">MovieMingle</h1>
          <p className="text-muted-foreground text-sm">Find your next favorite film</p>
        </div>

        <div className="relative h-[600px] mb-8">
          <MovieCard movie={currentMovie} />
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={handlePass}
            className="relative group w-16 h-16 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">✕</span>
          </button>

          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">
              {currentIndex + 1} of {movies.length}
            </span>
          </div>

          <button
            onClick={handleLike}
            className="relative group w-16 h-16 rounded-full bg-accent hover:bg-accent/90 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">♥</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowMatches(true)}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            View Likes ({matches.length})
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
