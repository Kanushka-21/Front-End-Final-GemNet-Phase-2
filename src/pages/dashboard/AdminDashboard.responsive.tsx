import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, 
  Tabs, Progress, Divider, Space,
  Modal, Tooltip, Badge, Alert, Input
} from 'antd';
import { 
  UserOutlined, CheckCircleOutlined, ClockCircleOutlined,
  FileTextOutlined, DollarOutlined, EyeOutlined,
  CheckOutlined, CloseOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { confirm } = Modal;

// Mock data
const pendingUsers = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com', role: 'seller', registeredAt: '2025-05-15', status: 'pending' },
  { id: '2', name: 'Emily Wilson', email: 'emily.wilson@example.com', role: 'seller', registeredAt: '2025-05-28', status: 'pending' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'seller', registeredAt: '2025-06-10', status: 'pending' },
];

const pendingListings = [
  { 
    id: '1', 
    name: 'Blue Sapphire', 
    image: 'https://via.placeholder.com/100', 
    price: 2500, 
    seller: 'James Wilson', 
    submittedAt: '2025-06-12', 
    status: 'pending' 
  },
  { 
    id: '2', 
    name: 'Ruby Ring', 
    image: 'https://via.placeholder.com/100', 
    price: 4200, 
    seller: 'Sarah Johnson', 
    submittedAt: '2025-06-14', 
    status: 'pending' 
  }
];

const pendingMeetings = [
  { 
    id: '1', 
    gemstone: 'Blue Sapphire', 
    image: 'https://via.placeholder.com/100',
    buyer: 'Robert Lee',
    seller: 'James Wilson',
    requestedDate: '2025-06-25',
    requestedTime: '10:00 AM',
    location: 'GemNet Office, New York',
    status: 'pending'
  },
  { 
    id: '2', 
    gemstone: 'Diamond Necklace', 
    image: 'https://via.placeholder.com/100',
    buyer: 'Jennifer Smith',
    seller: 'Michael Brown',
    requestedDate: '2025-06-28',
    requestedTime: '2:30 PM',
    location: 'GemNet Office, New York',
    status: 'pending'
  }
];

const recentTransactions = [
  { 
    id: '1', 
    gemstone: 'Ruby', 
    image: 'https://via.placeholder.com/100',
    buyer: 'Alice Smith',
    seller: 'James Wilson',
    amount: 3200,
    date: '2025-06-10',
    status: 'completed',
    commission: 320
  },
  { 
    id: '2', 
    gemstone: 'Emerald', 
    image: 'https://via.placeholder.com/100',
    buyer: 'Robert Johnson',
    seller: 'Sarah Johnson',
    amount: 2800,
    date: '2025-06-05',
    status: 'completed',
    commission: 280
  }
];

