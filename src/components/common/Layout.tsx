import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, Trophy, MessageCircle, Users, User, Settings } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Layout: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/inner-game', label: 'Inner Game', icon: <BookOpen size={20} /> },
    { path: '/play', label: 'Play', icon: <Gamepad2 size={20} /> },
    { path: '/challenges', label: 'Challenges', icon: <Trophy size={20} /> },
    { path: '/ai-coach', label: 'AI Coach', icon: <MessageCircle size={20} /> },
    { path: '/community', label: 'Community', icon: <Users size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="app-container bg-gray-50">
      <div className="min-h-screen pb-20">
        <main className="p-4 max-w-6xl mx-auto">
          <div className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Admin link - hidden but accessible */}
      <Link 
        to="/admin" 
        className="fixed top-2 right-2 opacity-30 hover:opacity-100 p-1 bg-gray-800 text-white rounded-full"
        title="Admin Panel"
      >
        <Settings size={16} />
      </Link>
      
      {/* Mobile-like bottom navigation - now scrollable */}
      <nav className="mobile-tabs max-w-full mx-auto overflow-x-auto hide-scrollbar">
        <div className="flex w-full min-w-max px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 text-xs flex-shrink-0 ${
                location.pathname === item.path 
                  ? 'text-[var(--color-burgundy)] font-medium' 
                  : 'text-gray-500'
              }`}
            >
              <div className={`p-1 rounded-full ${location.pathname === item.path ? 'bg-[var(--color-burgundy)] bg-opacity-10' : ''}`}>
                {item.icon}
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
