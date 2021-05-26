import { server } from './index'

export async function Login({ username, password }) {
  const { data } = await server.post('/login', { username, password })

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
  return typeof localStorage.auth_token === 'string' && localStorage.auth_token.length > 80
}

export function Logout(history = false) {
  document.body.classList.remove('logged', 'admin')
  localStorage.clear()

  if (history !== false) history.push('/login')
}
