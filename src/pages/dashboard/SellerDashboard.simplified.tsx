import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, 
  Tabs, List, Avatar, Badge, Progress, Divider, Space
} from 'antd';
import { 
  ShopOutlined, DollarOutlined, FileTextOutlined,
  CalendarOutlined, TrophyOutlined, PlusOutlined,
  EditOutlined, EyeOutlined, DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

// Simple mock data
const mockListings = [
  { 
    id: '1', 
    name: 'Blue Sapphire', 
    image: 'https://via.placeholder.com/100', 
    price: 2500, 
    status: 'active', 
    bids: 5,
    createdAt: '2025-05-15',
    views: 48
  },
  { 
    id: '2', 
    name: 'Ruby', 
    image: 'https://via.placeholder.com/100', 
    price: 3750, 
    status: 'active', 
    bids: 3,
    createdAt: '2025-05-28',
    views: 32
  },
  { 
    id: '3', 
    name: 'Emerald', 
    image: 'https://via.placeholder.com/100', 
    price: 1850, 
    status: 'pending', 
    bids: 0,
    createdAt: '2025-06-10',
    views: 15
  },
  { 
    id: '4', 
    name: 'Diamond', 
    image: 'https://via.placeholder.com/100', 
    price: 5200, 
    status: 'sold', 
    bids: 7,
    createdAt: '2025-05-05',
    views: 76
  }
];

const mockBids = [
  { 
    id: '1',
    gemstone: 'Blue Sapphire',
    image: 'https://via.placeholder.com/100',
    buyer: 'John Doe',
    amount: 2400,
    date: '2025-06-15',
    status: 'pending'
  },
  { 
    id: '2',
    gemstone: 'Ruby',
    image: 'https://via.placeholder.com/100',
    buyer: 'Alice Smith',
    amount: 3500,
    date: '2025-06-14',
    status: 'accepted'
  },
  { 
    id: '3',
    gemstone: 'Blue Sapphire',
    image: 'https://via.placeholder.com/100',
    buyer: 'Robert Johnson',
    amount: 2300,
    date: '2025-06-13',
    status: 'rejected'
  }
];

const mockMeetings = [
  { 
    id: '1',
    gemstone: 'Ruby',
    image: 'https://via.placeholder.com/100',
    buyer: 'Alice Smith',
    date: '2025-06-25',
    time: '10:30 AM',
    location: 'GemNet Office, New York',
    status: 'scheduled'
  },
  { 
    id: '2',
    gemstone: 'Diamond',
    image: 'https://via.placeholder.com/100',
    buyer: 'Emily White',
    date: '2025-06-28',
    time: '2:00 PM',
    location: 'Virtual Meeting',
    status: 'scheduled'
  }
];

const SellerDashboard: React.FC = () => {
  // Statistics
  const stats = {
    activeListings: 3,
    pendingBids: 1,
    upcomingMeetings: 2,
    totalRevenue: 12500
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seller Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your listings, bids, and sales
            </p>
          </div>
          <div className="hidden md:flex space-x-2">
            <Button type="primary" icon={<PlusOutlined />}>
              Add New Listing
            </Button>
            <Button icon={<ShopOutlined />}>
              View My Store
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Listings"
              value={stats.activeListings}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Bids"
              value={stats.pendingBids}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Upcoming Meetings"
              value={stats.upcomingMeetings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content - Tabbed Interface */}
      <Card className="mb-6">
        <Tabs defaultActiveKey="listings">
          <TabPane 
            tab={<span><FileTextOutlined /> My Listings</span>} 
            key="listings"
          >
            <Table 
              dataSource={mockListings}
              columns={[
                {
                  title: 'Gemstone',
                  key: 'gemstone',
                  render: (_, record) => (
                    <div className="flex items-center space-x-3">
                      <img 
                        src={record.image} 
                        alt={record.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="font-medium">{record.name}</span>
                    </div>
                  ),
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: price => `$${price.toLocaleString()}`
                },
                {
                  title: 'Bids',
                  dataIndex: 'bids',
                  key: 'bids',
                },
                {
                  title: 'Views',
                  dataIndex: 'views',
                  key: 'views',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => {
                    const statusColors = {
                      active: 'green',
                      pending: 'orange',
                      sold: 'blue'
                    };
                    return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
                  }
                },
                {
                  title: 'Created',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: date => dayjs(date).format('MMM DD, YYYY')
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <Space>
                      <Button size="small" icon={<EyeOutlined />}>View</Button>
                      <Button size="small" icon={<EditOutlined />}>Edit</Button>
                      {record.status !== 'sold' && (
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                      )}
                    </Space>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane 
            tab={<span><TrophyOutlined /> Bids Received</span>} 
            key="bids"
          >
            <Table 
              dataSource={mockBids}
              columns={[
                {
                  title: 'Gemstone',
                  key: 'gemstone',
                  render: (_, record) => (
                    <div className="flex items-center space-x-3">
                      <img 
                        src={record.image} 
                        alt={record.gemstone}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="font-medium">{record.gemstone}</span>
                    </div>
                  ),
                },
                {
                  title: 'Buyer',
                  dataIndex: 'buyer',
                  key: 'buyer',
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: amount => `$${amount.toLocaleString()}`
                },
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: date => dayjs(date).format('MMM DD, YYYY')
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => {
                    const statusColors = {
                      pending: 'orange',
                      accepted: 'green',
                      rejected: 'red'
                    };
                    return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
                  }
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <div className="space-x-2">
                      {record.status === 'pending' && (
                        <>
                          <Button size="small" type="primary">Accept</Button>
                          <Button size="small" danger>Reject</Button>
                        </>
                      )}
                      {record.status === 'accepted' && (
                        <Button size="small" type="primary">Schedule Meeting</Button>
                      )}
                    </div>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          <TabPane 
            tab={<span><CalendarOutlined /> Meetings</span>} 
            key="meetings"
          >
            <Table 
              dataSource={mockMeetings}
              columns={[
                {
                  title: 'Gemstone',
                  key: 'gemstone',
                  render: (_, record) => (
                    <div className="flex items-center space-x-3">
                      <img 
                        src={record.image} 
                        alt={record.gemstone}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="font-medium">{record.gemstone}</span>
                    </div>
                  ),
                },
                {
                  title: 'Buyer',
                  dataIndex: 'buyer',
                  key: 'buyer',
                },
                {
                  title: 'Date & Time',
                  key: 'datetime',
                  render: (_, record) => `${dayjs(record.date).format('MMM DD, YYYY')} at ${record.time}`
                },
                {
                  title: 'Location',
                  dataIndex: 'location',
                  key: 'location',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => {
                    const statusColors = {
                      scheduled: 'blue',
                      completed: 'green',
                      cancelled: 'red'
                    };
                    return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
                  }
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: () => (
                    <Button size="small" type="primary" icon={<CalendarOutlined />}>
                      Details
                    </Button>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* Performance Summary */}
      <Card title="Sales Performance" className="mb-6">
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <div className="text-center">
              <Progress type="circle" percent={75} format={() => '75%'} />
              <p className="mt-3 text-gray-600">Listing Success Rate</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <Progress type="circle" percent={63} format={() => '63%'} />
              <p className="mt-3 text-gray-600">Bid Acceptance Rate</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <Progress type="circle" percent={92} format={() => '92%'} />
              <p className="mt-3 text-gray-600">Positive Reviews</p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SellerDashboard;
