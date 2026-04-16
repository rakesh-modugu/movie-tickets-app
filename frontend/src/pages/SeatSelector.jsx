import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircleCheck, Lock, Armchair, ChevronLeft } from 'lucide-react';

const SeatSelector = () => {
  const { id: movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const slot = location.state?.slot;

  const [movie, setMovie] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If no slot is provided in state, redirect back
    if (!slot) {
      toast.error('Please select a show slot first.');
      navigate(`/movies/${movieId}`);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch movie and occupied seats simultaneously
        const [movieRes, occupiedRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${movieId}`),
          axios.get(`http://localhost:5000/api/bookings/occupied`, {
            params: { movieId, showDate: slot.date, showTime: slot.time }
          })
        ]);

        setMovie(movieRes.data);
        setOccupiedSeats(occupiedRes.data.occupiedSeats || []);
        
      } catch (error) {
        toast.error('Error loading seating arrangement. Please try again.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movieId, slot, navigate]);

  const handleSeatClick = (seatId) => {
    // Prevent clicking if occupied
    if (occupiedSeats.includes(seatId)) return;

    const row = seatId.charAt(0);
    const isRecliner = ['D', 'E'].includes(row);
    const seatPrice = isRecliner ? movie.seatPrices.recliner : movie.seatPrices.standard;

    if (selectedSeats.includes(seatId)) {
      // Remove seat
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
      setTotalPrice(prev => prev - seatPrice);
    } else {
      // Add seat
      setSelectedSeats([...selectedSeats, seatId]);
      setTotalPrice(prev => prev + seatPrice);
    }
  };

  const handlePayment = async () => {
    if (selectedSeats.length === 0) return;

    let token = localStorage.getItem('token');
    if (!token) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        token = JSON.parse(userInfo).token;
      }
    }

    if (!token) {
      toast.error('You must be logged in to book tickets.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const bookingData = {
        movieId,
        showDate: slot.date,
        showTime: slot.time,
        selectedSeats
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData, config);
      
      // Redirect to Stripe Checkout URL from backend response
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initiate checkout session.');
        setIsProcessing(false);
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Try again.');
      setIsProcessing(false);
    }
  };

  // Generate Seat Grid
  const renderRow = (rowLetter, columns) => {
    let seats = [];
    for (let i = 1; i <= columns; i++) {
      const seatId = `${rowLetter}${i}`;
      const isOccupied = occupiedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      
      let baseStyle = "w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 shadow-sm ";
      
      if (isOccupied) {
        baseStyle += "bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-800 opacity-60";
      } else if (isSelected) {
        baseStyle += "bg-emerald-500 text-white shadow-emerald-500/50 scale-110 z-10";
      } else {
        baseStyle += "bg-white text-slate-800 hover:bg-red-100 hover:text-red-600";
      }

      seats.push(
        <div 
          key={seatId} 
          onClick={() => handleSeatClick(seatId)}
          className={baseStyle}
          title={isOccupied ? "Occupied" : `Row ${rowLetter} - ₹${['D','E'].includes(rowLetter) ? movie?.seatPrices?.recliner : movie?.seatPrices?.standard}`}
        >
          {i}
        </div>
      );
    }
    return (
      <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
        <span className="w-6 text-center text-slate-400 font-bold">{rowLetter}</span>
        <div className="flex gap-2 sm:gap-3">{seats}</div>
        <span className="w-6 text-center text-slate-400 font-bold">{rowLetter}</span>
      </div>
    );
  };

  if (isLoading || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
          <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Loading Seating...</p>
        </div>
      </div>
    );
  }

  const slotDateStr = new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-32">
      <ToastContainer theme="dark" position="top-right" />
      
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{movie.title}</h1>
              <p className="text-sm text-slate-400">{slotDateStr} • {slot.time} {slot.ampm} • {movie.auditorium}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Screen Graphic */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80 blur-[1px]"></div>
          <div className="w-full h-12 border-t-4 border-slate-700 rounded-t-[50%] flex items-start justify-center pt-2 shadow-[0_-10px_20px_rgba(255,255,255,0.02)]">
            <span className="text-slate-500 text-sm tracking-widest uppercase">Screen This Way</span>
          </div>
        </div>

        {/* Seating Layout */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-fit mx-auto select-none">
            
            {/* Standard Seats */}
            <div className="mb-8 relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 -translate-x-full text-xs text-slate-500 uppercase tracking-widest hidden md:block rotate-180" style={{ writingMode: 'vertical-rl' }}>
                Standard - ₹{movie.seatPrices.standard}
              </div>
              {renderRow('A', 10)}
              {renderRow('B', 10)}
              {renderRow('C', 10)}
            </div>

            {/* Path divider */}
            <div className="w-full border-t border-slate-800/50 my-6"></div>

            {/* Recliner Seats */}
            <div className="mb-4 relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 -translate-x-full text-xs text-slate-500 uppercase tracking-widest hidden md:block rotate-180" style={{ writingMode: 'vertical-rl' }}>
                Premium - ₹{movie.seatPrices.recliner}
              </div>
              {renderRow('D', 10)}
              {renderRow('E', 10)}
            </div>

          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-6 mt-12 pt-6 border-t border-slate-800/50 text-sm pb-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-t-md rounded-b-sm border border-slate-300"></div>
            <span className="text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-t-md rounded-b-sm shadow-sm"></div>
            <span className="text-slate-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-700 rounded-t-md rounded-b-sm border border-slate-800 flex items-center justify-center">
              <Lock size={12} className="text-slate-500" />
            </div>
            <span className="text-slate-400">Sold</span>
          </div>
        </div>

      </div>

      {/* Floating Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40 transform transition-transform duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="bg-slate-800 p-3 rounded-xl hidden sm:block">
              <Armchair className="text-emerald-400" size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Selected Seats ({selectedSeats.length})</p>
              <div className="flex gap-2 flex-wrap max-h-16 overflow-y-auto w-full max-w-[300px]">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(s => (
                    <span key={s} className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-sm font-bold border border-emerald-500/30">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm italic">No seats selected</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 shrink-0 border-t border-slate-800 pt-4 sm:border-0 sm:pt-0">
            <div className="text-left sm:text-right">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-white flex items-center">
                <span className="text-red-500 mr-1">$</span>{totalPrice}
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={selectedSeats.length === 0 || isProcessing}
              className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all ${
                selectedSeats.length === 0 || isProcessing 
                  ? 'opacity-50 cursor-not-allowed bg-slate-700 hover:bg-slate-700 shadow-none' 
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Pay'}
              {!isProcessing && <CircleCheck size={20} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
