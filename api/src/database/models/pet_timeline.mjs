export default {
  primaryKey: 'id',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    event: { type: 'string' }, // new_pet, ownership_transfer, vaccination, sick, other
    date: { type: 'string' },
    pet: { model: 'pet' },
    description: { type: 'string', defaultsTo: '' },
    metadata: { type: 'json', defaultsTo: {} },
    // event ownership_transfer: {previous_owner: owner, new_owner: owner, type: <sell,donation>, price: int}
    // event vaccination: {vaccine: vaccine, amount: number}
    // event sick: {disease: disease}
  },
}
