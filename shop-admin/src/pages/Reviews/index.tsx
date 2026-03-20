import { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Input, Rate, message, Space } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import request from '../../api/request'

export default function Reviews() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [replyModal, setReplyModal] = useState(false)
  const [current, setCurrent] = useState<any>(null)
  const [replyText, setReplyText] = useState('')

  const load = () => {
    setLoading(true)
    request.get('/admin/reviews').then((res: any) => {
      if (res.code === 200) setData(res.data || [])
    }).catch(() => setData([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openReply = (record: any) => {
    setCurrent(record)
    setReplyText(record.reply || '')
    setReplyModal(true)
  }

  const handleReply = async () => {
    await request.put(`/admin/reviews/${current.id}/reply`, { reply: replyText })
    message.success('回复成功')
    setReplyModal(false)
    load()
  }

  const columns = [
    { title: '商品ID', dataIndex: 'productId', width: 120 },
    { title: '用户', dataIndex: 'userName' },
    { title: '评分', dataIndex: 'rating', render: (v: number) => <Rate disabled defaultValue={v} style={{ fontSize: 14 }} /> },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (v: number) => (
      <Tag color={v === 1 ? 'green' : v === 0 ? 'orange' : 'red'}>
        {v === 1 ? '已发布' : v === 0 ? '待审核' : '已拒绝'}
      </Tag>
    )},
    { title: '时间', dataIndex: 'createdAt', render: (v: string) => v?.slice(0, 10) },
    { title: '操作', render: (_: any, r: any) => (
      <Space>
        <Button size="small" icon={<StarOutlined />} onClick={() => openReply(r)}>回复</Button>
      </Space>
    )}
  ]

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>评价管理</h2>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      <Modal title="回复评价" open={replyModal} onOk={handleReply} onCancel={() => setReplyModal(false)}>
        <div style={{ marginBottom: 12 }}>
          <p><strong>用户：</strong>{current?.userName}</p>
          <p><strong>内容：</strong>{current?.content}</p>
        </div>
        <Input.TextArea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="输入回复内容..." />
      </Modal>
    </div>
  )
}
