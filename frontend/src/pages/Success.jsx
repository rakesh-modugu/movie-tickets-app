import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found in the URL. If you paid successfully, check your bookings tab.');
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) token = JSON.parse(userInfo).token;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        await axios.get(`http://localhost:5000/api/bookings/verify?sessionId=${sessionId}`, config);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. Please contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const Spinner = () => (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-6"></div>
      <p className="text-slate-300 font-medium tracking-wide">Confirming your transaction...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
        {isLoading && <Spinner />}

        {!isLoading && success && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <CheckCircle2 size={80} className="text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-slate-400 mb-8 text-lg">
              Your tickets are officially confirmed. Grab some popcorn and enjoy the show!
            </p>
            <button
              onClick={() => navigate('/bookings')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/50"
            >
              View My Tickets
            </button>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center">
            <XCircle size={80} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h1 className="text-3xl font-bold text-white mb-4">Payment Verification Failed</h1>
            <p className="text-slate-400 mb-8 bg-slate-800 p-4 rounded-lg">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-xl transition-all"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
