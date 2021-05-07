import wlc from '../waterline.mjs'

export default () =>
  wlc.finance.createEach([
    { id: 'lT8B9FQt_iFXeOjoLs3k5', amount: 5000, date: '2021-05-02T13:54:06.963Z', description: 'PET [pet](qfRy_a2djCWF9b-lZG12J) vendido de [owner](dEWVp2db7x_PzZvl9GKfO) para [owner](zPR1i264oBj6q51DuzFKI).' },
    { id: 'rPOke97X1AoxBybNLIDLe', amount: -3000, date: '2021-05-04T18:42:57.954Z', description: 'Pagamento de funcionário' },
    { id: 'SDVf4Hs4hvQFZ8cPGTwPb', amount: -1000, date: '2021-05-04T18:40:22.680Z', description: 'Compra de ração' },
  ])
