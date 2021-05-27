import { server } from './index'

export async function AddDisease(attr) {
  let authorization = localStorage.auth_token

  const { data } = await server.post('/disease', attr, { headers: { authorization } })

  return data
}

export async function SearchDisease({ text, limit }) {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/disease', { params: { text, limit }, headers: { authorization } } )

  return data
}

export async function GetDisease(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.get(`/disease/${id}`, { headers: { authorization } })

  return data
}

export async function UpdateDisease({ id, ...attr }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put(`/disease/${id}`, attr, { headers: { authorization } })

  return data
}

export async function DeleteDisease(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.delete(`/disease/${id}`, { headers: { authorization } })

  return data
}
