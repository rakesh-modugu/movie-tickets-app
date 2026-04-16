import React from 'react';

const Banner = () => {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          Experience the Magic of <span className="text-red-500">Cinema</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Book tickets for the latest blockbuster movies, relax in our premium recliners, and dive into unforgettable worlds.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          Book Tickets Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
