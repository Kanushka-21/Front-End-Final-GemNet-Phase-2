import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, 
  Tabs, List, Avatar, Badge
} from 'antd';
import { 
  UserOutlined, DollarOutlined, CalendarOutlined,
  WarningOutlined, TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

// Basic types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Simple mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'seller', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'buyer', status: 'pending' }
];

const mockTransactions = [
  { id: '1', amount: 1500, date: '2025-06-01', buyer: 'John Doe', seller: 'Jane Smith', status: 'completed' },
  { id: '2', amount: 2500, date: '2025-06-05', buyer: 'Bob Johnson', seller: 'Jane Smith', status: 'pending' },
  { id: '3', amount: 950, date: '2025-06-10', buyer: 'John Doe', seller: 'Mike Wilson', status: 'completed' }
];

const mockAlerts = [
  { id: '1', message: 'New user registration needs approval', type: 'warning', time: '2 hours ago' },
  { id: '2', message: 'System maintenance scheduled', type: 'info', time: '1 day ago' },
  { id: '3', message: 'Failed login attempts detected', type: 'error', time: '30 minutes ago' }
];

const AdminDashboard: React.FC = () => {
  // Statistics
  const stats = {
    totalUsers: 245,
    totalTransactions: 1243,
    totalRevenue: 156500,
    pendingApprovals: 8
  };

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
            <Button icon={<CalendarOutlined />}>
              View Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Transactions"
              value={stats.totalTransactions}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={stats.totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Approvals"
              value={stats.pendingApprovals}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content - Tabbed Interface */}
      <Card className="mb-6">
        <Tabs defaultActiveKey="users">
          <TabPane 
            tab={<span><TeamOutlined /> Users</span>} 
            key="users"
          >
            <Table 
              dataSource={mockUsers}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                },
                {
                  title: 'Role',
                  dataIndex: 'role',
                  key: 'role',
                  render: role => <Tag color={role === 'admin' ? 'blue' : role === 'seller' ? 'green' : 'orange'}>{role}</Tag>
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => (
                    <Tag color={status === 'active' ? 'green' : 'orange'}>
                      {status.toUpperCase()}
                    </Tag>
                  )
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: () => (
                    <Button size="small" type="primary">
                      View Details
                    </Button>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane 
            tab={<span><DollarOutlined /> Transactions</span>} 
            key="transactions"
          >
            <Table 
              dataSource={mockTransactions}
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: amount => `$${amount}`
                },
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: date => dayjs(date).format('MMM DD, YYYY')
                },
                {
                  title: 'Buyer',
                  dataIndex: 'buyer',
                  key: 'buyer',
                },
                {
                  title: 'Seller',
                  dataIndex: 'seller',
                  key: 'seller',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => (
                    <Tag color={status === 'completed' ? 'green' : 'blue'}>
                      {status.toUpperCase()}
                    </Tag>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          <TabPane 
            tab={<span><WarningOutlined /> System Alerts</span>} 
            key="alerts"
          >
            <List
              itemLayout="horizontal"
              dataSource={mockAlerts}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<WarningOutlined />} style={{ 
                        backgroundColor: 
                          item.type === 'error' ? '#ff4d4f' : 
                          item.type === 'warning' ? '#faad14' : '#1890ff'
                      }} />
                    }
                    title={item.message}
                    description={item.time}
                  />
                  <Button size="small">Resolve</Button>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminDashboard;
