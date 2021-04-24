import { server } from './index'

export async function AddDisease(attr) {
  const { data } = await server.post('/disease', attr)

  return data
}

export async function SearchDisease({ text, limit }) {
  const { data } = await server.get('/disease', { params: { text, limit } })

  return data
}

export async function GetDisease(id) {
  const { data } = await server.get(`/disease/${id}`)

  return data
}

export async function UpdateDisease({ id, ...attr }) {
  const { data } = await server.put(`/disease/${id}`, attr)

  return data
}

export async function DeleteDisease(id) {
  const { data } = await server.delete(`/disease/${id}`)

  return data
}
