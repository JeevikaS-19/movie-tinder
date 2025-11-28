import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      );
    }

    const page = request.nextUrl.searchParams.get('page') || '1';
    const genre = request.nextUrl.searchParams.get('genre');

    const url = genre
      ? `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_genres=${genre}&sort_by=popularity.desc`
      : `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`;

    const response = await fetch(url, { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    const movies = data.results
      .filter((movie: any) => movie.poster_path) // Only include movies with posters
      .map((movie: any) => ({
        id: `tmdb_${movie.id}`,
        title: movie.title,
        year: new Date(movie.release_date).getFullYear(),
        rating: Math.round(movie.vote_average * 10) / 10,
        genre: 'Movie', // TMDB requires separate genre API call, using placeholder
        description: movie.overview,
        image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        tmdb_id: movie.id,
      }));

    return NextResponse.json({
      movies,
      total_pages: data.total_pages,
      current_page: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies from TMDB' },
      { status: 500 }
    );
  }
}
