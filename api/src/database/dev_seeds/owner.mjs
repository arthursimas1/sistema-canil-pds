import wlc from '../waterline.mjs'

export default () =>
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
  ])
