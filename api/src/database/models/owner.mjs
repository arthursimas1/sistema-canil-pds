export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    name: { type: 'string' },
    cpf: { type: 'string' },
    email: { type: 'string' },
    gender: { type: 'string' },
    birthdate: { type: 'string' },
    streetname: { type: 'string' },
    number: { type: 'string' },
    postalcode: { type: 'string' },
    state: { type: 'string' },
    city: { type: 'string' },
    notes: { type: 'string' },
  },
}
