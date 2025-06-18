import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, Modal, 
  message, Tabs, List, Avatar, Badge, Switch,
  Calendar, Alert, Descriptions, Space, Form,
  Input, Select, DatePicker, TimePicker, notification, InputNumber
} from 'antd';
import { 
  UserOutlined, DollarOutlined, CalendarOutlined,
  EyeOutlined, CheckOutlined, EditOutlined,
  CloseOutlined, WarningOutlined, 
  SettingOutlined, BellOutlined, FileTextOutlined,
  TeamOutlined, ShopOutlined, PercentageOutlined,
  LockOutlined, UnlockOutlined, ScheduleOutlined,
  PlusOutlined, SearchOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { api } from '@/services/api';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  pendingVerifications: number;
  scheduledMeetings: number;
  commissionsCollected: number;
  systemAlerts: number;
  pendingApprovals: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  isVerified: boolean;
  verificationStatus: string;
  registrationDate: string;
  lastLogin: string;
  status: 'active' | 'suspended' | 'pending' | 'blocked';
  phoneNumber?: string;
  address?: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'canceled';
  date: string;
  buyer: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    name: string;
  };
  gemstone: {
    id: string;
    name: string;
  };
  commission: number;
  commissionPercentage: number;
  commissionAmount: number;
  paymentMethod: string;
}

interface Meeting {
  id: string;
  buyerId: string;
  sellerId: string;
  gemstoneId: string;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: 'scheduled' | 'completed' | 'canceled';
  notes: string;
  buyerName: string;
  sellerName: string;
  gemstoneName: string;
}

interface CommissionSetting {
  id: string;
  percentage: number;
  minAmount: number;
  maxAmount: number | null;
  gemType: string;
  effectiveDate: string;
  status: 'active' | 'inactive';
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  date: string;
  isRead: boolean;
}

