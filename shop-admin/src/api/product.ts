import request from './request'

export const getProducts = (params: any) => request.get('/admin/products', { params })
export const getProduct = (id: string) => request.get(`/products/${id}`)
export const createProduct = (data: any) => request.post('/admin/products', data)
export const updateProduct = (id: string, data: any) => request.put(`/admin/products/${id}`, data)
export const deleteProduct = (id: string) => request.delete(`/admin/products/${id}`)
export const getCategories = () => request.get('/categories')
