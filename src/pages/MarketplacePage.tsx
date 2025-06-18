import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Button, 
  Badge, 
  Rate, 
  Tag, 
  Typography, 
  Space, 
  Slider, 
  Checkbox, 
  Pagination,
  Drawer,
  Modal,
  InputNumber,
  Divider,
  Affix
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  HeartOutlined,
  ShoppingCartOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DetailedGemstone } from '@/types';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGemstone, setSelectedGemstone] = useState<DetailedGemstone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  
  const itemsPerPage = 12;
  
  // Mock gemstone data
  const [gemstones, setGemstones] = useState<DetailedGemstone[]>([]);
  
  useEffect(() => {
    // Simulate loading gemstones from an API
    const mockGemstones: DetailedGemstone[] = Array(24).fill(null).map((_, i) => ({
      id: `${i + 1}`,
      name: ['Blue Sapphire', 'Ruby', 'Emerald', 'Star Sapphire', 'Yellow Sapphire', 'Padparadscha'][i % 6],
      price: Math.floor(Math.random() * 20000) + 1000,
      image: `https://images.unsplash.com/photo-${1500000000 + i * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
      certified: i % 3 === 0,
      weight: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      color: ['Blue', 'Red', 'Green', 'Pink', 'Yellow', 'Purple', 'Orange'][i % 7],
      species: ['Corundum', 'Beryl', 'Quartz', 'Topaz'][i % 4],
      variety: ['Sapphire', 'Ruby', 'Emerald', 'Aquamarine', 'Topaz'][i % 5],
      shape: ['Oval', 'Round', 'Cushion', 'Emerald Cut', 'Pear'][i % 5],
      cut: ['Brilliant', 'Step Cut', 'Mixed', 'Cabochon'][i % 4],
      dimensions: {
        length: parseFloat((Math.random() * 5 + 5).toFixed(1)),
        width: parseFloat((Math.random() * 4 + 4).toFixed(1)),
        height: parseFloat((Math.random() * 3 + 3).toFixed(1))
      },
      transparency: ['transparent', 'translucent'][i % 2] as 'transparent' | 'translucent',
      certificate: i % 3 === 0 ? {
        issuingAuthority: ['GIA', 'GRS', 'SSEF', 'Gubelin'][i % 4],
        reportNumber: `${['GIA', 'GRS', 'SSEF', 'GUB'][i % 4]}${Math.floor(Math.random() * 10000000)}`,
        date: `2024-0${(i % 9) + 1}-${(i % 28) + 1}`
      } : undefined
    }));
    
    setGemstones(mockGemstones);
  }, []);
  
  const handleViewDetails = (gemstone: DetailedGemstone) => {
    setSelectedGemstone(gemstone);
    setIsModalOpen(true);
    setBidAmount(gemstone.price + 100);
  };
  
  const handlePlaceBid = () => {
    console.log(`Bid placed for ${selectedGemstone?.name}: $${bidAmount}`);
    setIsModalOpen(false);
  };
  
  // Filter and sort gemstones
  const filteredGemstones = React.useMemo(() => {
    let filtered = gemstones.filter(gem => {
      const matchesSearch = gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gem.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gem.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gem.variety.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = gem.price >= priceRange[0] && gem.price <= priceRange[1];
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(gem.variety);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(gem.color);
      const matchesCertified = !certifiedOnly || gem.certified;
      
      return matchesSearch && matchesPrice && matchesType && matchesColor && matchesCertified;
    });
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'weight_asc': return a.weight - b.weight;
        case 'weight_desc': return b.weight - a.weight;
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
    
    return filtered;
  }, [gemstones, searchTerm, priceRange, selectedTypes, selectedColors, certifiedOnly, sortBy]);
  
  // Pagination
  const pageCount = Math.ceil(filteredGemstones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGemstones = filteredGemstones.slice(startIndex, startIndex + itemsPerPage);
  
  const FilterPanel = () => (
    <div style={{ padding: '20px 0' }}>
      <Title level={4}>Filters</Title>
      
      <div style={{ marginBottom: 24 }}>
        <Text strong>Price Range</Text>
        <Slider
          range
          min={0}
          max={50000}
          value={priceRange}
          onChange={setPriceRange}
          tooltip={{ formatter: (value) => `$${value?.toLocaleString()}` }}
          style={{ marginTop: 16 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Text type="secondary">${priceRange[0].toLocaleString()}</Text>
          <Text type="secondary">${priceRange[1].toLocaleString()}</Text>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong>Gemstone Type</Text>
        <Checkbox.Group
          options={['Sapphire', 'Ruby', 'Emerald', 'Topaz', 'Aquamarine']}
          value={selectedTypes}
          onChange={setSelectedTypes}
          style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Text strong>Color</Text>
        <Checkbox.Group
          options={['Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange']}
          value={selectedColors}
          onChange={setSelectedColors}
          style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Checkbox
          checked={certifiedOnly}
          onChange={(e) => setCertifiedOnly(e.target.checked)}
        >
          <Text strong>Certified Only</Text>
        </Checkbox>
      </div>

      <Button 
        block 
        onClick={() => {
          setPriceRange([0, 50000]);
          setSelectedTypes([]);
          setSelectedColors([]);
          setCertifiedOnly(false);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  const GemstoneCard = ({ gemstone }: { gemstone: DetailedGemstone }) => (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >      <Card
        hoverable
        className="gemstone-card"
        style={{ height: '100%', borderRadius: 12 }}
        cover={
          <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
            <img 
              alt={gemstone.name} 
              src={gemstone.image}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            {gemstone.certified && (
              <Badge.Ribbon text="Certified" color="blue" />
            )}
            <div style={{ 
              position: 'absolute', 
              top: 10, 
              left: 10,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12
            }}>
              <EyeOutlined style={{ marginRight: 4 }} />
              {Math.floor(Math.random() * 200) + 50}
            </div>
            <Button
              icon={<HeartOutlined />}
              shape="circle"
              size="small"
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(255,255,255,0.9)'
              }}
            />
          </div>
        }
        actions={[          <div style={{ padding: '0 16px 16px 16px' }}>
            <Button 
              type="primary" 
              block
              size="middle"
              onClick={() => handleViewDetails(gemstone)}
              className="view-details-btn"
              style={{ 
                height: '36px',
                fontSize: '14px',
                borderRadius: '4px',
                width: '100%',
                margin: 0
              }}
            >
              View Details
            </Button>
          </div>
        ]}
      >
        <Meta
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong style={{ color: '#1890ff' }}>{gemstone.name}</Text>
              <Tag color={gemstone.color.toLowerCase()}>{gemstone.color}</Tag>
            </div>
          }
          description={
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {gemstone.weight} Carat • {gemstone.variety} • {gemstone.shape}
              </Text>
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  ${gemstone.price.toLocaleString()}
                </Text>
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  Current Bid
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Rate disabled defaultValue={5} style={{ fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {Math.floor(Math.random() * 20) + 1} bids
                </Text>
              </div>
            </div>
          }
        />
      </Card>
    </motion.div>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Affix offsetTop={0}>
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                size="large"
                placeholder="Search gemstones..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                size="large"
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                suffixIcon={<SortAscendingOutlined />}
              >
                <Option value="price_asc">Price: Low to High</Option>
                <Option value="price_desc">Price: High to Low</Option>
                <Option value="weight_asc">Weight: Low to High</Option>
                <Option value="weight_desc">Weight: High to Low</Option>
                <Option value="name_asc">Name: A to Z</Option>
                <Option value="name_desc">Name: Z to A</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Space>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setIsFilterDrawerOpen(true)}
                  style={{ display: 'block' }}
                >
                  Filters
                </Button>
                <Button.Group>
                  <Button 
                    icon={<AppstoreOutlined />}
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                  />
                  <Button 
                    icon={<BarsOutlined />}
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                  />
                </Button.Group>
              </Space>
            </Col>
          </Row>
        </div>
      </Affix>

      <Layout>
        {/* Desktop Sidebar */}
        <Sider 
          width={280} 
          style={{ 
            background: '#fff',
            height: 'calc(100vh - 80px)',
            overflow: 'auto',
            display: 'none'
          }}
          className="desktop-only"
        >
          <FilterPanel />
        </Sider>

        <Content style={{ padding: '24px' }}>
          {/* Results Summary */}
          <div style={{ marginBottom: 24 }}>
            <Title level={3}>Gemstone Marketplace</Title>
            <Text type="secondary">
              Showing {Math.min(filteredGemstones.length, startIndex + 1)}-{Math.min(startIndex + itemsPerPage, filteredGemstones.length)} of {filteredGemstones.length} results
            </Text>
          </div>

          {/* Gemstones Grid */}
          {paginatedGemstones.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedGemstones.map((gemstone) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={gemstone.id}>
                    <GemstoneCard gemstone={gemstone} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Pagination
                  current={currentPage}
                  total={filteredGemstones.length}
                  pageSize={itemsPerPage}
                  onChange={setCurrentPage}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Title level={3} type="secondary">No gemstones found</Title>
              <Paragraph type="secondary">
                Try adjusting your search criteria or filters
              </Paragraph>
            </div>
          )}
        </Content>
      </Layout>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
        width={320}
      >
        <FilterPanel />
      </Drawer>      {/* Gemstone Detail Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
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

              <Col xs={24} md={14} className="gemstone-details-col">
                <div className="details-content">
                  <Space direction="vertical" size={24} style={{ width: '100%' }}>
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

      <style>{`
        @media (min-width: 768px) {
          .desktop-only {
            display: block !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default MarketplacePage;
