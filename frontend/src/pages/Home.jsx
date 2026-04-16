import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner from '../components/Banner';
import MovieCard from '../components/MovieCard';
import { Film } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/movies');
        setMovies(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch movies from the server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      {/* Hero Banner Section */}
      <Banner />

      {/* Movies Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-red-600/10 p-3 rounded-lg border border-red-500/20">
            <Film className="text-red-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-wide">Featured Movies</h2>
            <p className="text-slate-400 text-sm mt-1">Discover what's playing in theatres right now</p>
          </div>
        </div>

        {/* Dynamic Content Rendering */}
        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
             <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Loading Movies...</p>
           </div>
        ) : error ? (
           <div className="bg-red-950/20 border border-red-900 text-red-400 p-6 rounded-xl flex items-center justify-center">
             <p className="font-medium text-lg">{error}</p>
           </div>
        ) : movies.length === 0 ? (
           <div className="bg-slate-900 border border-slate-800 p-12 rounded-xl text-center">
             <p className="text-slate-400 text-lg">No movies are currently available. Please check back later!</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {movies.map((movie) => (
               <MovieCard key={movie._id} movie={movie} />
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default Home;
