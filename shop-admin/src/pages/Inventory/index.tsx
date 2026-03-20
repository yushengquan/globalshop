import { useEffect, useState } from 'react'
import { Table, Tag, Progress, Input } from 'antd'
import { getProducts } from '../../api/product'

export default function Inventory() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    getProducts({ page: 1, size: 100 }).then((res: any) => {
      if (res.code === 200) setData(res.data.records || [])
    }).finally(() => setLoading(false))
  }, [])

  const filtered = data.filter(d => d.name?.includes(search))

  const columns = [
    { title: '商品名称', dataIndex: 'name', ellipsis: true },
    { title: '当前库存', dataIndex: 'stock', render: (v: number) => (
      <span style={{ color: v < 10 ? '#ff4d4f' : v < 30 ? '#fa8c16' : '#52c41a', fontWeight: 'bold' }}>{v}</span>
    )},
    { title: '库存状态', dataIndex: 'stock', key: 'status', render: (v: number) => (
      <Tag color={v < 10 ? 'red' : v < 30 ? 'orange' : 'green'}>
        {v < 10 ? '紧缺' : v < 30 ? '偏低' : '充足'}
      </Tag>
    )},
    { title: '库存进度', dataIndex: 'stock', key: 'progress', render: (v: number) => (
      <Progress percent={Math.min(100, Math.round(v / 2))} size="small"
        strokeColor={v < 10 ? '#ff4d4f' : v < 30 ? '#fa8c16' : '#52c41a'} showInfo={false} />
    )},
    { title: '已售', dataIndex: 'soldCount' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>库存管理</h2>
        <Input.Search placeholder="搜索商品" style={{ width: 240 }} onSearch={setSearch} allowClear />
      </div>
      <Table dataSource={filtered} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
    </div>
  )
}
