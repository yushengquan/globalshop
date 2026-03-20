import { Layout, Menu, Avatar, Dropdown, theme } from 'antd'
import {
  DashboardOutlined, ShoppingOutlined, OrderedListOutlined,
  TagOutlined, SettingOutlined, LogoutOutlined, UserOutlined,
  InboxOutlined, StarOutlined, CarOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '数据看板' },
  { key: '/products', icon: <ShoppingOutlined />, label: '商品管理' },
  { key: '/orders', icon: <OrderedListOutlined />, label: '订单管理' },
  { key: '/inventory', icon: <InboxOutlined />, label: '库存管理' },
  { key: '/shipping', icon: <CarOutlined />, label: '物流发货' },
  { key: '/reviews', icon: <StarOutlined />, label: '评价管理' },
  { key: '/coupons', icon: <TagOutlined />, label: '优惠码' },
  { key: '/settings', icon: <SettingOutlined />, label: '店铺设置' },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { token } = theme.useToken()

  const userMenu = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录',
      onClick: () => { logout(); navigate('/login') } }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="dark" style={{ background: '#001529' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>🌐 GlobalShop</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: token.colorBgContainer, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #f0f0f0' }}>
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#1a56db' }} />
              <span>{user?.firstName || 'Admin'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, background: token.colorBgContainer, borderRadius: 8, padding: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
