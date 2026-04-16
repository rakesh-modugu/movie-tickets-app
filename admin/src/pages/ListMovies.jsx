import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash2, Film, Star } from 'lucide-react';

const ListMovies = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/movies');
      setMovies(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) token = JSON.parse(userInfo).token;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`http://localhost:5000/api/movies/${id}`, config);
        
        // Update UI immediately
        setMovies(movies.filter((movie) => movie._id !== id));
        toast.success('Movie deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete movie.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen bg-slate-950 font-sans">
      <ToastContainer theme="dark" position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wider text-red-500 flex items-center gap-3">
            <Film size={32} />
            Movie Library
          </h1>
          <p className="text-slate-400 mt-2">Manage all listed movies on the platform.</p>
        </div>

        {movies.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-400">
            No movies found. Add one from the "Add Movie" section.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium border-b border-slate-800 w-24">Poster</th>
                    <th className="px-6 py-4 font-medium border-b border-slate-800">Details</th>
                    <th className="px-6 py-4 font-medium border-b border-slate-800">Category</th>
                    <th className="px-6 py-4 font-medium border-b border-slate-800">Rating</th>
                    <th className="px-6 py-4 font-medium border-b border-slate-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {movies.map((movie) => (
                    <tr key={movie._id} className="hover:bg-slate-800/30 transition-colors group">
                      
                      {/* Poster Column */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-24 bg-slate-800 rounded-md overflow-hidden border border-slate-700">
                          {/* Assuming movie.poster contains the URL or path */}
                          <img 
                            src={movie.poster?.startsWith('http') ? movie.poster : `http://localhost:5000/${movie.poster}`} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150x225?text=No+Image'; }}
                          />
                        </div>
                      </td>

                      {/* Details Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-white mb-1 group-hover:text-red-400 transition-colors">{movie.title}</span>
                          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded w-max">
                            {movie.duration} mins • {movie.auditorium || 'Screen 1'}
                          </span>
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="px-6 py-4 text-slate-300">
                        {movie.category}
                      </td>

                      {/* Rating Column */}
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Star size={16} className="fill-emerald-400" />
                          {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-800 rounded-md transition-colors"
                          title="Delete Movie"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListMovies;
