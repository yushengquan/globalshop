import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import request from '../../api/request'

export default function Coupons() {
  const [data, setData] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const load = () => {
    request.get('/admin/coupons').then((res: any) => {
      if (res.code === 200) setData(res.data || [])
    }).catch(() => setData([]))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    const values = await form.validateFields()
    await request.post('/admin/coupons', values)
    message.success('创建成功')
    setModalOpen(false)
    load()
  }

  const columns = [
    { title: '优惠码', dataIndex: 'code', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '类型', dataIndex: 'type', render: (v: string) => v === 'PERCENTAGE' ? '百分比' : '固定金额' },
    { title: '优惠值', dataIndex: 'value', render: (v: number, r: any) => r.type === 'PERCENTAGE' ? `${v}%` : `$${v}` },
    { title: '最低消费', dataIndex: 'minAmount', render: (v: number) => `$${v}` },
    { title: '已用/限额', render: (_: any, r: any) => `${r.usedCount || 0}/${r.usageLimit || '∞'}` },
    { title: '状态', dataIndex: 'enabled', render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? '启用' : '禁用'}</Tag> },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>优惠码管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true) }}>新建优惠码</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 20 }} />
      <Modal title="新建优惠码" open={modalOpen} onOk={handleSave} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="优惠码" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="类型" initialValue="PERCENTAGE">
            <Select options={[{ value: 'PERCENTAGE', label: '百分比折扣' }, { value: 'FIXED', label: '固定金额' }]} />
          </Form.Item>
          <Form.Item name="value" label="优惠值" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="minAmount" label="最低消费金额" initialValue={0}><InputNumber min={0} prefix="$" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="usageLimit" label="使用次数限制"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
