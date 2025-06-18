import React from 'react';
import { useAuth } from '@/hooks';
import BuyerDashboard from './dashboard/BuyerDashboard';
import SellerDashboard from './dashboard/SellerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'seller':
      return <SellerDashboard />;
    case 'buyer':
    default:
      return <BuyerDashboard />;
  }
};

export default DashboardPage;