interface Advertisement {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  budget: number;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  submissionDate: string;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<User[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    scheduledMeetings: 0,
    commissionsCollected: 0,
    systemAlerts: 0,
    pendingApprovals: 0
  });
  // Data states
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSetting[]>([]);
  
  // Modal states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [scheduleMeetingModalVisible, setScheduleMeetingModalVisible] = useState(false);
  const [commissionModalVisible, setCommissionModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Form states
  const [meetingForm] = Form.useForm();
  const [commissionForm] = Form.useForm();

  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Simulate API calls with mock data
      const mockUsers: User[] = [
        {
          id: 'u1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'buyer',
          isVerified: true,
          verificationStatus: 'verified',
          registrationDate: '2025-03-15',
          lastLogin: '2025-06-17',
          status: 'active',
          phoneNumber: '+94771234567',
          address: 'Colombo, Sri Lanka'
        },
        {
          id: 'u2',
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'sarah@example.com',
          role: 'seller',
          isVerified: true,
          verificationStatus: 'verified',
          registrationDate: '2025-02-10',
          lastLogin: '2025-06-16',
          status: 'active',
          phoneNumber: '+94772345678',
          address: 'Kandy, Sri Lanka'
        },
        {
          id: 'u3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@example.com',
          role: 'seller',
          isVerified: false,
          verificationStatus: 'pending',
          registrationDate: '2025-06-10',
          lastLogin: '2025-06-10',
          status: 'pending',
          phoneNumber: '+94773456789',
          address: 'Galle, Sri Lanka'
        },
        {
          id: 'u4',
          firstName: 'Emily',
          lastName: 'Brown',
          email: 'emily@example.com',
          role: 'buyer',
          isVerified: true,
          verificationStatus: 'verified',
          registrationDate: '2025-01-20',
          lastLogin: '2025-06-15',
          status: 'active',
          phoneNumber: '+94774567890',
          address: 'Negombo, Sri Lanka'
        },
        {
          id: 'u5',
          firstName: 'David',
          lastName: 'Wilson',
          email: 'david@example.com',
          role: 'buyer',
          isVerified: false,
          verificationStatus: 'rejected',
          registrationDate: '2025-06-01',
          lastLogin: '2025-06-01',
          status: 'blocked',
          phoneNumber: '+94775678901',
          address: 'Jaffna, Sri Lanka'
        }
      ];
      
      const mockTransactions: Transaction[] = [
        {
          id: 't1',
          amount: 2500,
          status: 'completed',
          date: '2025-06-15',
          buyer: {
            id: 'u1',
            name: 'John Doe'
          },
          seller: {
            id: 'u2',
            name: 'Sarah Smith'
          },
          gemstone: {
            id: 'g1',
            name: 'Blue Sapphire'
          },
          commission: 250,
          commissionPercentage: 10,
          commissionAmount: 250,
          paymentMethod: 'credit_card'
        },
        {
          id: 't2',
          amount: 5000,
          status: 'pending',
          date: '2025-06-16',
          buyer: {
            id: 'u4',
            name: 'Emily Brown'
          },
          seller: {
            id: 'u2',
            name: 'Sarah Smith'
          },
          gemstone: {
            id: 'g2',
            name: 'Ruby'
          },
          commission: 500,
          commissionPercentage: 10,
          commissionAmount: 500,
          paymentMethod: 'bank_transfer'
        },
        {
          id: 't3',
          amount: 1800,
          status: 'failed',
          date: '2025-06-14',
          buyer: {
            id: 'u1',
            name: 'John Doe'
          },
          seller: {
            id: 'u3',
            name: 'Mike Johnson'
          },
          gemstone: {
            id: 'g3',
            name: 'Emerald'
          },
          commission: 180,
          commissionPercentage: 10,
          commissionAmount: 180,
          paymentMethod: 'credit_card'
        }
      ];
      
      const mockMeetings: Meeting[] = [
        {
          id: 'm1',
          buyerId: 'u1',
          sellerId: 'u2',
          gemstoneId: 'g1',
          scheduledDate: '2025-06-20',
          scheduledTime: '10:00',
          location: 'GemNet Office, Colombo',
          status: 'scheduled',
          notes: 'First meeting for Blue Sapphire inspection',
          buyerName: 'John Doe',
          sellerName: 'Sarah Smith',
          gemstoneName: 'Blue Sapphire'
        },
        {
          id: 'm2',
          buyerId: 'u4',
          sellerId: 'u2',
          gemstoneId: 'g2',
          scheduledDate: '2025-06-21',
          scheduledTime: '14:00',
          location: 'GemNet Office, Colombo',
          status: 'scheduled',
          notes: 'Ruby inspection and verification',
          buyerName: 'Emily Brown',
          sellerName: 'Sarah Smith',
          gemstoneName: 'Ruby'
        },
        {
          id: 'm3',
          buyerId: 'u1',
          sellerId: 'u3',
          gemstoneId: 'g3',
          scheduledDate: '2025-06-18',
          scheduledTime: '11:30',
          location: 'GemNet Office, Colombo',
          status: 'completed',
          notes: 'Emerald inspection completed',
          buyerName: 'John Doe',
          sellerName: 'Mike Johnson',
          gemstoneName: 'Emerald'
        }
      ];
      
      const mockCommissionSettings: CommissionSetting[] = [
        {
          id: 'cs1',
          percentage: 10,
          minAmount: 0,
          maxAmount: 5000,
          gemType: 'All',
          effectiveDate: '2025-01-01',
          status: 'active'
        },
        {
          id: 'cs2',
          percentage: 8,
          minAmount: 5001,
          maxAmount: 10000,
          gemType: 'All',
          effectiveDate: '2025-01-01',
          status: 'active'
        },
        {
          id: 'cs3',
          percentage: 5,
          minAmount: 10001,
          maxAmount: null,
          gemType: 'All',
          effectiveDate: '2025-01-01',
          status: 'active'
        }
      ];
      
      const mockAlerts: Alert[] = [
        {
          id: 'a1',
          type: 'warning',
          message: 'High volume of pending verification requests',
          date: '2025-06-17T10:30:00',
          isRead: false
        },
        {
          id: 'a2',
          type: 'error',
          message: 'Payment gateway service disruption',
          date: '2025-06-17T08:15:00',
          isRead: false
        },
        {
          id: 'a3',
          type: 'info',
          message: 'System update scheduled for tonight',
          date: '2025-06-16T14:45:00',
          isRead: true
        }
      ];

      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update state with mock data
      setUsers(mockUsers);
      setTransactions(mockTransactions);
      setMeetings(mockMeetings);
      setCommissionSettings(mockCommissionSettings);
      setPendingVerifications(mockUsers.filter(u => u.verificationStatus === 'pending'));
      setSystemAlerts(mockAlerts);
      
      // Update stats
      setStats({
        totalUsers: mockUsers.length,
        totalTransactions: mockTransactions.length,
        totalRevenue: mockTransactions.reduce((sum, t) => sum + t.amount, 0),
        pendingVerifications: mockUsers.filter(u => u.verificationStatus === 'pending').length,
        scheduledMeetings: mockMeetings.filter(m => m.status === 'scheduled').length,
        commissionsCollected: mockTransactions.reduce((sum, t) => sum + t.commission, 0),
        systemAlerts: mockAlerts.filter(a => !a.isRead).length,
        pendingApprovals: 3
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'block' | 'unblock' | 'delete') => {
    try {
      // API call would go here
      message.success(`User ${action} action successful`);
      fetchDashboardData();
    } catch (error) {
      message.error(`Failed to ${action} user`);
    }
  };

  const handleAdAction = async (adId: string, action: 'approve' | 'reject') => {
    try {
      // API call would go here
      message.success(`Advertisement ${action}ed successfully`);
      fetchDashboardData();
    } catch (error) {
      message.error(`Failed to ${action} advertisement`);
    }
  };

  const handleVerifyUser = async (userId: string, approved: boolean) => {
    try {
      // API call would go here
      if (approved) {
        message.success('User verification approved');
      } else {
        message.error('User verification rejected');
      }
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to process verification');
    }
  };

  // Schedule meeting between buyer and seller
  const handleScheduleMeeting = () => {
    meetingForm.validateFields().then(async (values) => {
      try {
        // API call would go here
        message.success('Meeting scheduled successfully');
        setScheduleMeetingModalVisible(false);
        meetingForm.resetFields();
        fetchDashboardData();
      } catch (error) {
        message.error('Failed to schedule meeting');
      }
    });
  };
  
  // Update commission setting
  const handleUpdateCommission = () => {
    commissionForm.validateFields().then(async (values) => {
      try {
        // API call would go here
        message.success('Commission setting updated successfully');
        setCommissionModalVisible(false);
        commissionForm.resetFields();
        fetchDashboardData();
      } catch (error) {
        message.error('Failed to update commission setting');
      }
    });
  };

  // Handle system alert dismissal
  const handleDismissAlert = async (alertId: string) => {
    try {
      // API call would go here
      message.success('Alert dismissed');
      setSystemAlerts(prevAlerts => 
        prevAlerts.filter(alert => alert.id !== alertId)
      );
      
      setStats(prevStats => ({
        ...prevStats,
        systemAlerts: prevStats.systemAlerts - 1
      }));
    } catch (error) {
      message.error('Failed to dismiss alert');
    }
  };

  // View meeting details
  const showMeetingDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setMeetingModalVisible(true);
  };

  const userColumns: ColumnsType<User> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div className="font-semibold">{record.firstName} {record.lastName}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: 'buyer' | 'seller' | 'admin') => {
        const colors: Record<string, string> = { buyer: 'blue', seller: 'green', admin: 'red' };
        return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const statusColors = {
          active: 'green',
          suspended: 'red',
          pending: 'orange',
          blocked: 'red'
        };
        
        const color = statusColors[record.status as keyof typeof statusColors] || 'default';
        
        return (
          <Tag color={color}>
            {record.status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Joined',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedUser(record);
              setUserModalVisible(true);
            }}
          />
          
          {record.status === 'pending' && (
            <Button 
              type="text" 
              icon={<CheckOutlined className="text-green-500" />} 
              onClick={() => handleUserAction(record.id, 'approve')}
            />
          )}
          
          {record.status === 'active' && (
            <Button 
              type="text" 
              icon={<LockOutlined className="text-red-500" />} 
              onClick={() => handleUserAction(record.id, 'block')}
            />
          )}
          
          {record.status === 'suspended' && (
            <Button 
              type="text" 
              icon={<UnlockOutlined className="text-green-500" />} 
              onClick={() => handleUserAction(record.id, 'unblock')}
            />
          )}
        </Space>
      ),
    },
  ];

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id.slice(-6)}`,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
      render: (commission) => `$${commission.toLocaleString()}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'completed' | 'pending' | 'failed' | 'canceled') => {
        const colors: Record<string, string> = { 
          completed: 'green', 
          pending: 'orange', 
          failed: 'red',
          canceled: 'red'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            // View transaction details
            message.info(`Viewing transaction #${record.id.slice(-6)}`);
          }}
        />
      ),
    },
  ];

  const adColumns: ColumnsType<Advertisement> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget) => `$${budget.toLocaleString()}`,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} days`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired') => {
        const colors: Record<string, string> = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red',
          active: 'blue',
          expired: 'gray'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              // View ad details
              message.info(`Viewing advertisement: ${record.title}`);
            }}
          />
          
          {record.status === 'pending' && (
            <Space>
              <Button
                type="text"
                icon={<CheckOutlined className="text-green-500" />}
                onClick={() => handleAdAction(record.id, 'approve')}
              />
              <Button
                type="text"
                icon={<CloseOutlined className="text-red-500" />}
                onClick={() => handleAdAction(record.id, 'reject')}
              />
            </Space>
          )}
        </Space>
      ),
    },
  ];

  const dashboardStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <UserOutlined className="text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      prefix: '$',
      icon: <DollarOutlined className="text-green-500" />,
      color: 'green'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: <WarningOutlined className="text-orange-500" />,
      color: 'orange'
    },
    {
      title: 'System Alerts',
      value: stats.systemAlerts,      icon: <BellOutlined className="text-red-500" />,
      color: 'red'
    }
  ];

  // Render function for the dashboard
  return (
    <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Monitor system metrics, manage users, and track transactions
              </p>
            </div>
            <div className="hidden md:flex space-x-2">
              <Button type="primary" icon={<UserOutlined />}>
                User Management
              </Button>
              <Button type="default" icon={<SettingOutlined />}>
                System Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          {dashboardStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                hoverable 
                className="transition-all duration-300 hover:shadow-lg border-t-4"
                style={{ borderTopColor: `var(--ant-${stat.color}-6)` }}
              >
                <div className="flex items-center justify-between">
                  <Statistic
                    title={<span className="text-base font-medium">{stat.title}</span>}
                    value={stat.value}
                    valueStyle={{ 
                      color: `var(--ant-${stat.color}-6)`,
                      fontSize: '2rem',
                      fontWeight: 'bold' 
                    }}
                    prefix={stat.prefix}
                  />
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}-50`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* System Alerts Section */}
        <div className="mb-6">
          <Card 
            title={
              <div className="flex items-center">
                <BellOutlined className="mr-2 text-red-500" />
                <span>System Alerts</span>
                <Badge count={systemAlerts.length} className="ml-2" />
              </div>
            }
            className="shadow-sm rounded-xl overflow-hidden"
          >
            <List
              itemLayout="horizontal"
              dataSource={systemAlerts}
              renderItem={(alert) => (
                <List.Item
                  key={alert.id}
                  actions={[
                    <Button 
                      key="dismiss" 
                      type="text" 
                      icon={<CloseOutlined />} 
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          alert.type === 'warning' ? <WarningOutlined /> : 
                          alert.type === 'error' ? <CloseOutlined /> :
                          <BellOutlined />
                        } 
                        style={{ 
                          backgroundColor: 
                            alert.type === 'warning' ? '#faad14' : 
                            alert.type === 'error' ? '#ff4d4f' : 
                            alert.type === 'success' ? '#52c41a' : 
                            '#1890ff' 
                        }}
                      />
                    }
                    title={<span className={`${!alert.isRead ? 'font-bold' : ''}`}>{alert.message}</span>}
                    description={dayjs(alert.date).format('MMM DD, YYYY HH:mm')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="shadow-sm rounded-xl overflow-hidden">
          <Tabs 
            defaultActiveKey="users"
            type="card"
            className="dashboard-tabs"
          >
            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  User Management
                </span>
              } 
              key="users"
            >
              <div className="bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-lg font-medium">Registered Users</h3>
                  <div>
                    <Input.Search
                      placeholder="Search users..."
                      style={{ width: 250 }}
                      className="mr-2"
                    />
                    <Button type="primary" icon={<UserOutlined />}>
                      Add User
                    </Button>
                  </div>
                </div>
                <Table
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  loading={loading}
                  pagination={{ 
                    pageSize: 10,
                    showSizeChanger: false,
                    className: "pagination-modern"
                  }}
                  className="custom-table"
                  scroll={{ x: 800 }}
                  rowClassName="hover:bg-blue-50 transition-colors"
                />
              </div>
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <DollarOutlined />
                  Transactions
                </span>
              }
              key="transactions"
            >
              <div className="bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-lg font-medium">System Transactions</h3>
                  <div>
                    <Button type="primary" ghost icon={<FileTextOutlined />}>
                      Export Report
                    </Button>
                  </div>
                </div>
                <Table
                  columns={transactionColumns}
                  dataSource={transactions}
                  rowKey="id"
                  loading={loading}
                  pagination={{ 
                    pageSize: 10,
                    showSizeChanger: false,
                    className: "pagination-modern"
                  }}
                  className="custom-table"
                  scroll={{ x: 800 }}
                  rowClassName="hover:bg-blue-50 transition-colors"
                />
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Meetings
                </span>
              } 
              key="meetings"
            >
              <div className="bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-lg font-medium">Scheduled Meetings</h3>
                  <Button
                    type="primary"
                    ghost
                    icon={<ScheduleOutlined />}
                    onClick={() => setScheduleMeetingModalVisible(true)}
                  >
                    Schedule Meeting
                  </Button>
                </div>
                <Calendar 
                  className="site-calendar-demo-card mb-4"
                  fullscreen={false}
                  dateCellRender={(date) => {
                    const meetingsOnDay = meetings.filter(m => 
                      dayjs(m.scheduledDate).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                    );
                    
                    if (meetingsOnDay.length > 0) {
                      return (
                        <Badge 
                          count={meetingsOnDay.length} 
                          className="site-badge-count-4"
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Table
                  columns={[
                    {
                      title: 'Buyer',
                      dataIndex: 'buyerName',
                      key: 'buyer',
                    },
                    {
                      title: 'Seller',
                      dataIndex: 'sellerName',
                      key: 'seller',
                    },
                    {
                      title: 'Gemstone',
                      dataIndex: 'gemstoneName',
                      key: 'gemstone',
                    },
                    {
                      title: 'Date',
                      dataIndex: 'scheduledDate',
                      key: 'date',
                      render: date => dayjs(date).format('MMM DD, YYYY'),
                    },
                    {
                      title: 'Time',
                      dataIndex: 'scheduledTime',
                      key: 'time',
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status) => {
                        let color = 'blue';
                        if (status === 'completed') color = 'green';
                        if (status === 'canceled') color = 'red';
                        return <Tag color={color}>{status.toUpperCase()}</Tag>
                      }
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button 
                            type="primary" 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={() => showMeetingDetails(record)}
                          >
                            Details
                          </Button>
                        </Space>
                      ),
                    }
                  ]}
                  dataSource={meetings}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="custom-table"
                />
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <PercentageOutlined />
                  Commission Settings
                </span>
              } 
              key="commissions"
            >
              <div className="bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-lg font-medium">Commission Structure</h3>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedTransaction(null);
                      commissionForm.resetFields();
                      setCommissionModalVisible(true);
                    }}
                  >
                    Add Commission Tier
                  </Button>
                </div>
                <Table
                  columns={[
                    {
                      title: 'Gem Type',
                      dataIndex: 'gemType',
                      key: 'gemType',
                    },
                    {
                      title: 'Commission Rate',
                      dataIndex: 'percentage',
                      key: 'percentage',
                      render: (percentage) => `${percentage}%`,
                    },
                    {
                      title: 'Price Range',
                      key: 'range',
                      render: (_, record) => (
                        <span>
                          ${record.minAmount.toLocaleString()} - 
                          {record.maxAmount ? `$${record.maxAmount.toLocaleString()}` : 'Unlimited'}
                        </span>
                      ),
                    },
                    {
                      title: 'Effective Date',
                      dataIndex: 'effectiveDate',
                      key: 'effectiveDate',
                      render: (date) => dayjs(date).format('MMM DD, YYYY'),
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status) => (
                        <Tag color={status === 'active' ? 'green' : 'orange'}>
                          {status.toUpperCase()}
                        </Tag>
                      ),
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => {
                              commissionForm.setFieldsValue({
                                gemType: record.gemType,
                                percentage: record.percentage,
                                minAmount: record.minAmount,
                                maxAmount: record.maxAmount,
                                status: record.status === 'active'
                              });
                              setCommissionModalVisible(true);
                            }}
                          />
                        </Space>
                      ),
                    },                  ]}
                  dataSource={commissionSettings}
                  rowKey="id"
                  className="custom-table"
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* User Details Modal Section */}
      <Modal
        title="User Details"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{selectedUser.firstName} {selectedUser.lastName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{selectedUser.role}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedUser.status}</Descriptions.Item>
            <Descriptions.Item label="Verification">{selectedUser.verificationStatus}</Descriptions.Item>
            <Descriptions.Item label="Registration Date">{dayjs(selectedUser.registrationDate).format('MMMM DD, YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Last Login">{dayjs(selectedUser.lastLogin).format('MMMM DD, YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedUser.phoneNumber || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedUser.address || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Meeting Details Modal */}
      <Modal
        title="Meeting Details"
        open={meetingModalVisible}
        onCancel={() => setMeetingModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMeetingModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedMeeting && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Gemstone">{selectedMeeting.gemstoneName}</Descriptions.Item>
            <Descriptions.Item label="Buyer">{selectedMeeting.buyerName}</Descriptions.Item>
            <Descriptions.Item label="Seller">{selectedMeeting.sellerName}</Descriptions.Item>
            <Descriptions.Item label="Date">{dayjs(selectedMeeting.scheduledDate).format('MMMM DD, YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Time">{selectedMeeting.scheduledTime}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedMeeting.location}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedMeeting.status}</Descriptions.Item>
            <Descriptions.Item label="Notes">{selectedMeeting.notes}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Schedule Meeting Modal */}
      <Modal
        title="Schedule Meeting"
        open={scheduleMeetingModalVisible}
        onCancel={() => setScheduleMeetingModalVisible(false)}
        onOk={handleScheduleMeeting}
      >
        <Form form={meetingForm} layout="vertical">
          <Form.Item
            name="buyerId"
            label="Buyer"
            rules={[{ required: true, message: 'Please select buyer' }]}
          >
            <Select placeholder="Select buyer">
              {users.filter(u => u.role === 'buyer').map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="sellerId"
            label="Seller"
            rules={[{ required: true, message: 'Please select seller' }]}
          >
            <Select placeholder="Select seller">
              {users.filter(u => u.role === 'seller').map(user => (
                <Select.Option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="gemstoneId"
            label="Gemstone"
            rules={[{ required: true, message: 'Please enter gemstone' }]}
          >
            <Input placeholder="Gemstone name or ID" />
          </Form.Item>
          <Form.Item
            name="scheduledDate"
            label="Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="scheduledTime"
            label="Time"
            rules={[{ required: true, message: 'Please select time' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input placeholder="Meeting location" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} placeholder="Additional notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Commission Setting Modal */}
      <Modal
        title="Commission Setting"
        open={commissionModalVisible}
        onCancel={() => setCommissionModalVisible(false)}
        onOk={handleUpdateCommission}
      >
        <Form form={commissionForm} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="percentage"
            label="Commission Percentage"
            rules={[{ required: true, message: 'Please enter percentage' }]}
          >
            <InputNumber
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value!.replace('%', '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="minAmount"
            label="Minimum Transaction Amount"
            rules={[{ required: true, message: 'Please enter minimum amount' }]}
          >
            <InputNumber
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="maxAmount"
            label="Maximum Transaction Amount (0 for no limit)"
          >
            <InputNumber
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="applicableUserType"
            label="Applicable User Type"
            rules={[{ required: true, message: 'Please select user type' }]}
          >
            <Select placeholder="Select user type">
              <Option value="all">All Users</Option>
              <Option value="new">New Users</Option>
              <Option value="premium">Premium Users</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="active"
            valuePropName="checked"
            label="Active"
          >            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
