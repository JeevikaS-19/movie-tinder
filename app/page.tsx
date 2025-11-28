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
  const [canUndo, setCanUndo] = useState(false);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  const fetchMovies = async (page: number, genre?: string) => {
    const response = await fetch(`/api/movies?page=${page}${genre ? `&genre=${genre}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch movies');

    const { movies: fetchedMovies, total_pages } = await response.json();
    return { fetchedMovies, total_pages };
  };

  const handleGenreChange = async (genreId: string) => {
    setSelectedGenre(genreId);
    setMovies([]);
    setCurrentIndex(0);
    setCurrentPage(1);
    setIsLoading(true);

    try {
      const { fetchedMovies, total_pages } = await fetchMovies(1, genreId);
      setMovies(fetchedMovies);
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser(authUser);

      let tmdbMovies: Movie[] = [];

      try {
        const { fetchedMovies, total_pages } = await fetchMovies(1);
        tmdbMovies = fetchedMovies;
        setMovies(tmdbMovies);
        setTotalPages(total_pages);

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
      } catch (error) {
        console.error('Error fetching movies:', error);
        setIsLoading(false);
        return;
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
      const { fetchedMovies: newMovies } = await fetchMovies(nextPage, selectedGenre);
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
          <p className="text-muted-foreground text-sm mb-4">Find your next favorite film</p>
          <select
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="px-4 py-2 bg-background border border-input rounded-md text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative h-[600px] mb-8">
          <MovieCard movie={currentMovie} />
          <button
            onClick={handlePass}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">✕</span>
          </button>
          <button
            onClick={handleLike}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-accent hover:bg-accent/90 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <span className="text-2xl">♥</span>
          </button>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">
              {currentIndex + 1} of {movies.length}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
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

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-background p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Liked Movies</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground">✕</button>
            </div>
            <div className="space-y-2">
              {matches.map((movie) => (
                <div key={movie.id} className="flex items-center space-x-2 p-2 bg-secondary rounded">
                  <img src={movie.image_url} alt={movie.title} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <p className="font-medium">{movie.title}</p>
                    <p className="text-sm text-muted-foreground">{movie.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

