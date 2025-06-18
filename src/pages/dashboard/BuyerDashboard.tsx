import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Badge, Table, Button, Tag, Modal, Form, Input, Rate, message, Timeline, Tabs } from 'antd';
import { ShoppingOutlined, CalendarOutlined, EyeOutlined, HeartOutlined, TrophyOutlined, StarOutlined, ClockCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks';
import { Bid, Meeting, DetailedGemstone } from '@/types';
import { api } from '@/services/api';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { TextArea } = Input;

interface BidWithGemstone extends Bid {
  gemstone: DetailedGemstone;
  meetingScheduled?: boolean;
}

interface MeetingWithDetails extends Meeting {
  gemstone: DetailedGemstone;
  seller: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<BidWithGemstone[]>([]);
  const [meetings, setMeetings] = useState<MeetingWithDetails[]>([]);
  const [watchlist, setWatchlist] = useState<DetailedGemstone[]>([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithDetails | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bidsResponse, meetingsResponse, watchlistResponse] = await Promise.all([
        api.getUserBids(),
        api.getUserMeetings(),
        api.getUserWatchlist()
      ]);

      setBids(bidsResponse.data || []);
      setMeetings(meetingsResponse.data || []);
      setWatchlist(watchlistResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawBid = async (bidId: string) => {
    try {
      await api.withdrawBid(bidId);
      message.success('Bid withdrawn successfully');
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to withdraw bid');
    }
  };

  const handleSubmitReview = async (values: any) => {
    if (!selectedMeeting) return;

    try {
      await api.submitReview({
        meetingId: selectedMeeting.id,
        sellerId: selectedMeeting.sellerId,
        rating: values.rating,
        comment: values.comment
      });
      message.success('Review submitted successfully');
      setReviewModalVisible(false);
      setSelectedMeeting(null);
      form.resetFields();
      fetchDashboardData();
    } catch (error) {
      message.error('Failed to submit review');
    }
  };

  const bidColumns: ColumnsType<BidWithGemstone> = [
    {
      title: 'Gemstone',
      key: 'gemstone',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img 
            src={record.gemstone.image} 
            alt={record.gemstone.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <div className="font-semibold">{record.gemstone.name}</div>
            <div className="text-gray-500 text-sm">{record.gemstone.species} • {record.gemstone.weight}ct</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Bid Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',      render: (status: 'active' | 'won' | 'lost' | 'withdrawn') => {
        const statusColors: Record<string, string> = {
          active: 'blue',
          won: 'green',
          lost: 'red',
          withdrawn: 'gray'
        };
        return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          {record.status === 'active' && (
            <Button 
              size="small" 
              danger 
              onClick={() => handleWithdrawBid(record.id)}
            >
              Withdraw
            </Button>
          )}
          {record.status === 'won' && !record.meetingScheduled && (
            <Button size="small" type="primary">
              Schedule Meeting
            </Button>
          )}
        </div>
      ),
    },
  ];

  const meetingColumns: ColumnsType<MeetingWithDetails> = [
    {
      title: 'Gemstone',
      key: 'gemstone',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img 
            src={record.gemstone.image} 
            alt={record.gemstone.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <span className="font-medium">{record.gemstone.name}</span>
        </div>
      ),
    },
    {
      title: 'Seller',
      key: 'seller',
      render: (_, record) => `${record.seller.firstName} ${record.seller.lastName}`,
    },
    {
      title: 'Date & Time',
      dataIndex: 'scheduledDateTime',
      key: 'scheduledDateTime',
      render: (dateTime) => dayjs(dateTime).format('MMM DD, YYYY HH:mm'),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',      render: (status: 'scheduled' | 'completed' | 'cancelled') => {
        const statusColors: Record<string, string> = {
          scheduled: 'blue',
          completed: 'green',
          cancelled: 'red'
        };
        return <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          {record.status === 'completed' && (
            <Button 
              size="small" 
              type="primary"
              icon={<StarOutlined />}
              onClick={() => {
                setSelectedMeeting(record);
                setReviewModalVisible(true);
              }}
            >
              Review
            </Button>
          )}
        </div>
      ),
    },
  ];

  const dashboardStats = [
    {
      title: 'Active Bids',
      value: bids.filter(bid => bid.status === 'active').length,
      icon: <ShoppingOutlined className="text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Won Auctions',
      value: bids.filter(bid => bid.status === 'won').length,
      icon: <TrophyOutlined className="text-green-500" />,
      color: 'green'
    },
    {
      title: 'Upcoming Meetings',
      value: meetings.filter(meeting => 
        meeting.status === 'scheduled' && dayjs(meeting.scheduledDateTime).isAfter(dayjs())
      ).length,
      icon: <CalendarOutlined className="text-orange-500" />,
      color: 'orange'
    },
    {
      title: 'Watchlist Items',
      value: watchlist.length,
      icon: <HeartOutlined className="text-red-500" />,
      color: 'red'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">        {/* Welcome Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your bids, meetings, and gemstone purchases
              </p>
            </div>
            <div className="hidden md:block">
              <Button type="primary" size="large" icon={<SearchOutlined />}>
                Browse Marketplace
              </Button>
            </div>
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
                    valueStyle={{ 
                      color: `var(--ant-${stat.color}-6)`,
                      fontSize: '2rem',
                      fontWeight: 'bold' 
                    }}
                  />
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}-50`}>
                    {React.cloneElement(stat.icon, { 
                      style: { fontSize: '1.5rem' } 
                    })}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>        {/* Main Content Tabs */}
        <Card className="shadow-sm rounded-xl overflow-hidden">
          <Tabs 
            defaultActiveKey="bids"
            type="card"
            className="dashboard-tabs"
          >
            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <ShoppingOutlined />
                  My Bids
                </span>
              } 
              key="bids"
            >              <div className="bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-lg font-medium">Your Bidding Activity</h3>
                  <Button type="primary" ghost icon={<ShoppingOutlined />}>
                    Place New Bid
                  </Button>
                </div>
                <Table
                  columns={bidColumns}
                  dataSource={bids}
                  rowKey="id"
                  loading={loading}
                  pagination={{ 
                    pageSize: 10,
                    showSizeChanger: false,
                    className: "pagination-modern"
                  }}
                  className="custom-table"
                  scroll={{ x: 800 }}
                  rowClassName="hover:bg-blue-50 transition-colors"
                />
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Meetings
                </span>
              }
              key="meetings"
            >              <div className="bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-lg font-medium">Your Scheduled Appointments</h3>
                  <Button type="primary" ghost icon={<CalendarOutlined />}>
                    Calendar View
                  </Button>
                </div>
                <Table
                  columns={meetingColumns}
                  dataSource={meetings}
                  rowKey="id"
                  loading={loading}
                  pagination={{ 
                    pageSize: 10,
                    showSizeChanger: false,
                    className: "pagination-modern"
                  }}
                  className="custom-table"
                  scroll={{ x: 800 }}
                  rowClassName="hover:bg-blue-50 transition-colors"
                />
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <HeartOutlined />
                  Watchlist
                </span>
              }
              key="watchlist"
            >
              <Row gutter={[16, 16]}>
                {watchlist.map((gemstone) => (
                  <Col xs={24} sm={12} lg={8} key={gemstone.id}>                    <Card
                      hoverable
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg border-0"
                      bodyStyle={{ padding: '16px' }}
                      cover={
                        <div className="relative">
                          <img
                            alt={gemstone.name}
                            src={gemstone.image}
                            className="h-48 w-full object-cover"
                          />
                          {gemstone.certified && (
                            <Badge.Ribbon text="Certified" color="green" className="z-10" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <div className="flex justify-between items-end">
                              <div>
                                <Tag color="blue" className="mb-1">
                                  {gemstone.species}
                                </Tag>
                              </div>
                              <div className="text-white font-bold text-lg">
                                {gemstone.weight}ct
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      actions={[
                        <EyeOutlined key="view" />,
                        <ShoppingOutlined key="bid" />,
                        <HeartOutlined key="remove" className="text-red-500" />
                      ]}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold line-clamp-1 m-0">
                          {gemstone.name}
                        </h3>
                        <div className="text-lg font-bold text-blue-600">
                          ${gemstone.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Tag color="cyan">{gemstone.cut}</Tag>
                        <Tag color="purple">{gemstone.color}</Tag>
                        <Tag color="orange">{gemstone.shape}</Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>

            <TabPane 
              tab={
                <span className="flex items-center gap-2">
                  <ClockCircleOutlined />
                  Activity
                </span>
              }
              key="activity"
            >
              <Timeline>
                <Timeline.Item color="green" dot={<TrophyOutlined />}>
                  <p>Won auction for Blue Sapphire</p>
                  <p className="text-gray-500">2 hours ago</p>
                </Timeline.Item>
                <Timeline.Item color="blue" dot={<ShoppingOutlined />}>
                  <p>Placed bid on Ruby gemstone</p>
                  <p className="text-gray-500">5 hours ago</p>
                </Timeline.Item>
                <Timeline.Item color="orange" dot={<CalendarOutlined />}>
                  <p>Meeting scheduled with seller</p>
                  <p className="text-gray-500">1 day ago</p>
                </Timeline.Item>
                <Timeline.Item dot={<ClockCircleOutlined />}>
                  <p>Added Emerald to watchlist</p>
                  <p className="text-gray-500">2 days ago</p>
                </Timeline.Item>
              </Timeline>
            </TabPane>
          </Tabs>
        </Card>

        {/* Review Modal */}
        <Modal
          title="Submit Review"
          open={reviewModalVisible}
          onCancel={() => {
            setReviewModalVisible(false);
            setSelectedMeeting(null);
            form.resetFields();
          }}
          footer={null}
        >
          {selectedMeeting && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitReview}
            >
              <div className="mb-4">
                <p><strong>Gemstone:</strong> {selectedMeeting.gemstone.name}</p>
                <p><strong>Seller:</strong> {selectedMeeting.seller.firstName} {selectedMeeting.seller.lastName}</p>
                <p><strong>Meeting Date:</strong> {dayjs(selectedMeeting.scheduledDateTime).format('MMM DD, YYYY')}</p>
              </div>

              <Form.Item
                name="rating"
                label="Rating"
                rules={[{ required: true, message: 'Please provide a rating' }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Review Comment"
                rules={[{ required: true, message: 'Please provide a comment' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Share your experience with this seller and the gemstone quality..."
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setReviewModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit Review
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
