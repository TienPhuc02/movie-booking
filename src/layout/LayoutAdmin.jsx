import React, { useState } from 'react';
import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  GlobalOutlined,
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
import { Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: '1',
    icon: (
      <Link to={'/admin/user'}>
        <UserOutlined />
      </Link>
    ),
    label: 'Quản lý người dùng'
  },
  {
    key: '2',
    icon: (
      <Link to={'/admin/movie'}>
        <VideoCameraOutlined />
      </Link>
    ),
    label: 'Quản lý phim'
  },
  {
    key: '3',
    icon: (
      <Link to={'/admin/cinemas'}>
        <EnvironmentOutlined />
      </Link>
    ),
    label: 'Quản lý rạp phim'
  },
  {
    key: '4',
    icon: (
      <Link to={'/admin/screen'}>
        <PlaySquareOutlined />
      </Link>
    ),
    label: 'Quản lý phòng chiếu phim'
  },
  {
    key: '5',
    icon: (
      <Link to={'/admin/schedule'}>
        <CalendarOutlined />
      </Link>
    ),
    label: 'Quản lý lịch chiếu phim'
  },
  {
    key: '6',
    icon: (
      <Link to={'/admin/showtime'}>
       <UnorderedListOutlined />
      </Link>
    ),
    label: 'Quản lý suất chiếu phim'
  },
  {
    key: '7',
    icon: (
      <Link to={'/admin/order'}>
        <ShoppingCartOutlined />
      </Link>
    ),
    label: 'Quản lý đơn hàng'
  },
  {
    key: '8',
    icon: (
      <Link to={'/admin/ticketprice'}>
        <DollarOutlined />
      </Link>
    ),
    label: 'Quản lý giá vé'
  },
  {
    key: '9',
    icon: (
      <Link to={'/admin/coupon'}>
        <PercentageOutlined />
      </Link>
    ),
    label: 'Quản lý khuyến mãi'
  },
  {
    key: '10',
    icon: (
      <Link to={'/admin/news'}>
        <FileSearchOutlined />
      </Link>
    ),
    label: 'Quản lý tin tức'
  },
  {
    key: '11',
    icon: (
      <Link to={'/admin/genre'}>
        <VideoCameraAddOutlined />
      </Link>
    ),
    label: 'Quản lý thể loại'
  },
  {
    key: '12',
    icon: (
      <Link to={'/admin/region'}>
        <GlobalOutlined />
      </Link>
    ),
    label: 'Quản lý quốc gia'
  },
  {
    key: '13',
    icon: (
      <Link to={'/admin/director'}>
        <IdcardOutlined />
      </Link>
    ),
    label: 'Quản lý đạo diễn'
  },
  {
    key: '14',
    icon: (
      <Link to={'/admin/cast'}>
        <UserSwitchOutlined />
      </Link>
    ),
    label: 'Quản lý diễn viên'
  },
  {
    key: '15',
    icon: (
      <Link to={'/admin/combo'}>
        <TableOutlined />
      </Link>
    ),
    label: 'Quản lý combo-nước'
  }
];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

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
          <div
            style={{
              padding: 24,
              minHeight: '75vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              
            }}
          >
            <Outlet />
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
