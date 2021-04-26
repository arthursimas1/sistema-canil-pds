export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    name: { type: 'string' },
    breed: { type: 'string' },
    birthdate: { type: 'string' },
    gender: { type: 'string' },
    owner: { model: 'owner' },
  },
}
