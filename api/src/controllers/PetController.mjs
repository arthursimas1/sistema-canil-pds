import wlc from '../database/waterline.mjs'
import { ACL, Auth } from '../middlewares/authenticate.mjs'
import SendMail from '../helper/mailer.mjs'
import dateFormat from '../helper/dateFormat.mjs'

export default function Controller(routes) {
  routes.post('/pet', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).createAny('pet')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    delete request.body.id // doesn't allow id to be set

    try {
      const pet = await wlc.pet.create(request.body).fetch()

      await wlc.log.create({ user: request.user.name, table: 'pet', operation: 'create', key: pet.id })

      // date set at modeling level
      const pet_timeline = await wlc.pet_timeline.create({
        event: 'new_pet',
        pet: pet.id,
      }).fetch()

      await wlc.log.create({ user: request.user.name, table: 'pet_timeline', operation: 'create', key: pet_timeline.id })

      return response.json({ pet: pet.id })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/pet', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('pet')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const data = request.query
    let query = { }
    const allowed_props = [
      'name', 'breed', 'gender', 'owner',
    ]

    for (const key in data) {
      if (allowed_props.includes(key) && typeof data[key] === 'string')
        query[key] = { startsWith: data[key] }
    }

    const pet = await wlc.pet.find({ where: query, limit: 20 })
      .populate('owner')
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(pet)
  })

  routes.get('/pet/:id', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('pet')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { id } = request.params
    const pet = await wlc.pet.findOne({ id }).populate('owner').populate('previous_owners')

    if (pet)
      return response.json(pet)

    return response.json({ err: 'not_found' })
  })

  routes.put('/pet/:id', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).updateAny('pet')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated
    delete request.body.owner // doesn't allow owner to be updated by this route

    try {
      const pet = await wlc.pet.update({ id }).set(request.body).fetch()

      await wlc.log.create({ user: request.user.name, table: 'pet', operation: 'update', key: id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.put('/pet/:pet/timeline', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).createAny('pet_timeline')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    delete request.body.id // doesn't allow id to be set

    const { pet } = request.params

    try {
      const { event, description, metadata } = request.body

      if (['new_pet', 'ownership_transfer', 'vaccination', 'sick', 'other'].indexOf(event) < 0)
        return response.json({ err: 'invalid_event' })

      // date set at modeling level
      const pet_timeline = await wlc.pet_timeline.create({ pet, event, description, metadata }).fetch()

      await wlc.log.create({ user: request.user.name, table: 'pet_timeline', operation: 'create', key: pet_timeline.id })

      if (event === 'ownership_transfer') {
        await wlc.pet.update({ id: pet }).set({ owner: metadata.new_owner })
        await wlc.pet.addToCollection(pet, 'previous_owners', metadata.previous_owner)
        await wlc.pet.removeFromCollection(pet, 'previous_owners', metadata.new_owner)

        let email_headline

        if (metadata.type === 'sell') {
          // date set at modeling level
          const finance = await wlc.finance.create({
            amount: metadata.price,
            description: `PET [pet](${pet}) vendido de [owner](${metadata.previous_owner}) para [owner](${metadata.new_owner}).`,
          }).fetch()
          await wlc.log.create({ user: request.user.name, table: 'finance', operation: 'create', key: finance.id })

          email_headline = `A compra do seu novo PET por $${metadata.price} foi confirmada!`
        } else { // metadata.type === 'donation'
          email_headline = 'A transferência do seu novo PET foi confirmada!'
        }

        const new_owner_data = await wlc.owner.findOne({ id: metadata.new_owner })
        const pet_data = await wlc.pet.findOne({ id: pet })
        let timeline = await wlc.pet_timeline.find({ where: { id: { '!=': pet_timeline.id }, pet: pet }, sort: 'date ASC' })

        let timeline_text = await Promise.all(timeline.map(async (e) => {
          let text = `<b>${dateFormat(e.date, 'HH:mm dd/MM/yy')}</b>: `
          let subquery

          switch (e.event) {
            case 'new_pet':
              return text.concat('PET adicionado!')

            case 'ownership_transfer':
              return text.concat(`Transferência de dono (${e.metadata.type === 'donation' ? 'doação' : 'venda'})`)

            case 'vaccination':
              subquery = await wlc.vaccine.findOne({ id: e.metadata.vaccine })
              text = text.concat(`Vacinação<br />Recebeu ${e.metadata.amount} ${e.metadata.amount === 1 ? 'dose' : 'doses'} da vacina ${subquery.name}`)
              if (e.description.length > 0)
                text = text.concat(`<br />Detalhes: ${e.description}`)

              return text

            case 'sick':
              subquery = await wlc.disease.findOne({ id: e.metadata.disease })
              text = text.concat(`Doença<br />Foi acometido por ${subquery.name}`)
              if (e.description.length > 0)
                text = text.concat(`<br />Detalhes: ${e.description}`)

              return text

            //case 'other':
            default:
              return text.concat(`Outro<br />Detalhes: ${e.description}`)
          }
        }))

        await SendMail({
          template: 'pet_transfering',
          to: `"${new_owner_data.name}" <${new_owner_data.email}>`,
          context: {
            name: new_owner_data.name,
            pet_name: pet_data.name,
            email_headline,
            description,
            breed: pet_data.breed,
            birthdate: dateFormat(pet_data.birthdate, 'dd/MM/yy'),
            gender: pet_data.gender,
            timeline: timeline_text.join('<br /><br />'),
          },
        })
      }

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/pet/:pet/timeline', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('pet_timeline')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { pet } = request.params
    let timeline = await wlc.pet_timeline.find({ where: { pet }, sort: 'date ASC' })

    timeline = await Promise.all(timeline.map(async (e) => {
      switch (e.event) {
        case 'ownership_transfer':
          e.metadata.previous_owner = await wlc.owner.findOne({ id: e.metadata.previous_owner }) // eslint-disable-line require-atomic-updates
          e.metadata.new_owner = await wlc.owner.findOne({ id: e.metadata.new_owner }) // eslint-disable-line require-atomic-updates
          break

        case 'vaccination':
          e.metadata.vaccine = await wlc.vaccine.findOne({ id: e.metadata.vaccine }) // eslint-disable-line require-atomic-updates
          break

        case 'sick':
          e.metadata.disease = await wlc.disease.findOne({ id: e.metadata.disease }) // eslint-disable-line require-atomic-updates
          break
      }
      delete e.pet

      return e
    }))

    return response.json(timeline)
  })
}
