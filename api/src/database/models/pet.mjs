export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    name: { type: 'string' },
    species: { type: 'number' },
    breed: { type: 'number' },
    birthdate: { type: 'string' },
    gender: { type: 'string' },
    owner: { model: 'owner' },
  },
}
