import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Package, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Settings,
  FileText,
  CreditCard,
  TrendingUp,
  Star,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface SidebarNavigationProps {
  collapsed: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed }) => {
  const { user } = useAuth();
  // Generate role-based navigation items
  const getNavItems = (): NavItem[] => {
    // Common items for all roles
    const baseItems: NavItem[] = [
      { 
        path: '/dashboard', 
        label: 'Dashboard', 
        icon: <Home className="w-5 h-5" />,
        description: 'Main dashboard'
      },
      { 
        path: '/profile', 
        label: 'My Profile', 
        icon: <User className="w-5 h-5" />,
        description: 'Manage your account'
      },
      { 
        path: '/settings', 
        label: 'Settings', 
        icon: <Settings className="w-5 h-5" />,
        description: 'Account settings'
      }
    ];
    
    // Role-specific items
    const roleBasedItems: Record<string, NavItem[]> = {
      admin: [
        { 
          path: '/admin/users', 
          label: 'Users', 
          icon: <Users className="w-5 h-5" />,
          description: 'Manage all users'
        },
        { 
          path: '/admin/transactions', 
          label: 'Transactions', 
          icon: <CreditCard className="w-5 h-5" />,
          description: 'View all transactions'
        },
        { 
          path: '/admin/approvals', 
          label: 'Approvals', 
          icon: <FileText className="w-5 h-5" />,
          description: 'Review pending items'
        },
        { 
          path: '/admin/reports', 
          label: 'Reports', 
          icon: <TrendingUp className="w-5 h-5" />,
          description: 'System analytics'
        }
      ],
      seller: [
        { 
          path: '/seller/listings', 
          label: 'My Listings', 
          icon: <Package className="w-5 h-5" />,
          description: 'Manage your gemstones'
        },
        { 
          path: '/seller/add-listing', 
          label: 'Add Listing', 
          icon: <FileText className="w-5 h-5" />,
          description: 'Create new listing'
        },
        { 
          path: '/seller/bids', 
          label: 'Bids', 
          icon: <TrendingUp className="w-5 h-5" />,
          description: 'Received bids'
        },
        { 
          path: '/seller/meetings', 
          label: 'Meetings', 
          icon: <Calendar className="w-5 h-5" />,
          description: 'Scheduled meetings'
        },
        { 
          path: '/seller/revenue', 
          label: 'Revenue', 
          icon: <CreditCard className="w-5 h-5" />,
          description: 'Sales & earnings'
        }
      ],
      buyer: [
        { 
          path: '/marketplace', 
          label: 'Marketplace', 
          icon: <Search className="w-5 h-5" />,
          description: 'Find gemstones' 
        },
        { 
          path: '/buyer/bids', 
          label: 'My Bids', 
          icon: <TrendingUp className="w-5 h-5" />,
          description: 'Your active bids'
        },
        { 
          path: '/buyer/meetings', 
          label: 'Meetings', 
          icon: <Calendar className="w-5 h-5" />,
          description: 'Your meetings'
        },
        { 
          path: '/buyer/favorites', 
          label: 'Wishlist', 
          icon: <Star className="w-5 h-5" />,
          description: 'Saved items'
        },
        { 
          path: '/buyer/purchases', 
          label: 'Purchases', 
          icon: <ShoppingBag className="w-5 h-5" />,
          description: 'Purchase history'
        }
      ]
    };
    
    // Return items based on user role
    switch (user?.role) {
      case 'admin':
        return [...baseItems, ...roleBasedItems.admin];
      case 'seller':
        return [...baseItems, ...roleBasedItems.seller];
      default: // buyer or guest
        return [...baseItems, ...roleBasedItems.buyer];
    }
  };
  
  const navItems = getNavItems();

  return (
    <nav className="mt-6 px-3">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => 
            `flex items-center py-3 px-3 rounded-lg my-1 transition-colors ${
              isActive 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <div className="flex items-center">
            <div className="mr-3">
              {item.icon}
            </div>
            {!collapsed && (
              <div>
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNavigation;
