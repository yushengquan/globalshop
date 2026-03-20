import { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Input, Select, message, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import request from '../../api/request'

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '待处理', color: 'orange' },
  1: { label: '已批准', color: 'green' },
  2: { label: '已拒绝', color: 'red' },
  3: { label: '已退款', color: 'blue' },
}

export default function Refunds() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [current, setCurrent] = useState<any>(null)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<number>(1)

  const load = () => {
    setLoading(true)
    request.get('/admin/refunds').then((res: any) => {
      if (res.code === 200) setData(res.data || [])
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openHandle = (record: any, s: number) => {
    setCurrent(record); setNote(''); setStatus(s); setModal(true)
  }

  const handleOk = async () => {
    await request.put(`/admin/refunds/${current.id}/handle`, { status, note })
    message.success('处理成功'); setModal(false); load()
  }

  const columns = [
    { title: '订单ID', dataIndex: 'orderId', width: 140 },
    { title: '退款原因', dataIndex: 'reason' },
    { title: '金额', dataIndex: 'amount', render: (v: number) => v ? `$${v.toFixed(2)}` : '-' },
    { title: '状态', dataIndex: 'status', render: (v: number) => {
      const s = statusMap[v] || { label: '未知', color: 'default' }
      return <Tag color={s.color}>{s.label}</Tag>
    }},
    { title: '申请时间', dataIndex: 'createdAt', render: (v: string) => v?.slice(0, 10) },
    { title: '操作', render: (_: any, r: any) => r.status === 0 ? (
      <Space>
        <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => openHandle(r, 1)}>批准</Button>
        <Button size="small" danger icon={<CloseOutlined />} onClick={() => openHandle(r, 2)}>拒绝</Button>
      </Space>
    ) : <span style={{ color: '#bbb' }}>已处理</span> }
  ]

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>退款管理</h2>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      <Modal title="处理退款" open={modal} onOk={handleOk} onCancel={() => setModal(false)}>
        <p><strong>原因：</strong>{current?.reason}</p>
        <p><strong>描述：</strong>{current?.description}</p>
        <div style={{ marginTop: 12 }}>
          <p>处理结果：</p>
          <Select value={status} onChange={setStatus} style={{ width: '100%', marginBottom: 8 }}
            options={[{ value: 1, label: '批准退款' }, { value: 2, label: '拒绝申请' }, { value: 3, label: '已退款' }]} />
          <Input.TextArea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="备注（可选）" />
        </div>
      </Modal>
    </div>
  )
}
