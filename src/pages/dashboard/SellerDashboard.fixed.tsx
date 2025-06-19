import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, 
  Tabs, Avatar, Space, Modal, message
} from 'antd';
import { 
  ShopOutlined, DollarOutlined, FileTextOutlined,
  TrophyOutlined, PlusOutlined,
  EditOutlined, EyeOutlined, DeleteOutlined
} from '@ant-design/icons';
import NewGemListingForm from '@/components/forms/NewGemListingForm';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

// Mock data
const mockListings = [
  { 
    id: '1', 
    name: 'Blue Sapphire', 
    image: 'https://via.placeholder.com/100', 
    price: 2500, 
    status: 'active', 
    bids: 5,
    createdAt: '2025-05-15',
    views: 48,
    isCertified: true
  },
  { 
    id: '2', 
    name: 'Ruby', 
    image: 'https://via.placeholder.com/100', 
    price: 3750, 
    status: 'active', 
    bids: 3,
    createdAt: '2025-05-28',
    views: 32,
    isCertified: false
  }
];

const SellerDashboard: React.FC = (): JSX.Element => {
  const [isNewListingModalVisible, setIsNewListingModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');

  // Handler for creating new listing
  const handleNewListing = async (values: any) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call
      console.log('New listing values:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      message.success('Listing created successfully!');
      setIsNewListingModalVisible(false);
    } catch (error) {
      message.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table columns for listings
  const listingsColumns = [
    {
      title: 'Gemstone',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar shape="square" size={40} src={record.image} />
          <div>
            <div className="font-medium">{text}</div>
            <Tag color={record.isCertified ? 'green' : 'orange'}>
              {record.isCertified ? 'Certified' : 'Non-certified'}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'green',
          pending: 'gold',
          sold: 'blue',
        };
        return (
          <Tag color={colors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Bids',
      dataIndex: 'bids',
      key: 'bids',
    },
    {
      title: 'Listed On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => console.log('View', record.id)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit', record.id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('Delete', record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsNewListingModalVisible(true)}
          >
            New Listing
          </Button>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Listings"
                value={mockListings.filter(l => l.status === 'active').length}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Sales"
                value={mockListings.filter(l => l.status === 'sold').length}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Bids"
                value={mockListings.reduce((acc, curr) => acc + curr.bids, 0)}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Reviews"
                value={2}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="My Listings" key="listings">
              <Table
                columns={listingsColumns}
                dataSource={mockListings}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* New Listing Modal */}
        <Modal
          title={null}
          open={isNewListingModalVisible}
          onCancel={() => setIsNewListingModalVisible(false)}
          footer={null}
          width={1000}
          bodyStyle={{ padding: 0 }}
        >
          <NewGemListingForm
            onSubmit={handleNewListing}
            onCancel={() => setIsNewListingModalVisible(false)}
            loading={isSubmitting}
          />
        </Modal>
      </div>
    </div>
  );
};

export default SellerDashboard;
