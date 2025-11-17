'use client';

import { Movie } from '@/types/movie';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={movie.image_url || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div>
          <h2 className="text-3xl font-bold mb-1">{movie.title}</h2>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm bg-primary/80 px-3 py-1 rounded-full">
              {movie.year}
            </span>
            <span className="text-sm font-semibold">★ {movie.rating}</span>
          </div>
          <p className="text-sm text-gray-100 mb-3 line-clamp-2">{movie.genre}</p>
          <p className="text-sm text-gray-200 line-clamp-3">{movie.description}</p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </div>
  );
}
