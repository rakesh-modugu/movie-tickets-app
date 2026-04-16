import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
  // Handle poster URL logic
  const posterUrl = movie.poster?.startsWith('http') 
    ? movie.poster 
    : `http://localhost:5000/${movie.poster}`;

  return (
    <Link 
      to={`/movies/${movie._id}`} 
      className="group flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/10"
    >
      {/* Poster Container */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-800">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster+Available'; }}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-red-600 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
            <Play className="text-white fill-current" size={24} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-sm text-slate-400 mb-3 line-clamp-1">
            {movie.category}
          </p>
        </div>
        
        {/* Bottom Specs */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded">
            {movie.duration} mins
          </span>
          <span className="text-red-400 bg-red-950/30 px-2 py-1 rounded border border-red-900/50">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
