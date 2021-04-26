import wlc from './waterline.mjs'

export default async () => Promise.all([
  wlc.pet.createEach([
    {
      id: 'qfRy_a2djCWF9b-lZG12J',
      name: 'Forrest Gump',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2019-01-08T11:11:00.000Z',
      gender: 'Macho',
      owner: 'dEWVp2db7x_PzZvl9GKfO',
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
  ]),
])
