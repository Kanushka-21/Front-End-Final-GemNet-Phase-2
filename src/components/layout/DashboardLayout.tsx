import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Menu,
  Shield,
  ChevronDown,
  User,
  Bell,
  Home,
  Search,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks';
import Button from '@/components/ui/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Mock notifications data
  const notifications = [
    { id: 1, text: 'Your bid was accepted', time: '5 minutes ago', read: false },
    { id: 2, text: 'New gemstone listing available', time: '2 hours ago', read: false },
    { id: 3, text: 'Meeting confirmed for tomorrow', time: '1 day ago', read: true }
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickLinks = [
    { 
      label: 'Home', 
      icon: <Home className="w-5 h-5" />, 
      onClick: () => navigate('/') 
    },
    { 
      label: 'Marketplace', 
      icon: <Search className="w-5 h-5" />, 
      onClick: () => navigate('/marketplace') 
    },
    { 
      label: 'Purchases', 
      icon: <ShoppingBag className="w-5 h-5" />, 
      onClick: () => navigate('/buyer/purchases') 
    },
    { 
      label: 'Settings', 
      icon: <Settings className="w-5 h-5" />, 
      onClick: () => navigate('/settings') 
    }
  ];
  
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-secondary-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-800">GemNet</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-full text-secondary-600 hover:bg-secondary-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-full hover:bg-secondary-100 text-secondary-600"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-secondary-200 rounded-lg shadow-lg z-10"
                  >

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-secondary-600 lg:hidden mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-secondary-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserMenuOpen(false);
                  }}
                  className="relative p-2 rounded-full hover:bg-secondary-100 text-secondary-600"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-secondary-200 rounded-lg shadow-lg z-10"
                    >
                      <div className="px-4 py-2 border-b border-secondary-200">
                        <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-2 border-b border-secondary-100 hover:bg-secondary-50 ${
                                !notification.read ? 'bg-primary-50' : ''
                              }`}
                            >
                              <p className="text-sm text-secondary-800">{notification.text}</p>
                              <p className="text-xs text-secondary-500 mt-1">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-secondary-500">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-secondary-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                        >
                          Mark all as read
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2"
                >
                  <div className="bg-primary-100 rounded-full p-2">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-secondary-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-secondary-500">{user?.role || 'User'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary-500" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg z-10"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/profile');
                          }}
                          className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 w-full text-left"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/settings');
                          }}
                          className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 w-full text-left"
                        >
                          Account Settings
                        </button>
                        <div className="border-t border-secondary-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
