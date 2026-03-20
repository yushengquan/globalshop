import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import request from '../../api/request'

export default function Blog() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const load = () => {
    setLoading(true)
    request.get('/admin/blog').then((res: any) => {
      if (res.code === 200) setData(res.data || [])
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); form.resetFields(); setModal(true) }
  const openEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setModal(true) }

  const handleSave = async () => {
    const values = await form.validateFields()
    if (editing) {
      await request.put(`/admin/blog/${editing.id}`, values)
    } else {
      await request.post('/admin/blog', values)
    }
    message.success('保存成功')
    setModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    await request.delete(`/admin/blog/${id}`)
    message.success('已删除')
    load()
  }

  const columns = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: 'Slug', dataIndex: 'slug', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (v: number) => (
      <Tag color={v === 1 ? 'green' : 'default'}>{v === 1 ? '已发布' : '草稿'}</Tag>
    )},
    { title: '浏览量', dataIndex: 'viewCount', width: 90 },
    { title: '时间', dataIndex: 'createdAt', render: (v: string) => v?.slice(0, 10), width: 110 },
    { title: '操作', render: (_: any, r: any) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </Space>
    )}
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>Blog 管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新建文章</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      <Modal title={editing ? '编辑文章' : '新建文章'} open={modal} onOk={handleSave}
        onCancel={() => setModal(false)} width={700}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="文章标题" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input placeholder="url-friendly-slug" />
          </Form.Item>
          <Form.Item name="excerpt" label="摘要">
            <Input.TextArea rows={2} placeholder="文章简介" />
          </Form.Item>
          <Form.Item name="coverImage" label="封面图 URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="content" label="正文（HTML）">
            <Input.TextArea rows={6} placeholder="<p>文章内容...</p>" />
          </Form.Item>
          <Form.Item name="tags" label="标签（逗号分隔）">
            <Input placeholder="pets,tips,lifestyle" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={0}>
            <Select options={[{ value: 0, label: '草稿' }, { value: 1, label: '已发布' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
