import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Button, Tag, 
  Tabs, List, Avatar, Badge, Progress, Divider, Space,
  Modal, Form, Input, InputNumber, Select, Upload, message,
  DatePicker, Radio, Checkbox
} from 'antd';
import { 
  ShopOutlined, DollarOutlined, FileTextOutlined,
  CalendarOutlined, TrophyOutlined, PlusOutlined,
  EditOutlined, EyeOutlined, DeleteOutlined,
  UploadOutlined, InboxOutlined
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
  // State for the new listing modal
  const [isNewListingModalVisible, setIsNewListingModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCertified, setIsCertified] = useState<boolean>(false);
  const [predictedPriceRange, setPredictedPriceRange] = useState<{min: number, max: number} | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Statistics
  const stats = {
    activeListings: 3,
    pendingBids: 1,
    upcomingMeetings: 2,
    totalRevenue: 12500
  };
  
  // Function to handle opening the new listing modal
  const showNewListingModal = () => {
    setIsNewListingModalVisible(true);
    setCurrentStep(0);
    setPredictedPriceRange(null);
  };
  
  // Function to handle closing the new listing modal
  const handleCancel = () => {
    setIsNewListingModalVisible(false);
    form.resetFields();
    setImageUrl(null);
    setIsCertified(false);
    setPredictedPriceRange(null);
    setCurrentStep(0);
  };
  
  // Function to handle certification selection
  const handleCertificationChange = (value: boolean) => {
    setIsCertified(value);
    form.resetFields(['gemType', 'weight', 'color', 'clarity', 'cut', 'shape', 'origin', 'treatment']);
  };
  
  // Function to predict price based on gemstone attributes
  const handlePredictPrice = async () => {
    try {
      // Validate form fields first
      await form.validateFields([
        'gemType', 'weight', 'color', 'clarity', 'cut', 'shape', 
        'origin', 'treatment', ...(isCertified ? ['certificateProvider', 'certificateNumber'] : [])
      ]);
      
      setIsPredicting(true);
      
      // This would normally be an API call to the ML model
      // For demonstration, we'll simulate a prediction based on gem type and weight
      const formValues = form.getFieldsValue();
      const mockPrediction = () => {
        const basePrice = {
          'sapphire': 1000,
          'ruby': 1500,
          'emerald': 1200,
          'diamond': 2000,
          'other': 800
        }[formValues.gemType] || 500;
        
        const weight = parseFloat(formValues.weight) || 1;
        const certificationMultiplier = isCertified ? 1.3 : 1;
        
        const minPrice = Math.round(basePrice * weight * certificationMultiplier * 0.8);
        const maxPrice = Math.round(basePrice * weight * certificationMultiplier * 1.2);
        
        return { min: minPrice, max: maxPrice };
      };
      
      // Simulate API call delay
      setTimeout(() => {
        const prediction = mockPrediction();
        setPredictedPriceRange(prediction);
        setIsPredicting(false);
        
        // Pre-fill the price field with the average of min and max
        form.setFieldsValue({
          price: Math.round((prediction.min + prediction.max) / 2)
        });
        
        // Move to the next step after prediction
        setCurrentStep(1);
      }, 1500);
      
    } catch (error) {
      message.error('Please fill in all required fields before predicting price');
    }
  };
  
  // Function to handle form submission
  const handleSubmit = (values: any) => {
    console.log('Submitted form values:', values);
    message.success('New gemstone listing created successfully!');
    setIsNewListingModalVisible(false);
    form.resetFields();
    setImageUrl(null);
    setIsCertified(false);
    setPredictedPriceRange(null);
    setCurrentStep(0);
  };
  
  // Function to handle image upload
  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      // Get the uploaded file URL (in a real app, this would come from your server)
      // For now, we'll use a placeholder for demonstration
      setImageUrl('https://via.placeholder.com/400');
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
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
            <Button type="primary" icon={<PlusOutlined />} onClick={showNewListingModal}>
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
      
      {/* Add New Listing Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>Add New Gemstone Listing</span>
            <div className="steps-indicator flex space-x-1">
              {[0, 1].map(step => (
                <div 
                  key={step}
                  className={`w-3 h-3 rounded-full ${currentStep >= step ? 'bg-blue-500' : 'bg-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        }
        open={isNewListingModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          {currentStep === 0 ? (
            // Step 1: Gemstone Details
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Certification Status</h3>
                <p className="text-gray-600 mb-4">
                  Please select whether your gemstone is certified or non-certified. This will determine
                  the required information for your listing.
                </p>
                
                <Form.Item 
                  name="isCertified" 
                  rules={[{ required: true, message: 'Please select certification status' }]
                  }
                  className="mb-0"
                >
                  <Radio.Group onChange={e => handleCertificationChange(e.target.value)}>
                    <Space direction="vertical">
                      <Radio value={true}>
                        <span className="font-medium">Certified</span> - The gemstone has been evaluated and certified by a recognized gemological laboratory
                      </Radio>
                      <Radio value={false}>
                        <span className="font-medium">Non-certified</span> - The gemstone has not been certified by a gemological laboratory
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>
              
              {/* Gemstone Images */}
              <Form.Item
                name="images"
                label={<span className="text-base font-medium">Gemstone Images</span>}
                rules={[{ required: true, message: 'Please upload at least one image' }]}
                className="mb-6"
              >
                <Upload.Dragger
                  name="file"
                  multiple={true}
                  action="/api/upload" // This would be your actual upload endpoint
                  onChange={handleUpload}
                  showUploadList={true}
                  beforeUpload={() => false} // Prevent actual upload for demo
                  className="mb-4"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag files to this area to upload</p>
                  <p className="ant-upload-hint">
                    Upload high quality images of your gemstone from multiple angles
                  </p>
                </Upload.Dragger>
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={<span className="text-base font-medium">Gemstone Name</span>}
                    rules={[{ required: true, message: 'Please enter a name' }]}
                  >
                    <Input placeholder="E.g., Ceylon Blue Sapphire" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gemType"
                    label={<span className="text-base font-medium">Gemstone Type</span>}
                    rules={[{ required: true, message: 'Please select a type' }]}
                  >
                    <Select placeholder="Select gemstone type">
                      <Select.Option value="sapphire">Sapphire</Select.Option>
                      <Select.Option value="ruby">Ruby</Select.Option>
                      <Select.Option value="emerald">Emerald</Select.Option>
                      <Select.Option value="diamond">Diamond</Select.Option>
                      <Select.Option value="topaz">Topaz</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="weight"
                    label={<span className="text-base font-medium">Weight (carats)</span>}
                    rules={[{ required: true, message: 'Please enter weight' }]}
                  >
                    <InputNumber min={0.01} step={0.01} placeholder="2.5" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="color"
                    label={<span className="text-base font-medium">Color</span>}
                    rules={[{ required: true, message: 'Please enter color' }]}
                  >
                    <Input placeholder="E.g., Deep Blue" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="clarity"
                    label={<span className="text-base font-medium">Clarity</span>}
                    rules={[{ required: true, message: 'Please select clarity' }]}
                  >
                    <Select placeholder="Select clarity">
                      <Select.Option value="flawless">Flawless</Select.Option>
                      <Select.Option value="vvs">VVS</Select.Option>
                      <Select.Option value="vs">VS</Select.Option>
                      <Select.Option value="si">SI</Select.Option>
                      <Select.Option value="included">Included</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="cut"
                    label={<span className="text-base font-medium">Cut</span>}
                    rules={[{ required: true, message: 'Please select cut' }]}
                  >
                    <Select placeholder="Select cut type">
                      <Select.Option value="brilliant">Brilliant</Select.Option>
                      <Select.Option value="step">Step</Select.Option>
                      <Select.Option value="mixed">Mixed</Select.Option>
                      <Select.Option value="cabochon">Cabochon</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="shape"
                    label={<span className="text-base font-medium">Shape</span>}
                    rules={[{ required: true, message: 'Please select shape' }]}
                  >
                    <Select placeholder="Select shape">
                      <Select.Option value="round">Round</Select.Option>
                      <Select.Option value="oval">Oval</Select.Option>
                      <Select.Option value="cushion">Cushion</Select.Option>
                      <Select.Option value="emerald">Emerald</Select.Option>
                      <Select.Option value="pear">Pear</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="origin"
                    label={<span className="text-base font-medium">Origin</span>}
                    rules={[{ required: true, message: 'Please enter origin' }]}
                  >
                    <Select placeholder="Select origin">
                      <Select.Option value="sri_lanka">Sri Lanka</Select.Option>
                      <Select.Option value="burma">Burma (Myanmar)</Select.Option>
                      <Select.Option value="thailand">Thailand</Select.Option>
                      <Select.Option value="india">India</Select.Option>
                      <Select.Option value="afghanistan">Afghanistan</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="treatment"
                    label={<span className="text-base font-medium">Treatment</span>}
                    rules={[{ required: true, message: 'Please select treatment status' }]}
                  >
                    <Select placeholder="Select treatment status">
                      <Select.Option value="none">None (Natural)</Select.Option>
                      <Select.Option value="heat">Heat Treated</Select.Option>
                      <Select.Option value="irradiated">Irradiated</Select.Option>
                      <Select.Option value="fracture_filled">Fracture Filled</Select.Option>
                      <Select.Option value="oiled">Oiled</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="transparency"
                    label={<span className="text-base font-medium">Transparency</span>}
                    rules={[{ required: true, message: 'Please select transparency' }]}
                  >
                    <Select placeholder="Select transparency">
                      <Select.Option value="transparent">Transparent</Select.Option>
                      <Select.Option value="translucent">Translucent</Select.Option>
                      <Select.Option value="opaque">Opaque</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              {/* Certification Details - Only show if certified is selected */}
              {isCertified && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Certification Details</h3>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="certificateProvider"
                        label="Certification Authority"
                        rules={[{ required: isCertified, message: 'Please select certification authority' }]}
                      >
                        <Select placeholder="Select certification authority">
                          <Select.Option value="gia">GIA</Select.Option>
                          <Select.Option value="igi">IGI</Select.Option>
                          <Select.Option value="grs">GRS</Select.Option>
                          <Select.Option value="aigs">AIGS</Select.Option>
                          <Select.Option value="cgl">CGL (Ceylon Gem Laboratory)</Select.Option>
                          <Select.Option value="other">Other</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="certificateNumber"
                        label="Certificate Number"
                        rules={[{ required: isCertified, message: 'Please enter certificate number' }]}
                      >
                        <Input placeholder="E.g., GIA6204562789" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="certificateDate"
                        label="Certificate Date"
                        rules={[{ required: isCertified, message: 'Please select certificate date' }]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="certificateImage"
                        label="Certificate Image"
                        rules={[{ required: isCertified, message: 'Please upload certificate image' }]}
                      >
                        <Upload
                          name="certificate"
                          listType="picture"
                          maxCount={1}
                          beforeUpload={() => false}
                        >
                          <Button icon={<UploadOutlined />}>Upload Certificate</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}
                            
              <div className="flex justify-end mt-6">
                <Button 
                  type="primary" 
                  onClick={handlePredictPrice}
                  loading={isPredicting}
                  className="min-w-[150px]"
                >
                  {isPredicting ? 'Predicting...' : 'Predict Price'}
                </Button>
              </div>
            </>
          ) : (
            // Step 2: Pricing and Additional Details
            <>
              {/* Price Prediction Results */}
              {predictedPriceRange && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">AI Price Prediction</h3>
                  <p className="text-gray-600 mb-4">
                    Based on your gemstone's attributes, our AI model suggests the following price range:
                  </p>
                  
                  <div className="flex justify-center items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Minimum</div>
                      <div className="text-2xl font-bold text-green-600">${predictedPriceRange.min}</div>
                    </div>
                    
                    <div className="h-10 border-r border-gray-300"></div>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Maximum</div>
                      <div className="text-2xl font-bold text-green-600">${predictedPriceRange.max}</div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    This prediction is based on historical data and current market trends.
                    You can still set your own price below.
                  </p>
                </div>
              )}
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label={<span className="text-base font-medium">Listing Price (USD)</span>}
                    rules={[{ required: true, message: 'Please enter a price' }]}
                  >
                    <InputNumber
                      min={1}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="auctionDuration"
                    label={<span className="text-base font-medium">Auction Duration</span>}
                    rules={[{ required: true, message: 'Please select auction duration' }]}
                  >
                    <Select placeholder="Select auction duration">
                      <Select.Option value={7}>7 days</Select.Option>
                      <Select.Option value={14}>14 days</Select.Option>
                      <Select.Option value={30}>30 days</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="description"
                label={<span className="text-base font-medium">Description</span>}
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <Input.TextArea 
                  rows={5} 
                  placeholder="Provide a detailed description of your gemstone including special features, history, etc."
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="dimensions"
                    label={<span className="text-base font-medium">Dimensions (mm)</span>}
                    tooltip="Format: Length x Width x Height"
                  >
                    <Input placeholder="E.g., 8.5 x 6.4 x 4.3" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="additionalTags"
                    label={<span className="text-base font-medium">Additional Tags</span>}
                    tooltip="Tags to help buyers find your gemstone"
                  >
                    <Select mode="tags" placeholder="E.g., rare, vintage, unheated">
                      <Select.Option value="rare">Rare</Select.Option>
                      <Select.Option value="vintage">Vintage</Select.Option>
                      <Select.Option value="unheated">Unheated</Select.Option>
                      <Select.Option value="investment">Investment Grade</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider />
              
              <Form.Item
                name="termsAgreed"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms')),
                  },
                ]}
              >
                <Checkbox>
                  I agree to the <a href="#">Terms and Conditions</a> for selling gemstones, including
                  the commission fee for successful sales and the authenticity guarantee.
                </Checkbox>
              </Form.Item>
              
              <div className="flex justify-between mt-6">
                <Button onClick={() => setCurrentStep(0)}>
                  Back to Details
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit Listing
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SellerDashboard;
