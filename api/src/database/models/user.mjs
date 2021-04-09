import bcrypt from 'bcryptjs'

function Normalize(data, proceed) {
  if (typeof data.password === 'string')
    data.password = bcrypt.hashSync(data.password, 10)

  if (typeof data.email === 'string')
    data.email = data.email.toLowerCase().trim()

  if (typeof data.name === 'string')
    data.name = data.name.trim()

  proceed()
}

export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    email: { type: 'string', required: true, autoMigrations: { unique: true } },
    name: { type: 'string' },
    password: { type: 'string' },
    roles: { type: 'json', defaultsTo: ['spectator'] }, //[string]
  },
  beforeCreate: Normalize,
  beforeUpdate: Normalize,
}