const AdminDashboard: React.FC = () => {
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isListingModalVisible, setIsListingModalVisible] = useState(false);
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  
  // Statistics
  const stats = {
    pendingApprovals: pendingUsers.length + pendingListings.length + pendingMeetings.length,
    totalUsers: 125,
    totalListings: 342,
    totalRevenue: 48750,
    commissionRate: 10,
    totalCommission: 4875
  };
  
  // Function to view user details
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsUserModalVisible(true);
  };
  
  // Function to view listing details
  const handleViewListing = (listing: any) => {
    setSelectedListing(listing);
    setIsListingModalVisible(true);
  };
  
  // Function to view meeting details
  const handleViewMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsMeetingModalVisible(true);
  };
  
  // Function to approve a user
  const handleApproveUser = (user: any) => {
    confirm({
      title: 'Approve User',
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      content: `Are you sure you want to approve ${user.name} as a ${user.role}?`,
      onOk() {
        console.log('User approved:', user);
      }
    });
  };
  
  // Function to reject a user
  const handleRejectUser = (user: any) => {
    confirm({
      title: 'Reject User',
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
      content: `Are you sure you want to reject ${user.name}'s ${user.role} application?`,
      onOk() {
        console.log('User rejected:', user);
      }
    });
  };
  
  // Function to approve a listing
  const handleApproveListing = (listing: any) => {
    confirm({
      title: 'Approve Listing',
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      content: `Are you sure you want to approve "${listing.name}" listing by ${listing.seller}?`,
      onOk() {
        console.log('Listing approved:', listing);
      }
    });
  };
  
  // Function to approve a meeting
  const handleApproveMeeting = (meeting: any) => {
    confirm({
      title: 'Approve Meeting',
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      content: `Are you sure you want to approve the meeting between ${meeting.buyer} and ${meeting.seller}?`,
      onOk() {
        console.log('Meeting approved:', meeting);
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl shadow-md relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%231e40af\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          }}
        ></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div className="mb-4 md:mb-0">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
              Admin Dashboard
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Overview
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-md">
              Manage users, listings, and monitor platform activities
            </p>
          </div>
          
          {stats.pendingApprovals > 0 && (
            <Alert
              message={`${stats.pendingApprovals} pending approvals require your attention`}
              type="warning"
              showIcon
              action={
                <Button size="small" type="ghost">
                  View All
                </Button>
              }
            />
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card 
            className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            bordered={false}
            style={{ background: 'linear-gradient(135deg, #3b82f611 0%, #3b82f622 100%)', borderTop: '4px solid #3b82f6' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
                <UserOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Seller/Buyer Ratio</span>
                <span className="text-xs font-medium">40/60</span>
              </div>
              <Progress percent={40} showInfo={false} strokeColor="#3b82f6" trailColor="#e5e7eb" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            bordered={false}
            style={{ background: 'linear-gradient(135deg, #10b98111 0%, #10b98122 100%)', borderTop: '4px solid #10b981' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
                <DollarOutlined style={{ fontSize: '24px', color: '#10b981' }} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-600">
                  System Commission ({stats.commissionRate}%)
                </span>
                <span className="text-xs font-medium text-green-600">
                  ${stats.totalCommission.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            bordered={false}
            style={{ background: 'linear-gradient(135deg, #8b5cf611 0%, #8b5cf622 100%)', borderTop: '4px solid #8b5cf6' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Listings</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalListings}</h3>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
                <FileTextOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Active/Sold Ratio</span>
                <span className="text-xs font-medium">70/30</span>
              </div>
              <Progress percent={70} showInfo={false} strokeColor="#8b5cf6" trailColor="#e5e7eb" size="small" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content - Tabbed Interface */}
      <Card className="mb-6 shadow-md rounded-xl overflow-hidden">
        <Tabs 
          defaultActiveKey="approvals"
          type="card"
          className="custom-tabs"
          size="large"
          animated={{ inkBar: true, tabPane: true }}
          tabBarStyle={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '0 16px' }}
        >
          <TabPane 
            tab={<span className="flex items-center px-1"><ClockCircleOutlined className="mr-2" /> Pending Approvals</span>} 
            key="approvals"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">User Verification Requests</h3>
                <Table 
                  dataSource={pendingUsers}
                  responsive
                  scroll={{ x: 'max-content' }}
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
                      render: (role: string) => <Tag color={role === 'seller' ? 'purple' : 'blue'}>{role.toUpperCase()}</Tag>
                    },
                    {
                      title: 'Registered On',
                      dataIndex: 'registeredAt',
                      key: 'registeredAt',
                      render: date => dayjs(date).format('MMM DD, YYYY')
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={() => handleViewUser(record)}
                            type="default"
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            icon={<CheckOutlined />}
                            onClick={() => handleApproveUser(record)}
                            type="primary"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            icon={<CloseOutlined />}
                            onClick={() => handleRejectUser(record)}
                            danger
                          >
                            Reject
                          </Button>
                        </Space>
                      )
                    }
                  ]}
                  pagination={false}
                />
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Pending Gemstone Listings</h3>
                <Table 
                  dataSource={pendingListings}
                  responsive
                  scroll={{ x: 'max-content' }}
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
                      title: 'Seller',
                      dataIndex: 'seller',
                      key: 'seller',
                    },
                    {
                      title: 'Submitted On',
                      dataIndex: 'submittedAt',
                      key: 'submittedAt',
                      render: date => dayjs(date).format('MMM DD, YYYY')
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={() => handleViewListing(record)}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            icon={<CheckOutlined />}
                            onClick={() => handleApproveListing(record)}
                            type="primary"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            icon={<CloseOutlined />}
                            danger
                          >
                            Reject
                          </Button>
                        </Space>
                      )
                    }
                  ]}
                  pagination={false}
                />
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Meeting Requests</h3>
                <Table 
                  dataSource={pendingMeetings}
                  responsive
                  scroll={{ x: 'max-content' }}
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
                      title: 'Seller',
                      dataIndex: 'seller',
                      key: 'seller',
                    },
                    {
                      title: 'Requested Date',
                      key: 'datetime',
                      render: (_, record) => `${dayjs(record.requestedDate).format('MMM DD, YYYY')} at ${record.requestedTime}`
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={() => handleViewMeeting(record)}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            icon={<CheckOutlined />}
                            onClick={() => handleApproveMeeting(record)}
                            type="primary"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            icon={<CloseOutlined />}
                            danger
                          >
                            Reject
                          </Button>
                        </Space>
                      )
                    }
                  ]}
                  pagination={false}
                />
              </div>
            </div>
          </TabPane>
          
          <TabPane 
            tab={<span className="flex items-center px-1"><DollarOutlined className="mr-2" /> Recent Transactions</span>} 
            key="transactions"
          >
            <Table 
              dataSource={recentTransactions}
              responsive
              scroll={{ x: 'max-content' }}
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
                  title: 'Seller',
                  dataIndex: 'seller',
                  key: 'seller',
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: amount => `$${amount.toLocaleString()}`
                },
                {
                  title: 'Commission',
                  dataIndex: 'commission',
                  key: 'commission',
                  render: commission => `$${commission.toLocaleString()}`
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
                  render: (status: string) => {
                    const statusColors: Record<string, string> = {
                      completed: 'green',
                      pending: 'gold',
                      cancelled: 'red'
                    };
                    return <Tag color={statusColors[status] || 'default'}>{status.toUpperCase()}</Tag>;
                  }
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: () => (
                    <Button size="small" icon={<EyeOutlined />}>
                      Details
                    </Button>
                  )
                }
              ]}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* User Details Modal */}
      <Modal
        visible={isUserModalVisible}
        title="User Verification Details"
        onCancel={() => setIsUserModalVisible(false)}
        footer={[
          <Button key="reject" danger onClick={() => handleRejectUser(selectedUser)}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleApproveUser(selectedUser)}>
            Approve
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Applied Role:</strong> {selectedUser.role}</p>
              <p><strong>Registration Date:</strong> {dayjs(selectedUser.registeredAt).format('MMMM D, YYYY')}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Identity Verification:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-2">
                  <p className="text-sm font-medium mb-1">NIC Front</p>
                  <img 
                    src="https://via.placeholder.com/300x200?text=NIC+Front" 
                    alt="NIC Front"
                    className="w-full h-auto rounded"
                  />
                </div>
                <div className="border rounded-lg p-2">
                  <p className="text-sm font-medium mb-1">NIC Back</p>
                  <img 
                    src="https://via.placeholder.com/300x200?text=NIC+Back" 
                    alt="NIC Back"
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Face Verification:</h4>
              <div className="border rounded-lg p-2">
                <img 
                  src="https://via.placeholder.com/300x300?text=Face+Verification" 
                  alt="Face Verification"
                  className="w-40 h-40 object-cover rounded mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Listing Details Modal */}
      <Modal
        visible={isListingModalVisible}
        title="Gemstone Listing Details"
        onCancel={() => setIsListingModalVisible(false)}
        footer={[
          <Button key="reject" danger>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleApproveListing(selectedListing)}>
            Approve
          </Button>
        ]}
        width={700}
      >
        {selectedListing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img 
                src={selectedListing.image} 
                alt={selectedListing.name}
                className="w-full h-auto rounded-lg"
              />
              <div className="grid grid-cols-3 gap-2">
                <img src="https://via.placeholder.com/100" alt="thumbnail" className="rounded" />
                <img src="https://via.placeholder.com/100" alt="thumbnail" className="rounded" />
                <img src="https://via.placeholder.com/100" alt="thumbnail" className="rounded" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedListing.name}</h2>
              <p className="text-xl text-green-600 font-medium mb-4">${selectedListing.price.toLocaleString()}</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Seller</p>
                  <p>{selectedListing.seller}</p>
                </div>
                <div>
                  <p className="font-medium">Submitted On</p>
                  <p>{dayjs(selectedListing.submittedAt).format('MMMM D, YYYY')}</p>
                </div>
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-gray-600">
                    This is a beautiful natural gemstone with excellent clarity and color. 
                    The gemstone has been certified by the Gemological Institute.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Specifications</p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Weight: 2.5 carats</li>
                    <li>Cut: Oval</li>
                    <li>Clarity: VS</li>
                    <li>Origin: Sri Lanka</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Certification</p>
                  <Badge status="success" text="Certificate Attached" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Meeting Details Modal */}
      <Modal
        visible={isMeetingModalVisible}
        title="Meeting Request Details"
        onCancel={() => setIsMeetingModalVisible(false)}
        footer={[
          <Button key="reject" danger>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleApproveMeeting(selectedMeeting)}>
            Approve
          </Button>
        ]}
        width={600}
      >
        {selectedMeeting && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={selectedMeeting.image} 
                  alt={selectedMeeting.gemstone}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedMeeting.gemstone}</h3>
                  <p className="text-gray-600">Transaction ID: #M{selectedMeeting.id}2023</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Buyer</p>
                  <p className="font-medium">{selectedMeeting.buyer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-medium">{selectedMeeting.seller}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested Date</p>
                  <p className="font-medium">{dayjs(selectedMeeting.requestedDate).format('MMMM D, YYYY')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested Time</p>
                  <p className="font-medium">{selectedMeeting.requestedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedMeeting.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Tag color="gold">{selectedMeeting.status.toUpperCase()}</Tag>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Admin Notes:</h4>
              <Input.TextArea rows={3} placeholder="Add notes for this meeting..." />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
