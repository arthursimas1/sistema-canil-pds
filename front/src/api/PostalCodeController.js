import axios from 'axios'

export const viacep = axios.create({
  baseURL: 'https://viacep.com.br',
  timeout: 10000,
})

export async function QueryPostalCode(cep) {
  const { data } = await viacep.get(`/ws/${cep}/json/`)

  return data
}
