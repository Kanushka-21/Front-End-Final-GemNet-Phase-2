import React from 'react';
import { useAuth } from '@/hooks';
import BuyerDashboard from './dashboard/BuyerDashboard';
import SellerDashboard from './dashboard/SellerDashboard';
import AdminDashboard from './dashboard/AdminDashboard.simplified';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
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

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
};

export default DashboardPage;
