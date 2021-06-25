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

export const can = () => ACL.can(JSON.parse(localStorage.roles))
