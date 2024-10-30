import React, { useState } from 'react';
import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PercentageOutlined,
  PlaySquareOutlined,
  ShoppingCartOutlined,
  TableOutlined,
  UnorderedListOutlined,
  UserOutlined,
  UserSwitchOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const items = [
  { key: '1', icon: <UserOutlined />, label: 'Quản lý người dùng', link: '/admin/user' },
  { key: '2', icon: <VideoCameraOutlined />, label: 'Quản lý phim', link: '/admin/movie' },
  { key: '3', icon: <EnvironmentOutlined />, label: 'Quản lý rạp phim', link: '/admin/cinemas' },
  { key: '4', icon: <PlaySquareOutlined />, label: 'Quản lý phòng chiếu phim', link: '/admin/screen' },
  { key: '5', icon: <CalendarOutlined />, label: 'Quản lý lịch chiếu phim', link: '/admin/schedule' },
  { key: '6', icon: <UnorderedListOutlined />, label: 'Quản lý suất chiếu phim', link: '/admin/showtime' },
  { key: '7', icon: <ShoppingCartOutlined />, label: 'Quản lý đơn hàng', link: '/admin/order' },
  { key: '8', icon: <DollarOutlined />, label: 'Quản lý giá vé', link: '/admin/ticketprice' },
  { key: '9', icon: <PercentageOutlined />, label: 'Quản lý khuyến mãi', link: '/admin/coupon' },
  { key: '10', icon: <FileSearchOutlined />, label: 'Quản lý tin tức', link: '/admin/news' },
  { key: '11', icon: <VideoCameraAddOutlined />, label: 'Quản lý thể loại', link: '/admin/genre' },
  { key: '12', icon: <GlobalOutlined />, label: 'Quản lý quốc gia', link: '/admin/region' },
  { key: '13', icon: <IdcardOutlined />, label: 'Quản lý đạo diễn', link: '/admin/director' },
  { key: '14', icon: <UserSwitchOutlined />, label: 'Quản lý diễn viên', link: '/admin/cast' },
  { key: '15', icon: <TableOutlined />, label: 'Quản lý combo-nước', link: '/admin/combo' }
].map(item => ({
  key: item.key,
  icon: <Link to={item.link}>{item.icon}</Link>,
  label: item.label,
}));

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    setSelectedMenuItem(selectedItem ? selectedItem.label : '');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
      >
        <div className="demo-logo-vertical flex justify-center items-center py-8">
          {/* Admin DashBoard */}
        </div>
        <Menu
          theme="light"
          className="h-full"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ margin: '8px' }}>
            <Breadcrumb.Item>
              <Link to="/admin/user" onClick={() => handleMenuClick({ key: '1' })}>
                <HomeOutlined /> Admin
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{selectedMenuItem}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: '75vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet/>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
