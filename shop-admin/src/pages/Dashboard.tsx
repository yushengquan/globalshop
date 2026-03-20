import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table } from 'antd'
import { ShoppingOutlined, DollarOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getOrders } from '../api/order'

const mockTrend = [
  { date: '03/15', sales: 1200 }, { date: '03/16', sales: 1900 }, { date: '03/17', sales: 1500 },
  { date: '03/18', sales: 2800 }, { date: '03/19', sales: 2200 }, { date: '03/20', sales: 3100 }, { date: '03/21', sales: 2600 },
]

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getOrders({ page: 1, size: 10 }).then((res: any) => {
      if (res.code === 200) { setOrders(res.data.records || []); setTotal(res.data.total || 0) }
    }).catch(() => {})
  }, [])

  const pending = orders.filter(o => o.status === 'PENDING').length
  const gmv = orders.reduce((s: number, o: any) => s + (o.total || 0), 0)

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
    { title: '金额', dataIndex: 'total', key: 'total', render: (v: number) => `$${v?.toFixed(2)}` },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => v?.slice(0, 10) },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 'bold' }}>数据看板</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="今日GMV" value={gmv.toFixed(2)} prefix={<DollarOutlined />} valueStyle={{ color: '#1a56db' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="总订单数" value={total} prefix={<ShoppingOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待处理订单" value={pending} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="库存预警" value={0} prefix={<WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="近7天销售趋势">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v: any) => [`$${v}`, '销售额']} />
                <Line type="monotone" dataKey="sales" stroke="#1a56db" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="最近订单" style={{ height: '100%' }}>
            <Table dataSource={orders.slice(0, 5)} columns={columns} pagination={false} size="small" rowKey="id" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
