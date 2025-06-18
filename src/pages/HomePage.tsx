import React, { useState } from 'react';
import { 
  Layout, Row, Col, Card, Button, Badge, Rate, Tag, Typography, 
  Space, Modal, Input, InputNumber, Statistic, Avatar, Carousel
} from 'antd';
import { 
  EyeOutlined, HeartOutlined, CheckCircleOutlined, UserOutlined, 
  ShoppingCartOutlined, SearchOutlined, LoginOutlined, UserAddOutlined,
  GlobalOutlined, TeamOutlined, ShopOutlined, DollarOutlined,
  StarFilled, ClockCircleOutlined, SafetyOutlined, TrophyOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DetailedGemstone } from '@/types';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGemstone, setSelectedGemstone] = useState<DetailedGemstone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);

  // Mock featured gemstones data
  const featuredGemstones: DetailedGemstone[] = [
    {
      id: '1',
      name: 'Blue Ceylon Sapphire 1',
      price: 1917,
      image: 'https://images.unsplash.com/photo-1612098662204-e95c76707dec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      certified: true,
      weight: 2.41,
      color: 'Blue',
      species: 'Corundum',
      variety: 'Sapphire',
      shape: 'Oval',
      cut: 'Brilliant',
      dimensions: { length: 9.5, width: 7.3, height: 4.8 },
      transparency: 'transparent',
      certificate: {
        issuingAuthority: 'Ceylon Gem Lab',
        reportNumber: 'CGL2024001',
        date: '2024-01-15'
      }
    },
    {
      id: '2',
      name: 'Ruby Star of Ceylon',
      price: 3250,
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      certified: true,
      weight: 4.2,
      color: 'Red',
      species: 'Corundum',
      variety: 'Ruby',
      shape: 'Round',
      cut: 'Brilliant',
      dimensions: { length: 8.2, width: 8.2, height: 5.1 },
      transparency: 'transparent',
      certificate: {
        issuingAuthority: 'GemLab International',
        reportNumber: 'GLI2024055',
        date: '2024-02-10'
      }
    },
    {
      id: '3',
      name: 'Emerald Green Paradise',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1611955167811-4711904bb9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      certified: false,
      weight: 3.8,
      color: 'Green',
      species: 'Beryl',
      variety: 'Emerald',
      shape: 'Emerald',
      cut: 'Step',
      dimensions: { length: 10.1, width: 8.5, height: 6.2 },
      transparency: 'transparent'
    },
    {
      id: '4',
      name: 'Yellow Sapphire Sunshine',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1631982999834-bc0e0c14c916?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      certified: true,
      weight: 2.9,
      color: 'Yellow',
      species: 'Corundum',
      variety: 'Sapphire',
      shape: 'Cushion',
      cut: 'Mixed',
      dimensions: { length: 8.8, width: 7.6, height: 4.9 },
      transparency: 'transparent',
      certificate: {
        issuingAuthority: 'Asian Gemological Institute',
        reportNumber: 'AGI2024089',
        date: '2024-03-05'
      }
    }
  ];

  const statistics = [
    { title: 'Verified Gems', value: 2847, icon: <CheckCircleOutlined className="text-blue-500" /> },
    { title: 'Active Traders', value: 1230, icon: <UserOutlined className="text-green-500" /> },
    { title: 'Successful Sales', value: 892, icon: <TrophyOutlined className="text-orange-500" /> },
    { title: 'Countries Served', value: 45, icon: <GlobalOutlined className="text-purple-500" /> }
  ];

  const testimonials = [
    {
      name: 'Anil Perera',
      role: 'Gem Seller',
      rating: 5,
      comment: 'GemNet has transformed my business. The secure platform and verification system brings trust to online gem sales.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Priya Mendis',
      role: 'Collector',
      rating: 5,
      comment: 'As a gem collector, I appreciate the detailed listings and certification information. GemNet makes it easy to find authentic stones.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Roshan Silva',
      role: 'Jewelry Designer',
      rating: 5,
      comment: 'Finding quality gemstones for my designs used to be challenging. With GemNet, I can source verified gems with confidence.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const handleViewDetails = (gemstone: DetailedGemstone) => {
    setSelectedGemstone(gemstone);
    setIsModalOpen(true);
  };

  const handlePlaceBid = () => {
    // Handle bid placement logic
    setIsModalOpen(false);
    setBidAmount(0);
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <Header className="bg-white shadow-sm border-b border-gray-100 px-6 lg:px-12">
        <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShopOutlined className="text-white text-xl" />
            </div>
            <Title level={3} className="!mb-0 !text-gray-800 font-bold">
              GemNet
            </Title>
          </motion.div>

          <Space size="large" className="hidden md:flex">
            <Button type="text" className="text-gray-600 hover:text-blue-500 font-medium">
              Browse Gems
            </Button>
            <Button type="text" className="text-gray-600 hover:text-blue-500 font-medium">
              How It Works
            </Button>
            <Button type="text" className="text-gray-600 hover:text-blue-500 font-medium">
              About
            </Button>
          </Space>

          <Space>
            <Button 
              icon={<LoginOutlined />} 
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              className="bg-blue-500 hover:bg-blue-600 border-none shadow-lg"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </Space>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <Title level={1} className="!text-white !text-4xl lg:!text-6xl !font-bold !leading-tight">
                    Discover Authentic
                    <span className="block text-yellow-400">Sri Lankan Gems</span>
                  </Title>
                  <Paragraph className="!text-blue-100 !text-lg lg:!text-xl !leading-relaxed">
                    Join the most trusted digital marketplace for authentic gemstones. 
                    Connect with verified sellers and discover rare gems with confidence.
                  </Paragraph>
                  <Space size="large" className="flex-col sm:flex-row">
                    <Button 
                      size="large" 
                      className="bg-yellow-500 border-yellow-500 text-gray-900 hover:bg-yellow-400 font-semibold px-8 h-12"
                      onClick={() => navigate('/marketplace')}
                    >
                      Explore Marketplace
                    </Button>
                    <Button 
                      size="large" 
                      ghost 
                      className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 h-12"
                    >
                      Learn More
                    </Button>
                  </Space>
                </motion.div>
              </Col>
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1612098662204-e95c76707dec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Premium Gemstones"
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full opacity-20 animate-pulse delay-1000"></div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <Row gutter={[32, 32]}>
              {statistics.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-3xl">{stat.icon}</div>
                        <Statistic 
                          value={stat.value} 
                          className="!mb-0"
                          valueStyle={{ 
                            fontSize: '2rem', 
                            fontWeight: 'bold',
                            color: '#1f2937'
                          }}
                        />
                        <Text className="text-gray-600 font-medium">{stat.title}</Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Featured Gemstones */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Title level={2} className="!text-3xl lg:!text-4xl !font-bold !text-gray-800 !mb-4">
                Featured Gemstones
              </Title>
              <Paragraph className="!text-lg !text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked collection of premium gemstones from verified sellers
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {featuredGemstones.map((gemstone, index) => (
                <Col xs={24} sm={12} lg={6} key={gemstone.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                  >                    <Card
                      className="gemstone-card overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                      cover={
                        <div className="relative overflow-hidden">
                          <img
                            alt={gemstone.name}
                            src={gemstone.image}
                            className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {gemstone.certified && (
                            <Badge.Ribbon 
                              text="Certified" 
                              color="blue"
                              className="absolute top-2 right-2"
                            />
                          )}
                          <div className="absolute top-3 left-3">
                            <Button
                              shape="circle"
                              icon={<HeartOutlined />}
                              className="bg-white/90 border-0 shadow-md hover:bg-red-500 hover:text-white transition-colors"
                            />
                          </div>
                        </div>
                      }                      actions={[
                        <div style={{ padding: '0 16px 16px 16px' }}>
                          <Button 
                            type="primary" 
                            block
                            icon={<EyeOutlined />}
                            className="view-details-btn"
                            onClick={() => handleViewDetails(gemstone)}
                          >
                            View Details
                          </Button>
                        </div>
                      ]}
                    >
                      <div className="space-y-3">
                        <Title level={4} className="!mb-2 !text-gray-800">
                          {gemstone.name}
                        </Title>
                        
                        <Text className="text-gray-600 block">
                          Exquisite {gemstone.color} {gemstone.variety} with exceptional clarity and vibrant color.
                        </Text>

                        <div className="flex justify-between items-center">
                          <div>
                            <Text className="text-gray-500 text-sm block">Current Bid</Text>
                            <Title level={3} className="!mb-0 !text-blue-600 !font-bold">
                              ${gemstone.price.toLocaleString()}
                            </Title>
                          </div>
                          <div className="text-right">
                            <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-medium">
                              <ClockCircleOutlined className="mr-1" />
                              Ends 2025-06-20
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <Space>
                            <Tag color="blue">{gemstone.weight} Carat</Tag>
                            <Tag color="purple">{gemstone.variety}</Tag>
                            {gemstone.certified && <Tag color="green">Certified</Tag>}
                          </Space>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span><EyeOutlined className="mr-1" />193 views</span>
                          <span><HeartOutlined className="mr-1" />20 | Bids: 0</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-12">
              <Button 
                size="large" 
                type="primary"
                className="bg-blue-500 border-blue-500 hover:bg-blue-600 px-8 h-12 font-semibold"
                onClick={() => navigate('/marketplace')}
              >
                View All Gemstones
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose GemNet */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="!text-3xl lg:!text-4xl !font-bold !text-gray-800 !mb-4">
                Why Choose GemNet
              </Title>
              <Paragraph className="!text-lg !text-gray-600 max-w-2xl mx-auto">
                GemNet provides a secure, transparent marketplace for authentic gemstones
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              <Col xs={24} md={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4 p-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircleOutlined className="text-blue-500 text-2xl" />
                      </div>
                      <Title level={4} className="!mb-2">Verified Authentication</Title>
                      <Text className="text-gray-600 text-center">
                        Every gemstone undergoes rigorous authentication by certified gemologists
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4 p-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <GlobalOutlined className="text-green-500 text-2xl" />
                      </div>
                      <Title level={4} className="!mb-2">Global Marketplace</Title>
                      <Text className="text-gray-600 text-center">
                        Connect with buyers and sellers from over 45 countries worldwide
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center space-y-4 p-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <ShopOutlined className="text-purple-500 text-2xl" />
                      </div>
                      <Title level={4} className="!mb-2">Premium Selection</Title>
                      <Text className="text-gray-600 text-center">
                        Access to the finest gemstones sourced directly from mines and collectors
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex flex-col items-center space-y-4 p-6">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                        <SafetyOutlined className="text-white text-2xl" />
                      </div>
                      <Title level={4} className="!mb-2">Secure Transactions</Title>
                      <Text className="text-gray-600 text-center">
                        Escrow services and payment protection for all marketplace transactions
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* How GemNet Works */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="!text-white !text-3xl lg:!text-4xl !font-bold !mb-4">
                How GemNet Works
              </Title>
              <Paragraph className="!text-blue-100 !text-lg max-w-2xl mx-auto">
                Simple, secure, and transparent gemstone trading
              </Paragraph>
            </motion.div>

            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center lg:text-left"
                >
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <UserAddOutlined className="text-blue-800 text-2xl" />
                  </div>
                  <Title level={3} className="!text-white !mb-4">Join the Network</Title>
                  <Paragraph className="!text-blue-100 !text-lg">
                    Create an account as a buyer or seller and verify your identity
                  </Paragraph>
                </motion.div>
              </Col>

              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SearchOutlined className="text-blue-800 text-2xl" />
                  </div>
                  <Title level={3} className="!text-white !mb-4">Browse or List Gems</Title>
                  <Paragraph className="!text-blue-100 !text-lg">
                    Explore verified gemstones or list your own for certification
                  </Paragraph>
                </motion.div>
              </Col>

              <Col xs={24} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center lg:text-right"
                >
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <SafetyOutlined className="text-blue-800 text-2xl" />
                  </div>
                  <Title level={3} className="!text-white !mb-4">Secure Transactions</Title>
                  <Paragraph className="!text-blue-100 !text-lg">
                    Complete purchases through our secure escrow system
                  </Paragraph>
                </motion.div>
              </Col>
            </Row>

            <div className="text-center mt-12">
              <Button 
                size="large"
                className="bg-yellow-500 border-yellow-500 text-blue-800 hover:bg-yellow-400 font-semibold px-8 h-12"
                onClick={() => navigate('/register')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Title level={2} className="!text-3xl lg:!text-4xl !font-bold !text-gray-800 !mb-4">
                What Our Members Say
              </Title>
              <Paragraph className="!text-lg !text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied members in our growing gemstone community
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar size={64} src={testimonial.avatar} />
                        <div>
                          <Title level={4} className="!mb-1">{testimonial.name}</Title>
                          <Text className="text-gray-500">{testimonial.role}</Text>
                        </div>
                        <Rate disabled defaultValue={testimonial.rating} className="text-yellow-500" />
                        <Paragraph className="!text-gray-600 italic">
                          "{testimonial.comment}"
                        </Paragraph>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <Title level={2} className="!text-white !text-3xl lg:!text-5xl !font-bold">
                Ready to Join GemNet?
              </Title>
              <Paragraph className="!text-blue-100 !text-lg lg:!text-xl max-w-2xl mx-auto">
                Start buying and selling authentic gemstones in a secure digital marketplace
              </Paragraph>
              <Space size="large" className="flex-col sm:flex-row">
                <Button 
                  size="large"
                  className="bg-yellow-500 border-yellow-500 text-blue-800 hover:bg-yellow-400 font-semibold px-8 h-12"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
                <Button 
                  size="large"
                  ghost
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 h-12"
                  onClick={() => navigate('/marketplace')}
                >
                  Learn More
                </Button>
              </Space>
            </motion.div>
          </div>
        </section>
      </Content>      {/* Gemstone Detail Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedGemstone(null);
          setBidAmount(0);
        }}
        footer={null}
        width={900}
        className="gemstone-detail-modal"
        closeIcon={<CloseOutlined style={{ color: '#333' }} />}
      >
        {selectedGemstone && (
          <div className="gemstone-modal-content">
            <Row gutter={0}>
              <Col xs={24} md={10} className="gemstone-image-col">
                <div className="gemstone-image-container">
                  <img 
                    src={selectedGemstone.image} 
                    alt={selectedGemstone.name}
                    className="gemstone-detail-image"
                  />
                </div>
                <div className="gemstone-stats">
                  <span><EyeOutlined /> 86 views</span>
                  <span>4 bids</span> 
                  <span>9 in watchlists</span>
                </div>
              </Col>

              <Col xs={24} md={14} className="gemstone-details-col">                <div className="details-content">
                  <Space direction="vertical" size={24} style={{ width: '100%', padding: '6px' }}>
                    <div className="gemstone-tabs">
                      <div className="tab active">Details</div>
                      <div className="tab">Certificate</div>
                      <div className="tab">Bid History</div>
                      <div className="tab">Similar Gems</div>
                    </div>
                    
                    <div className="gemstone-main-details">
                      <Title level={2} className="gemstone-title">{selectedGemstone.name}</Title>
                      
                      <div className="gemstone-properties">
                        <div className="detail-row">
                          <div className="detail-label">Type</div>
                          <div className="detail-value">{selectedGemstone.species}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Color</div>
                          <div className="detail-value">{selectedGemstone.color}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Carat</div>
                          <div className="detail-value">{selectedGemstone.weight}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Cut</div>
                          <div className="detail-value">{selectedGemstone.cut}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Origin</div>
                          <div className="detail-value">Balangoda, Sri Lanka</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Certified</div>
                          <div className="detail-value">{selectedGemstone.certified ? 'Yes' : 'No'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="description-section">
                      <div className="section-title">Description</div>
                      <p>Golden {selectedGemstone.color.toLowerCase()} {selectedGemstone.species.toLowerCase()} with exceptional brilliance and excellent clarity. A rare find in this size.</p>
                    </div>
                    
                    <div className="bid-section">
                      <div className="current-auction-info">
                        <div>
                          <div className="info-label">Current Bid</div>
                          <div className="current-price">${selectedGemstone.price.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="info-label">Auction Ends In</div>
                          <div className="auction-time">0 days</div>
                        </div>
                      </div>
                      
                      <div className="place-bid">
                        <div className="section-title">Place Your Bid</div>
                        <div className="bid-inputs">
                          <InputNumber
                            value={bidAmount}
                            onChange={(value) => setBidAmount(value || 0)}
                            min={selectedGemstone.price + 100}
                            style={{ width: '100%', height: '42px' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                          />
                          <Button 
                            type="primary" 
                            className="place-bid-button"
                            onClick={handlePlaceBid}
                            disabled={bidAmount <= selectedGemstone.price}
                          >
                            Place Bid
                          </Button>
                        </div>
                        <div className="min-bid">Minimum bid: ${(selectedGemstone.price + 100).toLocaleString()}</div>
                      </div>
                      
                      <div className="bid-notice">
                        <div className="notice-title">
                          <span>⚠️</span> Important Notice
                        </div>
                        <div className="notice-text">
                          By placing a bid, you agree to our terms and conditions. If you win the bid but 
                          fail to complete the purchase, your account may be restricted from future bidding.
                        </div>
                      </div>
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default HomePage;
