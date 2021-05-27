export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    user: { type: 'string' },
    date: { type: 'string' },
    table: { type: 'string' },
    operation: { type: 'string' },
    key: { type: 'string' },
  },
  beforeCreate: function(data, proceed) {
    if (data.date.length === 0) data.date = new Date().toISOString()

    proceed()
  },
}
