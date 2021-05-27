import { server } from './index'

export async function AddOwner(attr) {
  let authorization = localStorage.auth_token

  const { data } = await server.post('/owner', attr, { headers: { authorization } })

  return data
}

export async function SearchOwner(query) {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/owner', { params: query, headers: { authorization } } )

  return data
}

export async function GetOwner(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.get(`/owner/${id}`, { headers: { authorization } })

  return data
}

export async function UpdateOwner({ id, ...attr }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put(`/owner/${id}`, attr, { headers: { authorization } })

  return data
}
