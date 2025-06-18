import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, 
  Tabs, List, Avatar, Badge, Rate
} from 'antd';
import { 
  ShoppingOutlined, HeartOutlined, CalendarOutlined,
  StarOutlined, TrophyOutlined, EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

// Simple mock data
const mockBids = [
  { id: '1', gemstone: 'Blue Sapphire', image: 'https://via.placeholder.com/100', amount: 2500, status: 'active', date: '2025-06-01' },
  { id: '2', gemstone: 'Ruby', image: 'https://via.placeholder.com/100', amount: 3750, status: 'won', date: '2025-06-05' },
  { id: '3', gemstone: 'Emerald', image: 'https://via.placeholder.com/100', amount: 1850, status: 'lost', date: '2025-06-10' },
  { id: '4', gemstone: 'Diamond', image: 'https://via.placeholder.com/100', amount: 5200, status: 'active', date: '2025-06-15' }
];

const mockMeetings = [
  { 
    id: '1',
    gemstone: 'Ruby',
    image: 'https://via.placeholder.com/100',
    seller: 'Jane Smith',
    date: '2025-06-25',
    time: '10:30 AM',
    location: 'GemNet Office, New York',
    status: 'scheduled'
  },
  { 
    id: '2',
    gemstone: 'Diamond',
    image: 'https://via.placeholder.com/100',
    seller: 'Michael Brown',
    date: '2025-06-28',
    time: '2:00 PM',
    location: 'Virtual Meeting',
    status: 'scheduled'
  }
];

const mockWatchlist = [
  { 
    id: '1',
    name: 'Emerald Ring',
    image: 'https://via.placeholder.com/100',
    price: 1890,
    seller: 'Premium Gems Ltd.',
    rating: 4.8,
    reviews: 24
  },
  { 
    id: '2',
    name: 'Sapphire Pendant',
    image: 'https://via.placeholder.com/100',
    price: 2340,
    seller: 'Luxury Stones Inc.',
    rating: 4.5,
    reviews: 18
  },
  { 
    id: '3',
    name: 'Ruby Earrings',
    image: 'https://via.placeholder.com/100',
    price: 3150,
    seller: 'Jane Smith',
    rating: 4.7,
    reviews: 32
  }
];

const BuyerDashboard: React.FC = () => {
  // Statistics
  const stats = {
    activeBids: 2,
    watchlist: 3,
    upcomingMeetings: 2,
    purchaseHistory: 5
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Buyer Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Track your bids, meetings, and favorite gemstones
            </p>
          </div>
          <div className="hidden md:flex space-x-2">
            <Button type="primary" icon={<ShoppingOutlined />}>
              Browse Marketplace
            </Button>
            <Button icon={<HeartOutlined />}>
              View Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Bids"
              value={stats.activeBids}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Watchlist"
              value={stats.watchlist}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
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
              title="Purchase History"
              value={stats.purchaseHistory}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content - Tabbed Interface */}
      <Card className="mb-6">
        <Tabs defaultActiveKey="bids">
          <TabPane 
            tab={<span><TrophyOutlined /> My Bids</span>} 
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
                  title: 'Bid Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: amount => `$${amount.toLocaleString()}`
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => {
                    const statusColors = {
                      active: 'blue',
                      won: 'green',
                      lost: 'red',
                      withdrawn: 'gray'
                    };
                    return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
                  }
                },
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date',
                  render: date => dayjs(date).format('MMM DD, YYYY')
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <div className="space-x-2">
                      {record.status === 'active' && (
                        <Button size="small" danger>Withdraw</Button>
                      )}
                      {record.status === 'won' && (
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
                  title: 'Seller',
                  dataIndex: 'seller',
                  key: 'seller',
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

          <TabPane 
            tab={<span><HeartOutlined /> Watchlist</span>} 
            key="watchlist"
          >
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
              dataSource={mockWatchlist}
              renderItem={item => (
                <List.Item>
                  <Card
                    hoverable
                    cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
                    actions={[
                      <Button icon={<EyeOutlined />}>View</Button>,
                      <Button type="primary" icon={<TrophyOutlined />}>Place Bid</Button>
                    ]}
                  >
                    <Card.Meta
                      title={item.name}
                      description={
                        <div className="space-y-2">
                          <div className="font-medium text-lg text-primary-600">${item.price}</div>
                          <div>Seller: {item.seller}</div>
                          <div className="flex items-center">
                            <Rate value={item.rating} disabled allowHalf className="text-sm" />
                            <span className="ml-2 text-gray-500">({item.reviews} reviews)</span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default BuyerDashboard;
