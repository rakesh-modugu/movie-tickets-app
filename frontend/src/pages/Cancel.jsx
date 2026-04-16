import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans border-t-4 border-red-600">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl text-center shadow-red-900/10">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full">
            <AlertTriangle size={64} className="text-red-500 stroke-[1.5]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Payment Cancelled</h1>
        <p className="text-slate-400 mb-10 text-lg leading-relaxed">
          Your transaction was not completed. Don't worry, no charges were processed and your seats are still waiting!
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white text-slate-950 hover:bg-slate-200 font-bold py-4 rounded-xl transition-all duration-300 shadow-md shadow-white/10 hover:shadow-white/20"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default Cancel;
