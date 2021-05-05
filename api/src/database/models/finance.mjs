export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    amount: { type: 'number' },
    date: { type: 'string' },
    description: { type: 'string' },
  },
  beforeCreate: function(data, proceed) {
    if (data.date.length === 0) data.date = new Date().toISOString()

    proceed()
  },
}
