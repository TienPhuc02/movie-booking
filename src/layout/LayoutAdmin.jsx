import React, { useState } from 'react';
import {
  EnvironmentOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
    label: 'User'
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
      <Link to={'/admin/genre'}>
        <VideoCameraAddOutlined />
      </Link>
    ),
    label: 'Quản lý thể loại'
  },
  {
    key: '5',
    icon: (
      <Link to={'/admin/region'}>
        <GlobalOutlined />
      </Link>
    ),
    label: 'Quản lý quốc gia'
  },
  {
    key: '6',
    icon: (
      <Link to={'/admin/director'}>
        <IdcardOutlined />
      </Link>
    ),
    label: 'Quản lý đạo diễn'
  },
  {
    key: '7',
    icon: (
      <Link to={'/admin/cast'}>
        <UserSwitchOutlined />
      </Link>
    ),
    label: 'Quản lý diễn viên'
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
              borderRadius: borderRadiusLG
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
