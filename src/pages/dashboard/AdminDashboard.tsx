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
  LockOutlined, UnlockOutlined, ScheduleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
  id: string;  amount: number;
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
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update state with mock data
      setUsers(mockUsers);
      setTransactions(mockTransactions);
      setMeetings(mockMeetings);
      setCommissionSettings(mockCommissionSettings);
      setPendingVerifications(mockUsers.filter(u => u.verificationStatus === 'pending'));
      
      // Update stats
      setStats({
        totalUsers: mockUsers.length,
        totalTransactions: mockTransactions.length,
        totalRevenue: mockTransactions.reduce((sum, transaction) => 
          transaction.status === 'completed' ? sum + transaction.amount : sum, 0),
        pendingVerifications: mockUsers.filter(u => u.verificationStatus === 'pending').length,
        scheduledMeetings: mockMeetings.filter(m => m.status === 'scheduled').length,
        commissionsCollected: mockTransactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + t.commissionAmount, 0),
        systemAlerts: 3,
        pendingApprovals: 2
      });
      
      message.success('Dashboard data loaded');    } catch (error) {
      message.error('Failed to load dashboard data');
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleUserAction = async (userId: string, action: 'approve' | 'block' | 'unblock' | 'delete') => {
    try {
      await api.updateUserStatus(userId, action);
      message.success(`User ${action === 'delete' ? 'deleted' : action + 'd'} successfully`);
      fetchDashboardData();
    } catch (error) {
      message.error(`Failed to ${action} user`);
    }
  };

  const handleAdAction = async (adId: string, action: 'approve' | 'reject') => {
    try {
      await api.updateAdStatus(adId, action);
      message.success(`Advertisement ${action}d successfully`);
      fetchDashboardData();
    } catch (error) {
      message.error(`Failed to ${action} advertisement`);
    }
  };

  const handleVerifyUser = async (userId: string, approved: boolean) => {
    try {
      await api.updateVerificationStatus(userId, approved);
      message.success(`User verification ${approved ? 'approved' : 'rejected'}`);
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to update verification status');
    }
  };

  // Schedule meeting between buyer and seller
  const handleScheduleMeeting = () => {
    meetingForm.validateFields().then(async (values) => {
      try {
        const meetingData = {
          buyerId: values.buyerId,
          sellerId: values.sellerId,
          gemstoneId: values.gemstoneId,
          scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
          scheduledTime: values.scheduledTime.format('HH:mm'),
          location: values.location,
          notes: values.notes || '',
        };

        await api.scheduleMeeting(meetingData);
        message.success('Meeting scheduled successfully');
        setScheduleMeetingModalVisible(false);
        meetingForm.resetFields();
        fetchDashboardData();
      } catch (error) {
        console.error('Error scheduling meeting:', error);
        message.error('Failed to schedule meeting');
      }
    });
  };
  
  // Update commission setting
  const handleUpdateCommission = () => {
    commissionForm.validateFields().then(async (values) => {
      try {
        const commissionData = {
          id: values.id || undefined,
          percentage: values.percentage,
          minAmount: values.minAmount,
          maxAmount: values.maxAmount,
          applicableUserType: values.applicableUserType,
          active: values.active,
        };

        if (values.id) {
          await api.updateCommissionSetting(values.id, commissionData);
          message.success('Commission setting updated successfully');
        } else {
          await api.createCommissionSetting(commissionData);
          message.success('New commission setting created successfully');
        }

        setCommissionModalVisible(false);
        commissionForm.resetFields();
        fetchDashboardData();
      } catch (error) {
        console.error('Error updating commission setting:', error);
        message.error('Failed to update commission setting');
      }
    });
  };

  // Handle system alert dismissal
  const handleDismissAlert = async (alertId: string) => {
    try {
      await api.dismissSystemAlert(alertId);
      setSystemAlerts(systemAlerts.filter(alert => alert.id !== alertId));
      message.success('Alert dismissed');
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
      key: 'role',      render: (role: 'buyer' | 'seller' | 'admin') => {
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
          pending: 'orange'
        };
        return (
          <div className="space-y-1">
            <Tag color={statusColors[record.status]}>{record.status.toUpperCase()}</Tag>
            {record.isVerified ? (
              <Badge status="success" text="Verified" />
            ) : (
              <Badge status="warning" text="Unverified" />
            )}
          </div>
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
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setUserModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                size="small" 
                type="primary"
                onClick={() => handleUserAction(record.id, 'approve')}
              >
                Approve
              </Button>
              <Button 
                size="small" 
                danger
                onClick={() => handleUserAction(record.id, 'suspend')}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'active' && (
            <Button 
              size="small" 
              danger
              onClick={() => handleUserAction(record.id, 'suspend')}
            >
              Suspend
            </Button>
          )}
          {record.status === 'suspended' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleUserAction(record.id, 'activate')}
            >
              Activate
            </Button>
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
      render: (id) => `#${id.slice(-8)}`,
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
      key: 'status',      render: (status: 'completed' | 'pending' | 'cancelled') => {
        const colors: Record<string, string> = { completed: 'green', pending: 'orange', cancelled: 'red' };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
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
      key: 'status',      render: (status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired') => {
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
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedAd(record);
              setAdModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                size="small" 
                type="primary"
                onClick={() => handleAdAction(record.id, 'approve')}
              >
                Approve
              </Button>
              <Button 
                size="small" 
                danger
                onClick={() => handleAdAction(record.id, 'reject')}
              >
                Reject
              </Button>
            </>
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
      value: stats.systemAlerts,
      icon: <BellOutlined className="text-red-500" />,
      color: 'red'
    }
  ];

  // Render function for the dashboard
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Administrator Dashboard</h1>
          <p className="text-gray-600">Manage users, transactions, and system settings</p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Transactions"
                value={stats.totalTransactions}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#096dd9' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Revenue"
                value={stats.totalRevenue}
                prefix="$"
                precision={2}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Verifications"
                value={stats.pendingVerifications}
                valueStyle={{ color: '#cf1322' }}
                prefix={<Badge status="processing" />}
              />
            </Card>
          </Col>
        </Row>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <Card className="mb-6" title={<><BellOutlined /> System Alerts</>}>
            <List
              dataSource={systemAlerts}
              renderItem={(alert) => (
                <List.Item
                  actions={[
                    <Button 
                      key="dismiss" 
                      size="small" 
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      alert.type === 'warning' ? <WarningOutlined style={{ color: '#faad14' }} /> : 
                      alert.type === 'error' ? <CloseOutlined style={{ color: '#f5222d' }} /> :
                      alert.type === 'success' ? <CheckOutlined style={{ color: '#52c41a' }} /> :
                      <BellOutlined style={{ color: '#1890ff' }} />
                    }
                    title={alert.message}
                    description={alert.date}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mb-6" title="Quick Actions">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Button 
                type="primary" 
                icon={<CalendarOutlined />} 
                block
                onClick={() => setScheduleMeetingModalVisible(true)}
              >
                Schedule Meeting
              </Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button 
                icon={<PercentageOutlined />} 
                block
                onClick={() => {
                  commissionForm.resetFields();
                  setCommissionModalVisible(true);
                }}
              >
                Update Commission Settings
              </Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button 
                icon={<FileTextOutlined />} 
                block
                onClick={() => {
                  // Add report generation functionality
                  message.info('Generating system report...');
                }}
              >
                Generate System Report
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultActiveKey="users">
          <TabPane tab={<span><TeamOutlined /> User Management</span>} key="users">
            <Card>
              <Table
                loading={loading}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: 'Name',
                    key: 'name',
                    render: (_, record) => `${record.firstName} ${record.lastName}`
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email'
                  },
                  {
                    title: 'Role',
                    dataIndex: 'role',
                    render: (role) => (
                      <Tag color={
                        role === 'admin' ? 'gold' :
                        role === 'seller' ? 'blue' : 'green'
                      }>
                        {role.toUpperCase()}
                      </Tag>
                    )
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (status) => (
                      <Tag color={
                        status === 'active' ? 'green' :
                        status === 'suspended' ? 'orange' :
                        status === 'blocked' ? 'red' : 'blue'
                      }>
                        {status.toUpperCase()}
                      </Tag>
                    )
                  },
                  {
                    title: 'Verified',
                    dataIndex: 'isVerified',
                    render: (isVerified) => (
                      isVerified ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
                    )
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Space>
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => {
                            setSelectedUser(record);
                            setUserModalVisible(true);
                          }}
                        >
                          View
                        </Button>
                        {record.status === 'active' ? (
                          <Button 
                            icon={<LockOutlined />} 
                            size="small"
                            danger
                            onClick={() => handleUserAction(record.id, 'block')}
                          >
                            Block
                          </Button>
                        ) : record.status === 'blocked' ? (
                          <Button 
                            icon={<UnlockOutlined />} 
                            size="small"
                            type="primary"
                            onClick={() => handleUserAction(record.id, 'unblock')}
                          >
                            Unblock
                          </Button>
                        ) : null}
                      </Space>
                    )
                  }
                ]}
              />
            </Card>
          </TabPane>
          
          <TabPane tab={<span><DollarOutlined /> Transaction Management</span>} key="transactions">
            <Card>
              <Table
                loading={loading}
                dataSource={transactions}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: 'Gemstone',
                    dataIndex: 'gemstoneName'
                  },
                  {
                    title: 'Buyer',
                    dataIndex: 'buyerName'
                  },
                  {
                    title: 'Seller',
                    dataIndex: 'sellerName'
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'amount',
                    render: (amount) => `$${amount.toLocaleString()}`
                  },
                  {
                    title: 'Commission',
                    dataIndex: 'commission',
                    render: (commission) => `$${commission.toLocaleString()}`
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (status) => (
                      <Tag color={
                        status === 'completed' ? 'green' :
                        status === 'pending' ? 'gold' : 'red'
                      }>
                        {status.toUpperCase()}
                      </Tag>
                    )
                  },
                  {
                    title: 'Date',
                    dataIndex: 'date',
                    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Button 
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => {
                          setSelectedTransaction(record);
                          // Could add modal for transaction details
                          message.info(`Viewing transaction ${record.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    )
                  }
                ]}
              />
            </Card>
          </TabPane>
          
          <TabPane tab={<span><CalendarOutlined /> Meeting Management</span>} key="meetings">
            <Card>
              <div className="mb-4">
                <Button 
                  type="primary" 
                  icon={<ScheduleOutlined />}
                  onClick={() => setScheduleMeetingModalVisible(true)}
                >
                  Schedule New Meeting
                </Button>
              </div>
              <Table
                loading={loading}
                dataSource={meetings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: 'Gemstone',
                    dataIndex: 'gemstoneName'
                  },
                  {
                    title: 'Buyer',
                    dataIndex: 'buyerName'
                  },
                  {
                    title: 'Seller',
                    dataIndex: 'sellerName'
                  },
                  {
                    title: 'Scheduled Date',
                    dataIndex: 'scheduledDate'
                  },
                  {
                    title: 'Scheduled Time',
                    dataIndex: 'scheduledTime'
                  },
                  {
                    title: 'Location',
                    dataIndex: 'location'
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (status) => (
                      <Tag color={
                        status === 'completed' ? 'green' :
                        status === 'scheduled' ? 'blue' : 'red'
                      }>
                        {status.toUpperCase()}
                      </Tag>
                    )
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Space>
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => {
                            setSelectedMeeting(record);
                            setMeetingModalVisible(true);
                          }}
                        >
                          View
                        </Button>
                        {record.status === 'scheduled' && (
                          <Button 
                            icon={<CheckOutlined />} 
                            size="small"
                            type="primary"
                            onClick={() => {
                              // Mark meeting as completed
                              api.updateMeetingStatus(record.id, 'completed')
                                .then(() => {
                                  message.success('Meeting marked as completed');
                                  fetchDashboardData();
                                })
                                .catch(() => {
                                  message.error('Failed to update meeting');
                                });
                            }}
                          >
                            Complete
                          </Button>
                        )}
                      </Space>
                    )
                  }
                ]}
              />
            </Card>
          </TabPane>

          <TabPane tab={<span><PercentageOutlined /> Commission Settings</span>} key="commission">
            <Card>
              <div className="mb-4">
                <Button 
                  type="primary" 
                  onClick={() => {
                    commissionForm.resetFields();
                    setCommissionModalVisible(true);
                  }}
                >
                  Add New Commission Rule
                </Button>
              </div>
              <Table
                loading={loading}
                dataSource={commissionSettings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: 'Percentage',
                    dataIndex: 'percentage',
                    render: (percentage) => `${percentage}%`
                  },
                  {
                    title: 'Min Amount',
                    dataIndex: 'minAmount',
                    render: (amount) => `$${amount.toLocaleString()}`
                  },
                  {
                    title: 'Max Amount',
                    dataIndex: 'maxAmount',
                    render: (amount) => amount ? `$${amount.toLocaleString()}` : 'No limit'
                  },
                  {
                    title: 'User Type',
                    dataIndex: 'applicableUserType',
                    render: (type) => type.charAt(0).toUpperCase() + type.slice(1)
                  },
                  {
                    title: 'Status',
                    dataIndex: 'active',
                    render: (active) => (
                      <Tag color={active ? 'green' : 'red'}>
                        {active ? 'ACTIVE' : 'INACTIVE'}
                      </Tag>
                    )
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Space>
                        <Button 
                          icon={<EditOutlined />} 
                          size="small"
                          onClick={() => {
                            commissionForm.setFieldsValue({
                              id: record.id,
                              percentage: record.percentage,
                              minAmount: record.minAmount,
                              maxAmount: record.maxAmount,
                              applicableUserType: record.applicableUserType,
                              active: record.active
                            });
                            setCommissionModalVisible(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          icon={record.active ? <CloseOutlined /> : <CheckOutlined />} 
                          size="small"
                          type={record.active ? 'default' : 'primary'}
                          onClick={() => {
                            api.updateCommissionSetting(record.id, { ...record, active: !record.active })
                              .then(() => {
                                message.success(`Commission rule ${record.active ? 'deactivated' : 'activated'}`);
                                fetchDashboardData();
                              })
                              .catch(() => {
                                message.error('Failed to update commission rule');
                              });
                          }}
                        >
                          {record.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </Space>
                    )
                  }
                ]}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* User Detail Modal */}
      <Modal
        title="User Details"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>Close</Button>
        ]}
        width={700}
      >
        {selectedUser && (
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="User ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{`${selectedUser.firstName} ${selectedUser.lastName}`}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedUser.phoneNumber || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={
                selectedUser.role === 'admin' ? 'gold' :
                selectedUser.role === 'seller' ? 'blue' : 'green'
              }>
                {selectedUser.role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedUser.status === 'active' ? 'green' :
                selectedUser.status === 'suspended' ? 'orange' :
                selectedUser.status === 'blocked' ? 'red' : 'blue'
              }>
                {selectedUser.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Verified">{selectedUser.isVerified ? 'Yes' : 'No'}</Descriptions.Item>
            <Descriptions.Item label="Registration Date">{dayjs(selectedUser.registrationDate).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="Last Login">{dayjs(selectedUser.lastLogin).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>{selectedUser.address || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Schedule Meeting Modal */}
      <Modal
        title="Schedule Meeting"
        open={scheduleMeetingModalVisible}
        onCancel={() => setScheduleMeetingModalVisible(false)}
        onOk={handleScheduleMeeting}
        confirmLoading={loading}
      >
        <Form form={meetingForm} layout="vertical">
          <Form.Item
            name="buyerId"
            label="Select Buyer"
            rules={[{ required: true, message: 'Please select a buyer' }]}
          >
            <Select placeholder="Select buyer">
              {users
                .filter(user => user.role === 'buyer')
                .map(buyer => (
                  <Option key={buyer.id} value={buyer.id}>
                    {buyer.firstName} {buyer.lastName}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="sellerId"
            label="Select Seller"
            rules={[{ required: true, message: 'Please select a seller' }]}
          >
            <Select placeholder="Select seller">
              {users
                .filter(user => user.role === 'seller')
                .map(seller => (
                  <Option key={seller.id} value={seller.id}>
                    {seller.firstName} {seller.lastName}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="gemstoneId"
            label="Select Gemstone"
            rules={[{ required: true, message: 'Please select a gemstone' }]}
          >
            <Select placeholder="Select gemstone">
              {/* This would be populated with actual gemstone data */}
              <Option value="gem-1">Blue Sapphire (2.5 carat)</Option>
              <Option value="gem-2">Ruby (1.8 carat)</Option>
              <Option value="gem-3">Emerald (3.2 carat)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="scheduledDate"
            label="Meeting Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="scheduledTime"
            label="Meeting Time"
            rules={[{ required: true, message: 'Please select a time' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="location"
            label="Meeting Location"
            rules={[{ required: true, message: 'Please enter a location' }]}
          >
            <Input placeholder="Meeting venue/address" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Additional Notes"
          >
            <Input.TextArea rows={3} placeholder="Any additional information..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Meeting Details Modal */}
      <Modal
        title="Meeting Details"
        open={meetingModalVisible}
        onCancel={() => setMeetingModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMeetingModalVisible(false)}>Close</Button>
        ]}
      >
        {selectedMeeting && (
          <Descriptions bordered column={{ xs: 1, sm: 1 }}>
            <Descriptions.Item label="Meeting ID">{selectedMeeting.id}</Descriptions.Item>
            <Descriptions.Item label="Gemstone">{selectedMeeting.gemstoneName}</Descriptions.Item>
            <Descriptions.Item label="Buyer">{selectedMeeting.buyerName}</Descriptions.Item>
            <Descriptions.Item label="Seller">{selectedMeeting.sellerName}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedMeeting.scheduledDate}</Descriptions.Item>
            <Descriptions.Item label="Time">{selectedMeeting.scheduledTime}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedMeeting.location}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedMeeting.status === 'completed' ? 'green' :
                selectedMeeting.status === 'scheduled' ? 'blue' : 'red'
              }>
                {selectedMeeting.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Notes">{selectedMeeting.notes || 'No additional notes'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Commission Settings Modal */}
      <Modal
        title="Commission Setting"
        open={commissionModalVisible}
        onCancel={() => setCommissionModalVisible(false)}
        onOk={handleUpdateCommission}
        confirmLoading={loading}
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
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
