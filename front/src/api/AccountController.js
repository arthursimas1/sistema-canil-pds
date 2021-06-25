import { server } from './index'
import { decodeToken } from 'react-jwt'

export async function Login({ email, password }) {
  const { data } = await server.post('/login', { email, password })

  if (data.err) return data

  Logout() // first logs out from any other session

  localStorage.name = data.name
  localStorage.auth_token = data.token
  document.body.classList.add('logged')

  localStorage.roles = JSON.stringify(data.roles)
  if (data.roles.indexOf('admin') > -1)
    document.body.classList.add('admin')

  return { }
}

export function IsLogged() {
  return decodeToken(localStorage.auth_token) !== null
}

export function Logout(history = false) {
  document.body.classList.remove('logged', 'admin')
  localStorage.clear()

  if (history !== false) history.push('/login')
}

export async function ListUsers() {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/users', { headers: { authorization } })

  return data
}

export async function GetAccountInfo() {
  let authorization = localStorage.auth_token

  const { data } = await server.get('/my-account', { headers: { authorization } })

  return data
}

export async function CreateAccount({ name, email, password, roles, disabled }) {
  let authorization = localStorage.auth_token

  const { data } = await server.post('/user',
    { name, email, password, roles, disabled },
    { headers: { authorization } })

  return data
}

export async function UpdateAccount({ name, email, new_password }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put('/my-account',
    { name, email, password: new_password },
    { headers: { authorization } })

  return data
}

export async function UpdateUser({ id, name, email, password, roles, disabled }) {
  let authorization = localStorage.auth_token

  const { data } = await server.put(`/user/${id}`,
    { name, email, password, roles, disabled },
    { headers: { authorization } })

  return data
}
