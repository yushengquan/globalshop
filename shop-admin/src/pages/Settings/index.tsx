import { Form, Input, Button, Card, message, Divider } from 'antd'

export default function Settings() {
  const [form] = Form.useForm()

  const onSave = () => {
    message.success('设置已保存')
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 24 }}>店铺设置</h2>
      <Card title="基本信息">
        <Form form={form} layout="vertical" onFinish={onSave}
          initialValues={{ shopName: 'GlobalShop', currency: 'USD', email: 'support@globalshop.com' }}>
          <Form.Item name="shopName" label="店铺名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="客服邮箱">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="currency" label="默认货币">
            <Input disabled />
          </Form.Item>
          <Divider>运费设置</Divider>
          <Form.Item name="freeShippingThreshold" label="免邮门槛（USD）">
            <Input prefix="$" type="number" defaultValue="50" />
          </Form.Item>
          <Form.Item name="standardShippingFee" label="标准运费（USD）">
            <Input prefix="$" type="number" defaultValue="9.99" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存设置</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
