import Waterline from 'waterline'
import sailsDiskAdapter from 'sails-disk'
import sailsMongoAdapter from 'sails-mongo'
import config from 'config'
import { nanoid } from 'nanoid'
import * as models from './models/index.mjs'
import devSeeds from './dev_seeds/index.mjs'

const WaterlineStatic = {}

export default WaterlineStatic

let waterline = new Waterline()

Object.entries(models)
  .map(([name, model]) => {
    if (typeof model.identity === 'undefined') model.identity = name

    if (typeof model.datastore === 'undefined') model.datastore = 'default'

    if (process.env.NODE_ENV === 'production') model.dontUseObjectIds = true

    let old_before_create = model.beforeCreate
    model.beforeCreate = function(data, proceed) {
      if (data.id === null) data.id = nanoid()

      if (old_before_create) old_before_create(data, proceed)
      else proceed()
    }

    waterline.registerModel(Waterline.Collection.extend(model))
  })

let conf = {
  adapters: {
    disk: sailsDiskAdapter,
    mongo: sailsMongoAdapter,
  },
  datastores: {
    default: {
      ...process.env.NODE_ENV === 'production' ?
        { adapter: 'mongo', url: config.get('mongodb.url') } :
        { adapter: 'disk', inMemoryOnly: true },
    },
  },
}

waterline.initialize(conf, async (err, ontology) => {
  if (err) {
    console.error('Waterline initialization error', err)
  } else {
    Object.entries(ontology.collections)
      .map(([name, collection]) => {
        WaterlineStatic[name] = collection
      })
    let { user } = WaterlineStatic

    await user.create({
      id: 'admin-user-9ZjC28G9',
      username: 'admin',
      name: 'Admin User',
      password: 'Jb_nqk4AL9',
      roles: ['admin'],
    }).then(() => console.log('admin account created'))
      .catch(() => console.log('admin account exists'))

    await user.create({
      id: 'regular-user-3k4e4QzB',
      username: 'user',
      name: 'Regular User',
      password: 'K_cH3mtZFZ',
      roles: ['regular'],
    }).then(() => console.log('regular account created'))
      .catch(() => console.log('regular account exists'))

    if (process.env.NODE_ENV === 'development')
      await devSeeds()

    console.log('Waterline initialized')
  }
})
