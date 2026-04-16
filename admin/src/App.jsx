import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddMovie from './pages/AddMovie';
import ListMovies from './pages/ListMovies';
import Bookings from './pages/Bookings';

const App = () => {
  return (
    <Router>
      <div className="flex bg-gray-950 min-h-screen font-sans">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/list-movies" element={<ListMovies />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
