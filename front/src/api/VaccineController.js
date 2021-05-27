import { server } from './index'

export async function AddVaccine(attr) {
  let authorization = localStorage.auth_token

  const { data } = await server.post('/vaccine', attr, { headers: { authorization } })

  return data
}

export async function SearchVaccine({ text, limit }) {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/vaccine', { params: { text, limit }, headers: { authorization } } )

  return data
}

export async function GetVaccine(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.get(`/vaccine/${id}`, { headers: { authorization } })

  return data
}

export async function UpdateVaccine({ id, ...attr }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put(`/vaccine/${id}`, attr, { headers: { authorization } })

  return data
}

export async function DeleteVaccine(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.delete(`/vaccine/${id}`, { headers: { authorization } })

  return data
}
