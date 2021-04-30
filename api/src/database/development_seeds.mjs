import wlc from './waterline.mjs'

export default async () => Promise.all([
  wlc.pet.createEach([
    {
      id: 'qfRy_a2djCWF9b-lZG12J',
      name: 'Forrest Gump',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2019-01-08T11:11:00.000Z',
      gender: 'Macho',
      owner: 'zPR1i264oBj6q51DuzFKI',
    },
    {
      id: 'QMW3Pttbtn9b3h4tDPYn_',
      name: 'Amora',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2018-01-10T11:11:00.000Z',
      gender: 'Fêmea',
      owner: 'dEWVp2db7x_PzZvl9GKfO',
    },
  ]),
/*
    id: { type: 'string', columnName: '_id' },
    event: { type: 'string' }, // new_pet, ownership_transfer, vaccination, sick, other
    date: { type: 'string' },
    pet: { model: 'pet' },
    description: { type: 'string', defaultsTo: '' },
    metadata: { type: 'json', defaultsTo: {} },
    // event ownership_transfer: {previous_owner: owner, new_owner: owner, type: <sell,donation>}
    // event vaccination: {vaccine: vaccine, amount: number}
    // event sick: {disease: disease}
* */
  wlc.pet_timeline.createEach([
    {
      id: 'p6kl99_jD0jjhMvWI891x',
      event: 'new_pet',
      date: '2021-04-30T06:14:13.728Z',
      pet: 'QMW3Pttbtn9b3h4tDPYn_',
      description: '',
      metadata: {},
    },
    {
      id: '0zzyuM0hcyZWprLEPpybt',
      event: 'new_pet',
      date: '2021-04-29T14:32:03.843Z',
      pet: 'qfRy_a2djCWF9b-lZG12J',
      description: '',
      metadata: {},
    },
    {
      id: '9eM3UmqSabCKOpE1LJqZc',
      event: 'ownership_transfer',
      date: '2021-04-30T17:47:21.253Z',
      pet: 'qfRy_a2djCWF9b-lZG12J',
      description: '',
      metadata: {
        previous_owner: 'dEWVp2db7x_PzZvl9GKfO',
        new_owner: 'zPR1i264oBj6q51DuzFKI',
        type: 'donation',
      },
    },
  ]),

  wlc.owner.createEach([
    {
      id: 'dEWVp2db7x_PzZvl9GKfO',
      name: 'Arthur Simas',
      cpf: '42636917845',
      email: 'arthursimas1@gmail.com',
      gender: 'Masculino',
      birthdate: '2000-06-18T02:25:00.000Z',
      streetname: 'Rua Benvenuto Di Giovani',
      number: '214',
      postalcode: '05551000',
      state: 'SP',
      city: 'São Paulo',
      notes: '',
      has_animals: true,
      had_animals: true,
    },
    {
      id: 'zPR1i264oBj6q51DuzFKI',
      name: 'Guilherme Riveira',
      cpf: '12625566840',
      email: 'gui.riv@gmail.com',
      gender: 'Masculino',
      birthdate: '2000-07-20T02:25:00.000Z',
      streetname: 'Av. Salim Farah Maluf',
      number: '560',
      postalcode: '03304090',
      state: 'SP',
      city: 'São Paulo',
      notes: '',
      has_animals: false,
      had_animals: false,
    },
  ]),
])
