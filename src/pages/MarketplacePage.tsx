import React, { useState, useEffect } from 'react';
import { 
  Layout as AntLayout, 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Typography, 
  Space, 
  Slider, 
  Checkbox, 
  Pagination,
  Drawer,
  Modal,
  InputNumber,
  Affix
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  HeartOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { DetailedGemstone } from '@/types';
import GemstoneCard from '@/components/ui/GemstoneCard';
import GemstoneDetailModal from '@/components/home/GemstoneDetailModal';

const { Content } = AntLayout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGemstone, setSelectedGemstone] = useState<DetailedGemstone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [drawerWidth, setDrawerWidth] = useState(320);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState<number>(0);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  
  // Handle responsive drawer width
  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth > 576 ? 320 : window.innerWidth * 0.8);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const itemsPerPage = 12;
  
  // Mock gemstone data
  const [gemstones, setGemstones] = useState<DetailedGemstone[]>([]);
  
  useEffect(() => {
    // Simulate loading gemstones from an API
    const mockGemstones: DetailedGemstone[] = Array(24).fill(null).map((_, i) => {
      const basePrice = Math.floor(Math.random() * 20000) + 1000;
      return {
        id: `${i + 1}`,
        name: ['Blue Sapphire', 'Ruby', 'Emerald', 'Star Sapphire', 'Yellow Sapphire', 'Padparadscha'][i % 6],
        price: basePrice,
        predictedPriceRange: {
          min: Math.floor(basePrice * 0.9),
          max: Math.floor(basePrice * 1.2)
        },
        image: `https://images.unsplash.com/photo-${1500000000 + i * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        certified: i % 3 === 0,
        weight: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
        color: ['Blue', 'Red', 'Green', 'Pink', 'Yellow', 'Purple', 'Orange'][i % 7],
        species: ['Corundum', 'Beryl', 'Quartz', 'Topaz'][i % 4],
        variety: ['Sapphire', 'Ruby', 'Emerald', 'Aquamarine', 'Topaz'][i % 5],
        shape: ['Oval', 'Round', 'Cushion', 'Emerald Cut', 'Pear'][i % 5],
        cut: ['Brilliant', 'Step Cut', 'Mixed', 'Cabochon'][i % 4],
        clarity: ['VS', 'VVS', 'SI', 'I'][i % 4],
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
      };
    });
    
    setGemstones(mockGemstones);
  }, []);
  
  const handleViewDetails = (gemstoneId: string) => {
    console.log('View details clicked for gemstone:', gemstoneId);
    const gemstone = gemstones.find(g => g.id === gemstoneId);
    if (gemstone) {
      console.log('Setting selected gemstone:', gemstone);
      setSelectedGemstone(gemstone);
      setIsModalOpen(true);
      setBidAmount(gemstone.price);
    }
  };

  const handlePlaceBid = (amount: number) => {
    console.log('Placing bid:', amount);
    setPendingBidAmount(amount);
    setIsTermsModalOpen(true);
  };

  const handleConfirmBid = () => {
    console.log('Confirming bid:', pendingBidAmount);
    setIsTermsModalOpen(false);
    setIsModalOpen(false);
  };

  // Format helper function
  const formatLKR = (price: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter and sort gemstones
  const filteredGemstones = React.useMemo(() => {
    let filtered = gemstones.filter(gem => {
      const matchesSearch = gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gem.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (gem.species?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGemstones = filteredGemstones.slice(startIndex, startIndex + itemsPerPage);
  
  // Filter Panel Component
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
          onChange={(value) => setPriceRange(value as [number, number])}
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
  
  return (
    <AntLayout className="min-h-screen bg-gray-50">
      <Content>        {/* Search & Filters Bar */}
        <Affix offsetTop={0}>
          <div style={{ 
            background: '#fff', 
            padding: '12px 0',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            width: '100%'
          }}>
            <div className="container-fluid">
              <div className="marketplace-search-container">
                <Row gutter={[16, 16]} align="middle" className="marketplace-header">
                  <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                    <Input
                      size="large"
                      placeholder="Search gemstones..."
                      prefix={<SearchOutlined style={{ color: '#2871FA' }} />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      allowClear
                      className="search-input"
                    />
                  </Col>
                  <Col xs={14} sm={16} md={8} lg={6} xl={4}>
                    <Select
                      size="large"
                      value={sortBy}
                      onChange={setSortBy}
                      style={{ width: '100%' }}
                      suffixIcon={<SortAscendingOutlined />}
                      className="sort-select"
                      dropdownMatchSelectWidth={false}
                    >
                      <Option value="price_asc">Price: Low to High</Option>
                      <Option value="price_desc">Price: High to Low</Option>
                      <Option value="weight_asc">Weight: Low to High</Option>
                      <Option value="weight_desc">Weight: High to Low</Option>
                      <Option value="name_asc">Name: A to Z</Option>
                      <Option value="name_desc">Name: Z to A</Option>
                    </Select>
                  </Col>
                  <Col xs={10} sm={8} md={4} lg={4} xl={3}>
                    <div className="marketplace-controls">
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="filter-button"
                      >
                        Filters
                      </Button>
                      <Button.Group className="view-mode-buttons">
                      <Button 
                        icon={<AppstoreOutlined />}
                        type={viewMode === 'grid' ? 'primary' : 'default'}
                        onClick={() => setViewMode('grid')}
                      />                      <Button 
                        icon={<BarsOutlined />}
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                      />                    </Button.Group>
                    </div>
                </Col>
              </Row>
              </div>
            </div>
          </div>
        </Affix>

        {/* Main Content */}        <section className="py-8">
          <div className="container-fluid px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
            {/* Results Summary */}
            <div className="mb-6">
              <Title level={3} className="!mb-1">Gemstone Marketplace</Title>
              <Text type="secondary">
                Showing {Math.min(filteredGemstones.length, startIndex + 1)}-{Math.min(startIndex + itemsPerPage, filteredGemstones.length)} of {filteredGemstones.length} results
              </Text>
            </div>
            
            {/* Gemstones Grid */}
            {paginatedGemstones.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedGemstones.map((gemstone) => (
                    <GemstoneCard
                      key={gemstone.id}
                      gemstone={gemstone}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Debug info */}
                <div style={{ display: 'none' }}>
                  Modal open: {String(isModalOpen)}, 
                  Selected gemstone: {selectedGemstone?.name || 'none'}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-10">
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
          </div>
        </section>
      </Content>
        {/* Mobile Filter Drawer */}
      <Drawer
        title={
          <div className="drawer-title">
            <span>Filters</span>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={() => setIsFilterDrawerOpen(false)}
              className="close-drawer-button" 
            />
          </div>
        }
        placement="left"
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
        width={drawerWidth}
        className="marketplace-filter-drawer"
        closeIcon={null}
      >
        <FilterPanel />
      </Drawer>
      
      {/* Gemstone Detail Modal */}
      {selectedGemstone && (
        <GemstoneDetailModal
          isOpen={isModalOpen}
          gemstone={selectedGemstone}
          onClose={() => {
            console.log('Closing detail modal');
            setIsModalOpen(false);
            setSelectedGemstone(null);
          }}
          onPlaceBid={handlePlaceBid}
        />
      )}

      {/* Terms and Conditions Modal */}
      <Modal
        title="Terms and Conditions"
        open={isTermsModalOpen}
        onCancel={() => setIsTermsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            type="default"
            onClick={() => setIsTermsModalOpen(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleConfirmBid}
          >
            I Agree & Place Bid
          </Button>
        ]}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Before placing your bid, please agree to the following terms:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your bid is legally binding and cannot be retracted</li>
            <li>If you win, you agree to complete the purchase within 48 hours</li>
            <li>You must verify your identity and payment method before the bid is accepted</li>
            <li>All transactions are subject to GemNet's marketplace policies</li>
            <li>Bidding amount: {formatLKR(pendingBidAmount)}</li>
          </ul>
          <p className="text-secondary-600 mt-4">
            By clicking "I Agree & Place Bid", you acknowledge that you have read and agree to these terms.
          </p>
        </div>
      </Modal>
      
        <style>
        {`
          /* Search bar and filters styling */
          .marketplace-search-container {
            padding: 8px 0;
          }
          
          .search-input .ant-input {
            border-radius: 8px;
            border-color: #e6e8eb;
          }
          
          .search-input .ant-input:hover,
          .search-input .ant-input:focus {
            border-color: #2871FA;
            box-shadow: 0 0 0 2px rgba(40, 113, 250, 0.1);
          }
          
          .sort-select .ant-select-selector {
            border-radius: 8px !important;
            border-color: #e6e8eb !important;
          }
          
          .sort-select .ant-select-selector:hover,
          .sort-select.ant-select-focused .ant-select-selector {
            border-color: #2871FA !important;
            box-shadow: 0 0 0 2px rgba(40, 113, 250, 0.1) !important;
          }
          
          .filter-button {
            border-radius: 8px;
            margin-right: 8px;
            border-color: #e6e8eb;
            display: flex;
            align-items: center;
          }
          
          .filter-button:hover {
            border-color: #2871FA;
            color: #2871FA;
          }
          
          .view-mode-buttons .ant-btn:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          
          .view-mode-buttons .ant-btn:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }
            .marketplace-controls {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          
          /* Drawer styling */
          .drawer-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-weight: 600;
            font-size: 18px;
          }
          
          .close-drawer-button {
            margin-right: -8px;
            padding: 4px 8px;
            color: #666;
          }
          
          .marketplace-filter-drawer .ant-drawer-body {
            padding-top: 0;
          }

          @media (max-width: 992px) {
            .marketplace-header .ant-row {
              margin-bottom: 0 !important;
            }
          }
          
          @media (max-width: 768px) {
            .filter-button {
              margin-right: 8px;
            }
            
            .marketplace-controls {
              justify-content: flex-start;
            }
          }
          
          @media (max-width: 576px) {
            .gemstone-card-container {
              padding: 0 4px !important;
              margin-bottom: 16px;
            }
            
            .gemstone-card .ant-card-meta-title {
              font-size: 16px !important;
            }
            
            .gemstone-card .ant-card-meta-description {
              font-size: 13px !important;
            }
            
            .gemstone-card-motion-wrapper {
              width: 100%;
            }
            
            .search-input, .sort-select {
              margin-bottom: 8px;
            }
            
            .ant-pagination-item {
              margin: 0 2px !important;
            }
            
            .gemstone-card .ant-space {
              flex-wrap: wrap;
            }
          }
        `}</style>
    </AntLayout>
  );
};

export default MarketplacePage;
