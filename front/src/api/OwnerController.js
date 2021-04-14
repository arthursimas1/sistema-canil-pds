import { server } from './index'

export async function AddOwner(attr) {
  const { data } = await server.post('/owner', attr)

  return data
}

export async function SearchOwner(query) {
  const { data } = await server.get('/owner', { params: query })

  return data
}

export async function GetOwner(id) {
  const { data } = await server.get(`/owner/${id}`)

  return data
}

export async function UpdateOwner({ id, attr }) {
  const { data } = await server.put(`/owner/${id}`, attr)

  return data
}
