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
  ]),

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
        previous_owner: 'zPR1i264oBj6q51DuzFKI',
        new_owner: 'dEWVp2db7x_PzZvl9GKfO',
        type: 'donation',
      },
    },
    {
      id: 'C_v_ej-UqZSVEp2AtVxCa',
      event: 'vaccination',
      date: '2021-05-01T13:43:32.653Z',
      pet: 'qfRy_a2djCWF9b-lZG12J',
      description: '',
      metadata: {
        vaccine: 'idgxHQDXjj5PpFyqx0jh0',
        amount: 1,
      },
    },
    {
      id: 'hr5_vDN0WwH1SyiN993aA',
      event: 'sick',
      date: '2021-05-01T19:42:09.129Z',
      pet: 'qfRy_a2djCWF9b-lZG12J',
      description: 'Apenas sintomas leves. Sem maiores complicações.',
      metadata: {
        disease: 'NGMDfCU9kXWN8Zhz2xO-t',
      },
    },
    {
      id: 'mxmF0eRqvIHy2ExdX4wRV',
      event: 'ownership_transfer',
      date: '2021-05-02T13:54:06.963Z',
      pet: 'qfRy_a2djCWF9b-lZG12J',
      description: '',
      metadata: {
        previous_owner: 'dEWVp2db7x_PzZvl9GKfO',
        new_owner: 'zPR1i264oBj6q51DuzFKI',
        type: 'sell',
        price: 120,
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

  wlc.vaccine.createEach([
    {
      id: 'idgxHQDXjj5PpFyqx0jh0',
      name: 'Primo-vacinação',
      manufacturer: 'diversos',
      description: 'Tomar ao perfazer 6 semanas',
    },
    {
      id: 'IwOEjQtzgysRUVyksy8p-',
      name: 'Vacina Trivalente',
      manufacturer: 'diversos',
      description: 'Tomar às 12 semanas.\nConfere imunidade contra: cinomose canina, hepatite infecciosa canina e leptospirose.',
    },
    {
      id: 'RfNYU5Z8xy_H8DigsXxBg',
      name: 'Vacina Tetravalente',
      manufacturer: 'diversos',
      description: 'Tomar às 12 semanas.\nConfere imunidade contra: cinomose canina, hepatite infecciosa canina, leptospirose e parvovirose canina.',
    },
    {
      id: 'WceL3xT-tkCiIHqNGdU7Y',
      name: 'Vacina Polivalente',
      manufacturer: 'diversos',
      description: 'Tomar às 12 semanas.\nConfere imunidade contra: cinomose canina, hepatite infecciosa canina, leptospirose, parvovirose canina, tosse dos canis e coronavírus canino.',
    },
    {
      id: 'hzzatdf5cY2w_xrRO8v4d',
      name: 'Reforço da vacina multivalente',
      manufacturer: 'diversos',
      description: 'Tomar inicialmente às 12 semanas depois anualmente',
    },
    {
      id: '8QCVBqF5ZjvtC0g0L_Kxt',
      name: 'Raiva',
      manufacturer: 'diversos',
      description: 'Tomar inicialmente às 16 semanas depois anualmente',
    },
  ]),

  wlc.disease.createEach([
    {
      id: 'NGMDfCU9kXWN8Zhz2xO-t',
      name: 'Gripe canina',
      description: 'Sintomas: tosse, febre e corrimento nasal.\nA vacina para gripe canina não é recomendada para todos os cães (consultar o médico veterinário).',
    },
  ]),

  wlc.finance.createEach([
    { id: 'rPOke97X1AoxBybNLIDLe', amount: -3000, date: '2021-05-04T18:42:57.954Z', description: 'Pagamento de funcionário' },
    { id: 'lT8B9FQt_iFXeOjoLs3k5', amount:  2000, date: '2021-05-04T18:42:02.429Z', description: 'Venda de um PET' },
    { id: 'aKnLARV1XQ3YCedltvCJI', amount:  5000, date: '2021-05-04T18:41:45.222Z', description: 'Venda de um PET' },
    { id: 'SDVf4Hs4hvQFZ8cPGTwPb', amount: -1000, date: '2021-05-04T18:40:22.680Z', description: 'Compra de ração' },
  ]),
])
