import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { LayoutDashboard, Users, FileText, Award, BarChart2, LogOut, Lock, ChevronDown } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, currentAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/admin/content', label: 'Content', icon: <FileText size={20} /> },
    { path: '/admin/challenges', label: 'Challenges', icon: <Award size={20} /> },
    { path: '/admin/statistics', label: 'Statistics', icon: <BarChart2 size={20} /> },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <div className="bg-gradient-to-r from-[var(--color-burgundy)] to-[var(--color-midnight)] p-2 rounded-md">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">FlirtPlay Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentAdmin && (
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-[var(--color-burgundy)]">
                  <span className="mr-1">{currentAdmin.username}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{currentAdmin.username}</div>
                    <div className="text-xs text-gray-500">{currentAdmin.email}</div>
                    <div className="text-xs mt-1 bg-[var(--color-burgundy)] text-white px-2 py-0.5 rounded inline-block">
                      {currentAdmin.role}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            )}
            
            <Link to="/" className="text-sm font-medium text-[var(--color-burgundy)] hover:underline">
              View App
            </Link>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-[var(--color-burgundy)] bg-opacity-10 text-[var(--color-burgundy)]' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 mt-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md transition-colors"
            >
              <LogOut size={18} className="mr-2" /> 
              Logout
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
