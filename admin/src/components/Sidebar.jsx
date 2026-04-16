import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, ListVideo, Ticket } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Movie', path: '/add-movie', icon: <Film size={20} /> },
    { name: 'List Movies', path: '/list-movies', icon: <ListVideo size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <Ticket size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col items-center py-8">
      <h2 className="text-2xl font-bold mb-10 tracking-widest text-red-500">ADMIN PANEL</h2>
      <nav className="flex flex-col w-full gap-2 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-md transition-colors duration-200 ${
                isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            {item.icon}
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
