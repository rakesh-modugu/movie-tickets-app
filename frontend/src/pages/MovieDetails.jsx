import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Clock, Star, Film, CalendarDays } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch movie details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleSelectSeats = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot first');
      return;
    }
    navigate(`/movies/${id}/seat-selector`, { state: { slot: selectedSlot } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
          <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="bg-red-950/20 border border-red-900 text-red-400 p-8 rounded-xl max-w-lg text-center">
          <p className="font-medium text-lg mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  // Format Poster URL
  const posterUrl = movie.poster?.startsWith('http') 
    ? movie.poster 
    : `http://localhost:5000/${movie.poster}`;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        
        {/* --- Top Section: Poster & Details --- */}
        <div className="flex flex-col md:flex-row gap-10 bg-slate-900 p-6 md:p-10 rounded-2xl shadow-xl border border-slate-800 mb-12">
          
          {/* Poster */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster+Available'; }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-red-600/10 text-red-500 font-semibold px-3 py-1 rounded-full text-sm border border-red-500/20 uppercase tracking-wide">
                {movie.category}
              </span>
              <span className="bg-slate-800 text-slate-300 font-semibold px-3 py-1 rounded-full text-sm uppercase flex items-center gap-1 border border-slate-700">
                <Clock size={14} /> {movie.duration} mins
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              {movie.title}
            </h1>

            <div className="flex items-center gap-2 mb-8 text-lg font-medium text-emerald-400">
              <Star className="fill-emerald-400" size={24} />
              <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'} / 10</span>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Film size={20} className="text-red-500" /> Storyline
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg opacity-90">
                {movie.story}
              </p>
            </div>
          </div>
        </div>

        {/* --- Middle Section: Cast --- */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-red-600">Cast & Crew</h3>
            <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide scroll-smooth py-2 px-2">
              {movie.cast.map((member, index) => {
                const imgUrl = member.imageUrl?.startsWith('http')
                  ? member.imageUrl
                  : `http://localhost:5000/${member.imageUrl}`;

                return (
                  <div key={index} className="flex flex-col items-center min-w-[120px] group">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-slate-700 group-hover:border-red-500 transition-colors shadow-lg">
                      <img 
                        src={imgUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                      />
                    </div>
                    <span className="font-semibold text-white text-center text-sm mb-1">{member.name}</span>
                    <span className="text-xs text-slate-400 text-center">{member.role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Bottom Section: Slots & Action --- */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CalendarDays size={24} className="text-red-500" /> Available Shows
          </h3>
          
          {movie.slots && movie.slots.length > 0 ? (
            <div className="flex flex-wrap gap-4 mb-10">
              {movie.slots.map((slot, index) => {
                // Ensure date formatting parses correctly depending on backend output
                const slotDate = new Date(slot.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                const isSelected = selectedSlot === slot._id || JSON.stringify(selectedSlot) === JSON.stringify(slot);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex flex-col items-center justify-center py-3 px-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      isSelected 
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold mb-1 opacity-80 uppercase tracking-widest">{slotDate}</span>
                    <span className="text-lg font-bold">{slot.time} {slot.ampm}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-slate-400 mb-8 p-4 bg-slate-800 rounded-lg">No shows are currently scheduled for this movie.</p>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-800">
            <button
              onClick={handleSelectSeats}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 px-12 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Seats
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetails;
