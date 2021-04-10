import wlc from './waterline.mjs'

export default async () => Promise.all([
  wlc.pet.createEach([
    {
      name: 'Forrest Gump',
      species: 'Gato',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2019-01-08T11:11:00.000Z',
      gender: 'Macho',
      owner: null,
    },
    {
      name: 'Amora',
      species: 'Gato',
      breed: 'Sem raça definida (SRD)',
      birthdate: '2018-01-10T11:11:00.000Z',
      gender: 'Fêmea',
      owner: null,
    },
  ]),
])
