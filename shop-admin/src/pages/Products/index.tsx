import { useEffect, useState } from 'react'
import { Table, Button, Space, Popconfirm, message, Tag, Image, Modal, Form, Input, InputNumber, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../api/product'

export default function Products() {
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [form] = Form.useForm()

  const load = () => {
    setLoading(true)
    getProducts({ page, size: 10 }).then((res: any) => {
      if (res.code === 200) { setData(res.data.records || []); setTotal(res.data.total || 0) }
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    getCategories().then((res: any) => { if (res.code === 200) setCategories(res.data || []) })
  }, [page])

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true) }

  const handleSave = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateProduct(editing.id, values)
      message.success('更新成功')
    } else {
      await createProduct(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    message.success('删除成功')
    load()
  }

  const columns = [
    { title: '图片', dataIndex: 'mainImage', render: (v: string) => <Image src={v} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 6 }} fallback="https://picsum.photos/50" /> },
    { title: '商品名称', dataIndex: 'name', ellipsis: true },
    { title: '价格', dataIndex: 'price', render: (v: number) => `$${v}` },
    { title: '库存', dataIndex: 'stock' },
    { title: '已售', dataIndex: 'soldCount' },
    { title: '状态', dataIndex: 'status', render: (v: string) => <Tag color={v === 'ACTIVE' ? 'green' : 'default'}>{v}</Tag> },
    { title: '操作', render: (_: any, r: any) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
        <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </Space>
    )}
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>商品管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增商品</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading}
        pagination={{ current: page, total, pageSize: 10, onChange: setPage }} />
      <Modal title={editing ? '编辑商品' : '新增商品'} open={modalOpen}
        onOk={handleSave} onCancel={() => setModalOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="分类">
            <Select options={categories.map(c => ({ value: c.id, label: c.name }))} />
          </Form.Item>
          <Space style={{ width: '100%' }} size={12}>
            <Form.Item name="price" label="售价" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="comparePrice" label="原价" style={{ flex: 1 }}>
              <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stock" label="库存" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="mainImage" label="主图URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="shortDescription" label="简短描述">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="ACTIVE">
            <Select options={[{ value: 'ACTIVE', label: '上架' }, { value: 'DRAFT', label: '草稿' }, { value: 'ARCHIVED', label: '下架' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
