import { server } from './index'

export async function AddFinance(attr) {
  const { data } = await server.post('/finance', attr)

  return data
}

export async function GetAllFinance() {
  const { data } = await server.get('/finance')

  return data
}
