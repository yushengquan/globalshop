import { useEffect, useState } from 'react'
import { Table, Input, Select, Button, message, Tag } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { getOrders } from '../../api/order'
import request from '../../api/request'

const CARRIERS = ['DHL', 'UPS', 'FedEx', 'USPS', '海运小包', 'EMS', '菜鸟国际']

export default function Shipping() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tracking, setTracking] = useState<Record<string, { number: string; carrier: string }>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getOrders({ page: 1, size: 50, status: 'PAID' }).then((res: any) => {
      if (res.code === 200) setOrders(res.data.records || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleShip = async (orderId: string) => {
    const t = tracking[orderId]
    if (!t?.number) { message.warning('请填写运单号'); return }
    setSubmitting(orderId)
    try {
      await request.put(`/admin/orders/${orderId}/status`, null, { params: { status: 'SHIPPED' } })
      message.success(`订单 ${orderId} 已标记发货`)
      setOrders(orders.filter(o => o.id !== orderId))
    } finally {
      setSubmitting(null)
    }
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 180 },
    { title: '收货人', dataIndex: 'shippingName' },
    { title: '国家', dataIndex: 'shippingCountry', width: 80 },
    { title: '金额', dataIndex: 'total', render: (v: number) => `$${v?.toFixed(2)}` },
    { title: '运单号', key: 'trackingNumber', render: (_: any, r: any) => (
      <Input
        placeholder="填写运单号"
        value={tracking[r.id]?.number || ''}
        onChange={e => setTracking(t => ({ ...t, [r.id]: { ...t[r.id], number: e.target.value } }))}
        style={{ width: 160 }}
      />
    )},
    { title: '物流商', key: 'carrier', render: (_: any, r: any) => (
      <Select
        placeholder="选择物流商"
        value={tracking[r.id]?.carrier}
        onChange={v => setTracking(t => ({ ...t, [r.id]: { ...t[r.id], carrier: v } }))}
        style={{ width: 140 }}
        options={CARRIERS.map(c => ({ value: c, label: c }))}
      />
    )},
    { title: '操作', render: (_: any, r: any) => (
      <Button
        type="primary" size="small" icon={<SendOutlined />}
        loading={submitting === r.id}
        onClick={() => handleShip(r.id)}
      >标记发货</Button>
    )}
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>物流发货</h2>
        <Tag color="orange">待发货订单: {orders.length}</Tag>
      </div>
      <Table dataSource={orders} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
    </div>
  )
}
