import request from './request'

export const login = (data: { email: string; password: string }) =>
  request.post('/auth/login', data)
