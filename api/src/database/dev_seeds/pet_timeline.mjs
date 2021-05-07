import wlc from '../waterline.mjs'

export default () =>
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
        price: 5000,
      },
    },
  ])
