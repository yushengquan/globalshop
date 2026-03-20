import { useEffect, useState } from 'react'
import { Table, Tag, Select, Space, Button, Drawer, Descriptions, message } from 'antd'
import { getOrders, updateOrderStatus } from '../../api/order'

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'orange', PAID: 'blue', SHIPPED: 'purple',
  COMPLETED: 'green', CANCELLED: 'red', REFUNDED: 'default'
}

export default function Orders() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<any>(null)

  const load = () => {
    setLoading(true)
    const params: any = { page, size: 15 }
    if (statusFilter) params.status = statusFilter
    getOrders(params).then((res: any) => {
      if (res.code === 200) { setData(res.data.records || []); setTotal(res.data.total || 0) }
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, statusFilter])

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status)
    message.success('状态已更新')
    load()
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 180 },
    { title: '收货人', dataIndex: 'shippingName' },
    { title: '总金额', dataIndex: 'total', render: (v: number) => `$${v?.toFixed(2)}` },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={STATUS_COLOR[v]}>{v}</Tag> },
    { title: '下单时间', dataIndex: 'createdAt', render: (v: string) => v?.slice(0, 16) },
    { title: '操作', render: (_: any, r: any) => (
      <Space>
        <Button size="small" onClick={() => setDetail(r)}>详情</Button>
        <Select size="small" value={r.status} style={{ width: 110 }}
          onChange={(v) => handleStatusChange(r.id, v)}
          options={['PENDING','PAID','SHIPPED','COMPLETED','CANCELLED'].map(s => ({ value: s, label: s }))} />
      </Space>
    )}
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>订单管理</h2>
        <Select allowClear placeholder="筛选状态" style={{ width: 140 }} onChange={setStatusFilter}
          options={['PENDING','PAID','SHIPPED','COMPLETED','CANCELLED','REFUNDED'].map(s => ({ value: s, label: s }))} />
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading}
        pagination={{ current: page, total, pageSize: 15, onChange: setPage }} />
      <Drawer title="订单详情" open={!!detail} onClose={() => setDetail(null)} width={500}>
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="订单号">{detail.orderNo}</Descriptions.Item>
            <Descriptions.Item label="收货人">{detail.shippingName}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{detail.shippingEmail}</Descriptions.Item>
            <Descriptions.Item label="收货地址">{detail.shippingAddress}, {detail.shippingCity}, {detail.shippingCountry}</Descriptions.Item>
            <Descriptions.Item label="运单号">{detail.trackingNumber || '未填写'}</Descriptions.Item>
            <Descriptions.Item label="小计">${detail.subtotal?.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="运费">${detail.shippingFee?.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="总金额">${detail.total?.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="状态"><Tag color={STATUS_COLOR[detail.status]}>{detail.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}
