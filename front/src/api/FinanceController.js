import { server } from './index'

export async function AddFinance(attr) {
  let authorization = localStorage.auth_token

  const { data } = await server.post('/finance', attr, { headers: { authorization } })

  return data
}

export async function GetAllFinance() {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/finance', { headers: { authorization } })

  return data
}
