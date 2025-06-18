import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, Modal, 
  message, Tabs, List, Avatar, Badge,
  Calendar, Alert, Descriptions, Space
} from 'antd';
import { 
  UserOutlined, DollarOutlined, CalendarOutlined,
  EyeOutlined, CheckOutlined,
  CloseOutlined, WarningOutlined, 
  SettingOutlined, BellOutlined, FileTextOutlined
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
  activeMeetings: number;
  pendingAds: number;
  systemAlerts: number;
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
  status: 'active' | 'suspended' | 'pending';
}

interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  gemstoneId: string;
  amount: number;
  commission: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
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
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeMeetings: 0,
    pendingAds: 0,
    systemAlerts: 0
  });
  // Modal states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);    try {
      const [
        usersResponse, 
        transactionsResponse, 
        adsResponse,
        verificationsResponse,
        statsResponse
      ] = await Promise.all([
        api.getUsers(),
        api.getTransactions(),
        api.getAdvertisements(),
        api.getPendingVerifications(),
        api.getAdminStats()
      ]);

      setUsers(usersResponse.data || []);
      setTransactions(transactionsResponse.data || []);
      setAdvertisements(adsResponse.data || []);
      setPendingVerifications(verificationsResponse.data || []);
      setStats(statsResponse.data || stats);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'suspend' | 'activate') => {
    try {
      await api.updateUserStatus(userId, action);
      message.success(`User ${action}d successfully`);
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage users, transactions, and system settings
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <Button type="primary" icon={<SettingOutlined />}>
                System Settings
              </Button>
            </div>
          </div>
        </div>        {/* Statistics Cards */}
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
                    prefix={stat.prefix || ''}
                    valueStyle={{ 
                      color: `var(--ant-${stat.color}-6)`,
                      fontSize: '2rem',
                      fontWeight: 'bold' 
                    }}
                  />
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}-50`}>
                    {stat.icon && React.cloneElement(stat.icon, { 
                      style: { fontSize: '1.5rem' } 
                    })}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Quick Actions">
              <Space wrap>
                <Button type="primary" icon={<UserOutlined />}>
                  User Management
                </Button>
                <Button icon={<CalendarOutlined />}>
                  Schedule Meeting
                </Button>
                <Button icon={<FileTextOutlined />}>
                  Generate Report
                </Button>
                <Button icon={<SettingOutlined />}>
                  System Settings
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Pending Verifications Alert */}
        {pendingVerifications.length > 0 && (
          <Alert
            message={`${pendingVerifications.length} users pending verification`}
            description="Please review and approve user verifications."
            type="warning"
            action={
              <Button size="small" onClick={() => message.info('Navigate to verification section')}>
                Review Now
              </Button>
            }
            showIcon
            closable
          />
        )}

        {/* Main Content Tabs */}
        <Card>
          <Tabs defaultActiveKey="users">
            <TabPane tab="User Management" key="users">
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </TabPane>

            <TabPane tab="Transactions" key="transactions">
              <Table
                columns={transactionColumns}
                dataSource={transactions}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </TabPane>

            <TabPane tab="Meeting Management" key="meetings">
              <div className="space-y-4">
                <Button 
                  type="primary" 
                  icon={<CalendarOutlined />}
                  onClick={() => setMeetingModalVisible(true)}
                >
                  Schedule New Meeting
                </Button>
                <Calendar 
                  fullscreen={false}
                  onPanelChange={(value, mode) => {
                    console.log(value, mode);
                  }}
                />
              </div>
            </TabPane>

            <TabPane tab="Advertisement Management" key="ads">
              <Table
                columns={adColumns}
                dataSource={advertisements}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </TabPane>

            <TabPane tab="Verification Queue" key="verifications">
              <List
                itemLayout="horizontal"
                dataSource={pendingVerifications}
                renderItem={(user) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        onClick={() => handleVerifyUser(user.id, true)}
                        icon={<CheckOutlined />}
                      >
                        Approve
                      </Button>,
                      <Button 
                        danger 
                        onClick={() => handleVerifyUser(user.id, false)}
                        icon={<CloseOutlined />}
                      >
                        Reject
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`${user.firstName} ${user.lastName}`}
                      description={
                        <div>
                          <div>{user.email}</div>
                          <div className="text-gray-500">
                            Status: {user.verificationStatus} • Role: {user.role}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="Analytics" key="analytics">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="Platform Analytics">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Statistic title="Monthly Revenue Growth" value={15.2} suffix="%" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="User Retention Rate" value={87.3} suffix="%" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="Transaction Success Rate" value={94.7} suffix="%" />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>

        {/* User Details Modal */}
        <Modal
          title="User Details"
          open={userModalVisible}
          onCancel={() => {
            setUserModalVisible(false);
            setSelectedUser(null);
          }}
          footer={null}
          width={600}
        >
          {selectedUser && (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Name" span={2}>
                {selectedUser.firstName} {selectedUser.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={selectedUser.role === 'admin' ? 'red' : selectedUser.role === 'seller' ? 'green' : 'blue'}>
                  {selectedUser.role.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>
                  {selectedUser.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Verification">
                <Badge 
                  status={selectedUser.isVerified ? 'success' : 'warning'} 
                  text={selectedUser.isVerified ? 'Verified' : 'Unverified'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {dayjs(selectedUser.registrationDate).format('MMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login" span={2}>
                {dayjs(selectedUser.lastLogin).format('MMM DD, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        {/* Advertisement Details Modal */}
        <Modal
          title="Advertisement Details"
          open={adModalVisible}
          onCancel={() => {
            setAdModalVisible(false);
            setSelectedAd(null);
          }}
          footer={
            selectedAd?.status === 'pending' ? (
              <Space>
                <Button onClick={() => setAdModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  danger 
                  onClick={() => {
                    handleAdAction(selectedAd.id, 'reject');
                    setAdModalVisible(false);
                  }}
                >
                  Reject
                </Button>
                <Button 
                  type="primary"
                  onClick={() => {
                    handleAdAction(selectedAd.id, 'approve');
                    setAdModalVisible(false);
                  }}
                >
                  Approve
                </Button>
              </Space>
            ) : null
          }
          width={600}
        >
          {selectedAd && (
            <div className="space-y-4">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Title" span={2}>
                  {selectedAd.title}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                  {selectedAd.description}
                </Descriptions.Item>
                <Descriptions.Item label="Budget">
                  ${selectedAd.budget.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Duration">
                  {selectedAd.duration} days
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={selectedAd.status === 'approved' ? 'green' : 'orange'}>
                    {selectedAd.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Submitted">
                  {dayjs(selectedAd.submissionDate).format('MMM DD, YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Modal>

        {/* Meeting Modal */}
        <Modal
          title="Schedule Meeting"
          open={meetingModalVisible}
          onCancel={() => setMeetingModalVisible(false)}
          footer={null}
          width={500}
        >
          <Alert
            message="Meeting Scheduler"
            description="Admin meeting scheduling functionality will be implemented here."
            type="info"
            showIcon
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
