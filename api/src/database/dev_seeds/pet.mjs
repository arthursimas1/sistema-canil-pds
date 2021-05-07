import wlc from '../waterline.mjs'

export default () =>
  wlc.pet.createEach([
    {
      id: 'qfRy_a2djCWF9b-lZG12J',
      name: 'Forrest Gump',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2019-01-08T11:11:00.000Z',
      gender: 'Macho',
      owner: 'zPR1i264oBj6q51DuzFKI',
      previous_owners: ['dEWVp2db7x_PzZvl9GKfO'],
    },
    {
      id: 'QMW3Pttbtn9b3h4tDPYn_',
      name: 'Amora',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2018-01-10T11:11:00.000Z',
      gender: 'Fêmea',
      owner: 'dEWVp2db7x_PzZvl9GKfO',
    },
  ])
