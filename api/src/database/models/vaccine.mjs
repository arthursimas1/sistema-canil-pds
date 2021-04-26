export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    name: { type: 'string' },
    manufacturer: { type: 'string' },
    description: { type: 'string' },
    hidden: { type: 'boolean', defaultsTo: false },
  },
}
