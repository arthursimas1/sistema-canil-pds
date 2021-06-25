import config from 'config'
import jwt from 'jsonwebtoken'

export function Create({ sub, aud, ...payload }, expiresIn) {
  return new Promise((resolve, reject) => {
    const options = { subject: sub, audience: `${config.get('jwt.aud')}/${aud}` }

    if (typeof expiresIn !== 'undefined')
      options.expiresIn = expiresIn

    jwt.sign(payload, config.get('jwt.secret'), options, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  })
}

export function Verify(token, aud) {
  return new Promise((resolve, reject) => {
    const options = { audience: `${config.get('jwt.aud')}/${aud}` }

    jwt.verify(token, config.get('jwt.secret'), options, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded)
    })
  })
}

export const AUDIENCES = {
  AUTH: 'auth',
}

export default { Create, Verify, AUDIENCES }
