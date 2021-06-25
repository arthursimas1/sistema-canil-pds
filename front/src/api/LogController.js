import { server } from './index'

export async function GetAllLog() {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/log', { headers: { authorization } })

  return data
}
