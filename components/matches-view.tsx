'use client';

import { Movie } from '@/types/movie';
import Image from 'next/image';

interface MatchesViewProps {
  matches: Movie[];
  onStartOver: () => void;
  onLogout?: () => void;
}

export default function MatchesView({ matches, onStartOver, onLogout }: MatchesViewProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Your Likes</h1>
          <p className="text-muted-foreground">
            {matches.length} movie{matches.length !== 1 ? 's' : ''} to watch
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold mb-2">No matches yet!</h2>
            <p className="text-muted-foreground mb-6">
              Start swiping to find movies you love
            </p>
            <button
              onClick={onStartOver}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 mb-8">
              {matches.map((movie) => (
                <div
                  key={movie.id}
                  className="flex gap-4 bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-24 h-32 flex-shrink-0">
                    <Image
                      src={movie.image_url || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {movie.year} • {movie.genre}
                      </p>
                      <p className="text-sm line-clamp-2">{movie.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">★ {movie.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={onStartOver}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Keep Swiping
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
