import request from './request'

export const getOrders = (params: any) => request.get('/admin/orders', { params })
export const updateOrderStatus = (id: string, status: string) =>
  request.put(`/admin/orders/${id}/status`, null, { params: { status } })
