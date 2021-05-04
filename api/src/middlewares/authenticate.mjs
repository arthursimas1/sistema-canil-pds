import config from 'config'

export async function AuthHealthCheck(request, response, next) {
  if (request.headers.authorization === config.get('health_check_secret'))
    return next()

  return response.json({ err: 'auth' })
}
