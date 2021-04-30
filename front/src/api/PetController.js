import { server } from './index'

export async function AddPet(attr) {
  const { data } = await server.post('/pet', attr)

  return data
}

export async function SearchPet(query) {
  const { data } = await server.get('/pet', { params: query })

  return data
}

export async function GetPet(id) {
  const { data } = await server.get(`/pet/${id}`)

  return data
}

export async function UpdatePet({ id, ...attr }) {
  const { data } = await server.put(`/pet/${id}`, attr)

  return data
}

export async function GetTimeline(id) {
  const { data } = await server.get(`/pet/${id}/timeline`)

  return data
}

export async function AddEvent({ id, ...attr }) {
  const { data } = await server.put(`/pet/${id}/timeline`, attr)

  return data
}
