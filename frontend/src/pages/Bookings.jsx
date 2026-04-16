import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { CalendarDays, Clock, MapPin, Receipt, Armchair } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) token = JSON.parse(userInfo).token;
        }

        if (!token) {
          toast.error('You need to log in to view specific bookings.');
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const { data } = await axios.get('http://localhost:5000/api/bookings', config);
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-6"></div>
        <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Validating Tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-950/20 text-red-500 border border-red-900 p-8 rounded-xl max-w-lg text-center shadow-lg">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <Receipt className="text-red-500" size={36} /> My Bookings
          </h1>
          <p className="text-slate-400 mt-2">Manage your movie tickets and past history.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center shadow-xl">
            <p className="text-slate-400 text-lg mb-6">You haven't booked any movies yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-red-600/30"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              // Parse date correctly depending on backend format
              const showDateStr = new Date(booking.showDate).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              });

              return (
                <div key={booking._id} className="flex flex-col md:flex-row bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                  
                  {/* Digital Ticket Side (QR) */}
                  <div className="w-full md:w-64 bg-slate-800/80 p-8 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-slate-700/50">
                    <div className="absolute top-0 right-0 w-6 h-6 bg-slate-950 rounded-bl-xl translate-x-[1px] -translate-y-[1px]"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-slate-950 rounded-tl-xl translate-x-[1px] translate-y-[1px]"></div>
                    
                    {booking.paymentStatus === 'paid' ? (
                      <div className="bg-white p-3 rounded-lg shadow-inner">
                        <QRCodeCanvas value={booking._id} size={130} level="H" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-slate-500 text-sm font-bold uppercase tracking-wider -rotate-12">No Ticket</span>
                      </div>
                    )}
                    
                    <p className={`mt-6 font-bold text-sm tracking-widest uppercase ${booking.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {booking.paymentStatus === 'paid' ? 'Admit Access' : 'Payment Pending'}
                    </p>
                  </div>

                  {/* Booking Details Side */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-white line-clamp-1">{booking.movie?.title || 'Unknown Movie'}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          booking.bookingStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CalendarDays size={18} className="text-slate-500" />
                          <span>{showDateStr}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock size={18} className="text-slate-500" />
                          <span>{booking.showTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin size={18} className="text-slate-500" />
                          <span>{booking.movie?.auditorium || 'Main Screen'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <span className="text-emerald-500">$</span>
                          {booking.totalAmount}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-4">
                      <div className="bg-slate-800 p-3 rounded-xl hidden sm:block">
                        <Armchair className="text-slate-400" size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Seats ({booking.seats.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.seats.map(seat => (
                            <span key={seat} className="bg-slate-800 text-white font-bold px-3 py-1 rounded border border-slate-700 shadow-sm">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
