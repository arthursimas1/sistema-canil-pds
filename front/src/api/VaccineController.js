import { server } from './index'

export async function AddVaccine(attr) {
  const { data } = await server.post('/vaccine', attr)

  return data
}

export async function SearchVaccine({ text, limit }) {
  const { data } = await server.get('/vaccine', { params: { text, limit } })

  return data
}

export async function GetVaccine(id) {
  const { data } = await server.get(`/vaccine/${id}`)

  return data
}

export async function UpdateVaccine({ id, ...attr }) {
  const { data } = await server.put(`/vaccine/${id}`, attr)

  return data
}

export async function DeleteVaccine(id) {
  const { data } = await server.delete(`/vaccine/${id}`)

  return data
}
