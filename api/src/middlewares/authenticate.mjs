import wlc from '../database/waterline.mjs'
import tokenlib from '../helper/tokenlib.mjs'
import AccessControl from 'accesscontrol'

export const ACL = new AccessControl()

// Create, Read, Update, Delete
ACL.grant('employee')
  .readAny('disease')
  .createAny('finance')
  .createAny('owner')
  .readAny('owner')
  .updateAny('owner')
  .createAny('pet')
  .readAny('pet')
  .updateAny('pet')
  .createAny('pet_timeline')
  .readAny('pet_timeline')
  .readOwn('user', ['name', 'email', 'password'])
  .updateOwn('user', ['name', 'email', 'password'])
  .readAny('vaccine');

['disease', 'finance', 'owner', 'pet', 'pet_timeline', 'user', 'vaccine'].forEach((collection) => {
  ACL.grant('admin')
    .createAny(collection)
    .readAny(collection)
    .updateAny(collection)
    .deleteAny(collection)
})
ACL.grant('admin')
  .readAny('log')

export async function AuthHealthCheck(request, response, next) {
  if (request.ip === '::ffff:127.0.0.1')
    return next()

  return response.json({ err: 'auth' })
}

export async function Auth(request, response, next) {
  const token = request.headers.authorization

  tokenlib.Verify(token, tokenlib.AUDIENCES.AUTH)
    .then(async (decoded) => {
      request.user = await wlc.user.findOne({ id: decoded.sub, disabled: false })

      return next()
    })
    .catch(() => response.json({ err: 'auth' }))
}
