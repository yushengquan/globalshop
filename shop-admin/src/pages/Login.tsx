import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { login } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    try {
      const res: any = await login(values)
      if (res.code === 200) {
        setAuth(res.data.user, res.data.token)
        navigate('/')
      } else {
        message.error(res.msg || '登录失败')
      }
    } catch {
      message.error('登录失败，请检查账号密码')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a56db 0%, #0d3a8a 100%)' }}>
      <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#1a56db' }}>🌐 GlobalShop</h1>
          <p style={{ color: '#888', marginTop: 8 }}>管理后台</p>
        </div>
        <Form form={form} onFinish={onFinish} size="large">
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入邮箱' }]}>
            <Input prefix={<UserOutlined />} placeholder="管理员邮箱" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ height: 44 }}>登录</Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13 }}>默认账号: admin@globalshop.com / admin123</p>
      </Card>
    </div>
  )
}
