export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    amount: { type: 'number' },
    date: { type: 'string' },
    description: { type: 'string' },
  },
}
