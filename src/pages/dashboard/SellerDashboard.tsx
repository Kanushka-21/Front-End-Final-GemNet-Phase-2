import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, Modal, Form, 
  Input, Select, Upload, InputNumber, 
  message, Tabs, Progress, Alert, Divider, Badge
} from 'antd';
import { 
  PlusOutlined, DollarOutlined, EyeOutlined, EditOutlined, 
  DeleteOutlined, ShopOutlined, CalendarOutlined, UploadOutlined,
  RobotOutlined, TrophyOutlined, LineChartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DetailedGemstone, PricePrediction } from '@/types';
import { api } from '@/services/api';

const { TabPane } = Tabs;
const { Option } = Select;

interface SellerStats {
  totalListings: number;
  activeBids: number;
  totalSales: number;
  revenue: number;
  upcomingMeetings: number;
}

const SellerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<DetailedGemstone[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalListings: 0,
    activeBids: 0,
    totalSales: 0,
    revenue: 0,
    upcomingMeetings: 0
  });
  
  // Add Listing Modal
  const [addListingVisible, setAddListingVisible] = useState(false);
  const [listingForm] = Form.useForm();
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [certificateFile, setCertificateFile] = useState<UploadFile | null>(null);
  
  // ML Price Prediction
  const [priceLoading, setPriceLoading] = useState(false);
  const [pricePrediction, setPricePrediction] = useState<PricePrediction | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsResponse, statsResponse] = await Promise.all([
        api.getSellerListings(),
        api.getSellerStats()
      ]);

      setListings(listingsResponse.data || []);
      setStats(statsResponse.data || stats);
    } catch (error) {
      console.error('Error fetching seller dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePricePrediction = async () => {
    try {
      const values = listingForm.getFieldsValue();
      const { species, variety, weight, color, cut, gemstoneType } = values;
      
      if (!species || !variety || !weight || !color || !cut) {
        message.warning('Please fill in all required fields for price prediction');
        return;
      }

      setPriceLoading(true);
      
      const predictionData = {
        species,
        variety,
        weight,
        color,
        cut,
        certified: gemstoneType === 'certified'
      };      const response = await api.predictPrice(predictionData);
      if (response.data) {
        setPricePrediction(response.data);
        setShowPrediction(true);
        
        // Auto-fill suggested starting price
        listingForm.setFieldsValue({
          startingPrice: response.data.estimatedPrice
        });
      }
      
      message.success('Price prediction generated successfully!');
    } catch (error) {
      console.error('Price prediction error:', error);
      message.error('Failed to generate price prediction');
    } finally {
      setPriceLoading(false);
    }
  };

  const handleSubmitListing = async (values: any) => {
    try {
      const formData = new FormData();
      
      // Add form fields
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (typeof values[key] === 'object' && !(values[key] instanceof Date)) {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        }
      });      // Add images
      uploadedImages.forEach((file) => {
        if (file.originFileObj) {
          formData.append(`images`, file.originFileObj);
        }
      });

      // Add certificate
      if (certificateFile?.originFileObj) {
        formData.append('certificate', certificateFile.originFileObj);
      }

      await api.createListing(formData);
      message.success('Listing created successfully!');
      setAddListingVisible(false);
      listingForm.resetFields();
      setUploadedImages([]);
      setCertificateFile(null);
      setPricePrediction(null);
      setShowPrediction(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating listing:', error);
      message.error('Failed to create listing');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await api.deleteListing(listingId);
      message.success('Listing deleted successfully');
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to delete listing');
    }
  };

  const beforeUpload = (file: RcFile): boolean => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  const listingColumns: ColumnsType<DetailedGemstone> = [
    {
      title: 'Gemstone',
      key: 'gemstone',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img 
            src={record.image} 
            alt={record.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <div className="font-semibold">{record.name}</div>
            <div className="text-gray-500 text-sm">
              {record.species} • {record.weight}ct
              {record.certified && <Badge text="Certified" className="ml-2" />}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="green">ACTIVE</Tag>,
    },
    {
      title: 'Views',
      key: 'views',
      render: () => Math.floor(Math.random() * 100) + 10, // Mock data
    },
    {
      title: 'Bids',
      key: 'bids',
      render: () => Math.floor(Math.random() * 20), // Mock data
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
          <Button size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteListing(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const dashboardStats = [
    {
      title: 'Total Listings',
      value: stats.totalListings,
      icon: <ShopOutlined className="text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Active Bids',
      value: stats.activeBids,
      icon: <TrophyOutlined className="text-green-500" />,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: stats.revenue,
      prefix: '$',
      icon: <DollarOutlined className="text-orange-500" />,
      color: 'orange'
    },
    {
      title: 'Upcoming Meetings',
      value: stats.upcomingMeetings,
      icon: <CalendarOutlined className="text-red-500" />,
      color: 'red'
    }
  ];

  const gemstoneSpecies = [
    'Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Topaz', 'Garnet', 
    'Amethyst', 'Citrine', 'Peridot', 'Aquamarine', 'Tourmaline'
  ];

  const gemstoneColors = [
    'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 
    'White', 'Black', 'Brown', 'Colorless'
  ];

  const gemstoneShapes = [
    'Round', 'Oval', 'Cushion', 'Emerald', 'Princess', 'Asscher',
    'Radiant', 'Pear', 'Marquise', 'Heart'
  ];

  const gemstoneCuts = [
    'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Seller Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your gemstone listings and sales
              </p>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setAddListingVisible(true)}
              className="self-start sm:self-auto"
            >
              Add New Listing
            </Button>
          </div>
        </div>{/* Statistics Cards */}
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

        {/* Main Content */}
        <Card>
          <Tabs defaultActiveKey="listings">
            <TabPane tab="My Listings" key="listings">
              <Table
                columns={listingColumns}
                dataSource={listings}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </TabPane>

            <TabPane tab="Sales Analytics" key="analytics">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Alert
                    message="Sales Performance"
                    description="Your sales analytics and performance metrics will be displayed here."
                    type="info"
                    icon={<LineChartOutlined />}
                  />
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="My Store" key="store">
              <Card title="Store Settings">
                <p>Configure your seller profile and store information here.</p>
              </Card>
            </TabPane>
          </Tabs>
        </Card>

        {/* Add Listing Modal */}
        <Modal
          title="Add New Gemstone Listing"
          open={addListingVisible}
          onCancel={() => {
            setAddListingVisible(false);
            listingForm.resetFields();
            setUploadedImages([]);
            setCertificateFile(null);
            setPricePrediction(null);
            setShowPrediction(false);
          }}
          footer={null}
          width={800}
        >
          <Form
            form={listingForm}
            layout="vertical"
            onFinish={handleSubmitListing}
          >
            {/* Basic Information */}
            <Card size="small" title="Basic Information" className="mb-4">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="gemstoneType"
                    label="Gemstone Type"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select type">
                      <Option value="certified">Certified</Option>
                      <Option value="non-certified">Non-Certified</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="species"
                    label="Species"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select species">
                      {gemstoneSpecies.map(species => (
                        <Option key={species} value={species}>{species}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="variety"
                    label="Variety"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="e.g., Blue Sapphire" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="weight"
                    label="Weight (carats)"
                    rules={[{ required: true }]}
                  >
                    <InputNumber 
                      min={0} 
                      step={0.01} 
                      placeholder="0.00"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="color"
                    label="Color"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select color">
                      {gemstoneColors.map(color => (
                        <Option key={color} value={color}>{color}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="shape"
                    label="Shape"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select shape">
                      {gemstoneShapes.map(shape => (
                        <Option key={shape} value={shape}>{shape}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="cut"
                    label="Cut Quality"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select cut">
                      {gemstoneCuts.map(cut => (
                        <Option key={cut} value={cut}>{cut}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* ML Price Prediction */}
            <Card size="small" title="AI Price Prediction" className="mb-4">
              <div className="text-center mb-4">
                <Button
                  type="primary"
                  icon={<RobotOutlined />}
                  loading={priceLoading}
                  onClick={handlePricePrediction}
                  size="large"
                >
                  Get AI Price Prediction
                </Button>
              </div>

              {showPrediction && pricePrediction && (
                <Alert
                  message="AI Price Prediction"
                  description={
                    <div>
                      <div className="text-lg font-semibold text-green-600 mb-2">
                        Estimated Price: ${pricePrediction.estimatedPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Price Range: ${pricePrediction.priceRange.min.toLocaleString()} - ${pricePrediction.priceRange.max.toLocaleString()}
                      </div>
                      <Progress 
                        percent={pricePrediction.confidence * 100} 
                        format={(percent) => `${percent}% Confidence`}
                        strokeColor="#52c41a"
                      />
                      <Divider />
                      <div className="text-sm">
                        <strong>Key Factors:</strong>
                        <ul className="mt-2">
                          {pricePrediction.factors.map((factor, index) => (
                            <li key={index} className="mb-1">
                              <span className="font-medium">{factor.label}:</span> {factor.description}
                              <span className={`ml-2 ${factor.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ({factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              )}
            </Card>

            {/* Pricing */}
            <Card size="small" title="Pricing & Listing Details" className="mb-4">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="listingType"
                    label="Listing Type"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="fixed">Fixed Price</Option>
                      <Option value="auction">Auction</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="startingPrice"
                    label="Starting Price ($)"
                    rules={[{ required: true }]}
                  >                    <InputNumber 
                      min={1} 
                      className="w-full"
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="listingDuration"
                label="Listing Duration (days)"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value={7}>7 days</Option>
                  <Option value={14}>14 days</Option>
                  <Option value={30}>30 days</Option>
                </Select>
              </Form.Item>
            </Card>

            {/* Images Upload */}
            <Card size="small" title="Images" className="mb-4">
              <Form.Item
                name="images"
                label="Gemstone Images"
                rules={[{ required: true, message: 'Please upload at least one image' }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={uploadedImages}
                  onChange={({ fileList }) => setUploadedImages(fileList)}
                  beforeUpload={beforeUpload}
                  multiple
                  maxCount={5}
                >
                  {uploadedImages.length < 5 && (
                    <div>
                      <UploadOutlined />
                      <div className="mt-2">Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Card>

            {/* Submit */}
            <Form.Item>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setAddListingVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create Listing
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
