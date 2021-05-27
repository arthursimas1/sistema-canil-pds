import { server } from './index'

export async function AddPet(attr) {
  let authorization = localStorage.auth_token

  const { data } = await server.post('/pet', attr, { headers: { authorization } })

  return data
}

export async function SearchPet(query) {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/pet', { params: query, headers: { authorization } } )

  return data
}

export async function GetPet(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.get(`/pet/${id}`, { headers: { authorization } })

  return data
}

export async function UpdatePet({ id, ...attr }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put(`/pet/${id}`, attr, { headers: { authorization } })

  return data
}

export async function GetTimeline(id) {
  let authorization = localStorage.auth_token

  const { data } = await server.get(`/pet/${id}/timeline`, { headers: { authorization } })

  return data
}

export async function AddEvent({ pet, ...attr }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put(`/pet/${pet}/timeline`, attr, { headers: { authorization } })

  return data
}
