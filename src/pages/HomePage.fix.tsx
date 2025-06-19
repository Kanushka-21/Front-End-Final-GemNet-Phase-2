import React, { useState } from 'react';
import { 
  Row, Col, Card, Badge, Rate, Tag, Typography, 
  Space, Modal, Input, InputNumber, Statistic, Avatar, Carousel, Drawer
} from 'antd';
import Button from '@/components/ui/Button';
import { 
  EyeOutlined, HeartOutlined, CheckCircleOutlined, UserOutlined, 
  ShoppingCartOutlined, SearchOutlined, LoginOutlined, UserAddOutlined,
  GlobalOutlined, TeamOutlined, ShopOutlined, DollarOutlined,
  StarFilled, ClockCircleOutlined, SafetyOutlined, TrophyOutlined,
  CloseOutlined, MenuOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DetailedGemstone } from '@/types';
import { MainLayout } from '@/components/layout';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGemstone, setSelectedGemstone] = useState<DetailedGemstone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { title: 'Verified Gems', value: 2847, icon: <CheckCircleOutlined className="text-black" /> },
    { title: 'Active Traders', value: 1230, icon: <UserOutlined className="text-black" /> },
    { title: 'Successful Sales', value: 892, icon: <TrophyOutlined className="text-black" /> },
    { title: 'Countries Served', value: 45, icon: <GlobalOutlined className="text-black" /> }
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <MainLayout transparentHeader={true}>
      {/* Hero Section */}
      <section className="relative bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 lg:py-32">
          <Row gutter={[24, 32]} align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 md:space-y-6 text-center md:text-left"
              >
                <Title level={1} className="!text-black !text-3xl sm:!text-4xl lg:!text-6xl !font-bold !leading-tight">
                  Discover Authentic
                  <span className="block text-black">Sri Lankan Gems</span>
                </Title>
                <Paragraph className="!text-black !text-base sm:!text-lg lg:!text-xl !leading-relaxed">
                  Join the most trusted digital marketplace for authentic gemstones. 
                  Connect with verified sellers and discover rare gems with confidence.
                </Paragraph>
                <Space size="middle" className="flex flex-col sm:flex-row w-full sm:w-auto justify-center md:justify-start">
                  <Button 
                    size="large" 
                    className="bg-primary-600 border-primary-600 text-white hover:bg-primary-700 font-semibold px-8 h-12 w-full sm:w-auto"
                    onClick={() => navigate('/marketplace')}
                  >
                    Explore Marketplace
                  </Button>
                  <Button 
                    size="large" 
                    variant="outline"
                    className="border-primary-600 text-black hover:bg-primary-600 hover:text-white font-semibold px-8 h-12 w-full sm:w-auto"
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
                className="relative mx-auto max-w-sm md:max-w-none"
              >
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1612098662204-e95c76707dec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Premium Gemstones"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-200/20 to-secondary-50/30 -z-10 rounded-2xl transform translate-x-4 translate-y-4"></div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Title level={2} className="!text-black !font-bold !text-3xl md:!text-4xl">
              Trusted Platform for Gemstone Trading
            </Title>
            <Paragraph className="!text-black !text-lg max-w-2xl mx-auto">
              Our blockchain-based verification system ensures authenticity and builds trust between buyers and sellers.
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]} className="mt-8">
            {statistics.map((stat, index) => (
              <Col key={index} xs={12} md={6}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white shadow-md rounded-xl p-6 text-center h-full border border-gray-100"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                  <Statistic 
                    value={stat.value} 
                    title={<span className="text-black font-medium">{stat.title}</span>} 
                    valueStyle={{ fontSize: 28, fontWeight: 700, color: 'black' }} 
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Gemstones Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Title level={2} className="!text-black !font-bold !text-3xl md:!text-4xl">
              Featured Gemstones
            </Title>
            <Paragraph className="!text-black !text-lg max-w-2xl mx-auto">
              Explore our curated selection of premium Sri Lankan gemstones verified for quality and authenticity.
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]} className="mt-8">
            {featuredGemstones.map((gemstone, index) => (
              <Col key={gemstone.id} xs={24} sm={12} lg={6}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    hoverable
                    cover={
                      <div className="relative pt-[75%] overflow-hidden">
                        <img
                          alt={gemstone.name}
                          src={gemstone.image}
                          className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        {gemstone.certified && (
                          <Badge 
                            count={<CheckCircleOutlined style={{ color: 'white' }} />}
                            className="absolute top-2 right-2 bg-green-500"
                          />
                        )}
                      </div>
                    }
                    bodyStyle={{ padding: '16px' }}
                    className="h-full"
                    actions={[
                      <div key="view" onClick={() => handleViewDetails(gemstone)} className="flex items-center justify-center text-black">
                        <EyeOutlined className="mr-1" /> View
                      </div>,
                      <div key="fav" className="flex items-center justify-center text-black">
                        <HeartOutlined className="mr-1" /> Save
                      </div>
                    ]}
                  >
                    <Meta
                      title={
                        <div className="flex justify-between items-start">
                          <Text className="font-medium text-black line-clamp-1">{gemstone.name}</Text>
                        </div>
                      }
                      description={
                        <div className="space-y-2">
                          <Text className="text-black font-bold block text-lg">
                            ${gemstone.price.toLocaleString()}
                          </Text>
                          <div className="flex flex-wrap gap-1">
                            <Tag color="default" className="text-black">{gemstone.variety}</Tag>
                            <Tag color="default" className="text-black">{gemstone.weight}ct</Tag>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
          
          <div className="mt-12 text-center">
            <Button 
              size="large" 
              className="border-primary-600 text-black hover:bg-primary-600 hover:text-white font-semibold px-8"
              onClick={() => navigate('/marketplace')}
            >
              View All Gemstones
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="!text-black !font-bold !text-3xl md:!text-4xl">
              How GemNet Works
            </Title>
            <Paragraph className="!text-black !text-lg max-w-2xl mx-auto">
              A transparent process that ensures authenticity and builds trust.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} className="mt-8">
            <Col xs={24} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-gray-100 h-full flex flex-col text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                    <SafetyOutlined className="text-2xl text-black" />
                  </div>
                </div>
                <Title level={4} className="!text-black mb-3">Gem Certification</Title>
                <Paragraph className="!text-black flex-grow">
                  Each gemstone undergoes rigorous testing and certification 
                  by accredited gemological laboratories to verify authenticity and quality.
                </Paragraph>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-gray-100 h-full flex flex-col text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                    <ShopOutlined className="text-2xl text-black" />
                  </div>
                </div>
                <Title level={4} className="!text-black mb-3">Seller Verification</Title>
                <Paragraph className="!text-black flex-grow">
                  We verify all sellers on our platform through a multi-step 
                  process including trade license verification and trade history reviews.
                </Paragraph>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-gray-100 h-full flex flex-col text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                    <DollarOutlined className="text-2xl text-black" />
                  </div>
                </div>
                <Title level={4} className="!text-black mb-3">Secure Transactions</Title>
                <Paragraph className="!text-black flex-grow">
                  Our blockchain-based escrow system protects buyers and sellers, 
                  releasing funds only when all conditions of the sale are met.
                </Paragraph>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="!text-black !font-bold !text-3xl md:!text-4xl">
              What Our Users Say
            </Title>
            <Paragraph className="!text-black !text-lg max-w-2xl mx-auto">
              Hear from buyers and sellers who use GemNet to trade gemstones with confidence.
            </Paragraph>
          </div>
          
          <Carousel autoplay className="pb-12">
            <div>
              <Row gutter={[24, 24]} className="px-4">
                {testimonials.map((testimonial, index) => (
                  <Col key={index} xs={24} md={8}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col"
                    >
                      <div className="mb-4 flex items-center">
                        <Avatar src={testimonial.avatar} size={48} />
                        <div className="ml-4">
                          <Text strong className="block text-black">{testimonial.name}</Text>
                          <Text className="text-black">{testimonial.role}</Text>
                        </div>
                      </div>
                      <Rate disabled defaultValue={testimonial.rating} className="mb-4" />
                      <Paragraph className="!text-black flex-grow">
                        "{testimonial.comment}"
                      </Paragraph>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl"
          >
            <Title level={2} className="!text-black !font-bold !text-3xl md:!text-4xl mb-6">
              Ready to Discover Authentic Sri Lankan Gemstones?
            </Title>
            <Paragraph className="!text-black !text-lg max-w-2xl mx-auto mb-8">
              Join GemNet today and connect with verified sellers offering premium gemstones with guaranteed authenticity.
            </Paragraph>
            <Space size="large" className="flex flex-col sm:flex-row justify-center">
              <Button 
                size="large" 
                className="bg-primary-600 border-primary-600 text-white hover:bg-primary-700 font-semibold px-8 h-12"
                onClick={() => navigate('/marketplace')}
              >
                Explore Marketplace
              </Button>
              <Button 
                size="large" 
                className="border-primary-600 text-black hover:bg-primary-600 hover:text-white font-semibold px-8 h-12"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </Space>
          </motion.div>
        </div>
      </section>

      {/* Gemstone Detail Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedGemstone(null);
          setBidAmount(0);
        }}
        footer={null}
        width="95%"
        style={{ maxWidth: '1000px' }}
        closeIcon={<CloseOutlined className="text-black" />}
      >
        {selectedGemstone && (
          <div className="p-4">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <img
                  src={selectedGemstone.image}
                  alt={selectedGemstone.name}
                  className="w-full rounded-lg"
                />
              </Col>
              <Col xs={24} md={12}>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <Title level={2} className="!text-black !mb-1">{selectedGemstone.name}</Title>
                    {selectedGemstone.certified && (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        Certified
                      </Tag>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Title level={3} className="!text-black !mb-0">
                      ${selectedGemstone.price.toLocaleString()}
                    </Title>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <Text className="block text-black font-medium">Weight</Text>
                      <Text className="text-black">{selectedGemstone.weight} carats</Text>
                    </div>
                    <div>
                      <Text className="block text-black font-medium">Color</Text>
                      <Text className="text-black">{selectedGemstone.color}</Text>
                    </div>
                    <div>
                      <Text className="block text-black font-medium">Species</Text>
                      <Text className="text-black">{selectedGemstone.species}</Text>
                    </div>
                    <div>
                      <Text className="block text-black font-medium">Variety</Text>
                      <Text className="text-black">{selectedGemstone.variety}</Text>
                    </div>
                    <div>
                      <Text className="block text-black font-medium">Shape</Text>
                      <Text className="text-black">{selectedGemstone.shape}</Text>
                    </div>
                    <div>
                      <Text className="block text-black font-medium">Cut</Text>
                      <Text className="text-black">{selectedGemstone.cut}</Text>
                    </div>
                    <div className="col-span-2">
                      <Text className="block text-black font-medium">Dimensions</Text>
                      <Text className="text-black">
                        {selectedGemstone.dimensions.length} x {selectedGemstone.dimensions.width} x {selectedGemstone.dimensions.height} mm
                      </Text>
                    </div>
                  </div>

                  {selectedGemstone.certificate && (
                    <div className="border-t border-gray-200 pt-4">
                      <Title level={5} className="!text-black !mb-2">Certificate Information</Title>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Text className="block text-black font-medium">Authority</Text>
                          <Text className="text-black">{selectedGemstone.certificate.issuingAuthority}</Text>
                        </div>
                        <div>
                          <Text className="block text-black font-medium">Report Number</Text>
                          <Text className="text-black">{selectedGemstone.certificate.reportNumber}</Text>
                        </div>
                        <div>
                          <Text className="block text-black font-medium">Date</Text>
                          <Text className="text-black">{selectedGemstone.certificate.date}</Text>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <Title level={5} className="!text-black !mb-3">Place a Bid</Title>
                    <div className="flex items-center space-x-2">
                      <InputNumber
                        min={selectedGemstone.price}
                        value={bidAmount || selectedGemstone.price}
                        onChange={(value) => setBidAmount(value as number)}
                        addonBefore="$"
                        style={{ width: '180px' }}
                        className="text-black"
                      />
                      <Button 
                        size="large"
                        className="bg-primary-600 border-primary-600 text-white hover:bg-primary-700 font-medium"
                        onClick={handlePlaceBid}
                      >
                        Place Bid
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default HomePage;
