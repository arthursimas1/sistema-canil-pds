import wlc from '../waterline.mjs'

export default () =>
  wlc.vaccine.createEach([
    {
      id: 'idgxHQDXjj5PpFyqx0jh0',
      name: 'Primo-vacinação',
      manufacturer: 'diversos',
      description: 'Tomar ao perfazer 6 semanas.',
    },
    {
      id: 'IwOEjQtzgysRUVyksy8p-',
      name: 'Vacina Trivalente',
      manufacturer: 'diversos',
      description: 'Tomar às 12 semanas depois anualmente. Confere imunidade contra: cinomose canina, hepatite infecciosa canina e leptospirose.',
    },
    {
      id: 'RfNYU5Z8xy_H8DigsXxBg',
      name: 'Vacina Tetravalente',
      manufacturer: 'diversos',
      description: 'Tomar às 12 semanas depois anualmente. Confere imunidade contra: cinomose canina, hepatite infecciosa canina, leptospirose e parvovirose canina.',
    },
    {
      id: 'WceL3xT-tkCiIHqNGdU7Y',
      name: 'Vacina Polivalente',
      manufacturer: 'diversos',
      description: 'Tomar às 12 semanas depois anualmente. Confere imunidade contra: cinomose canina, hepatite infecciosa canina, leptospirose, parvovirose canina, tosse dos canis e coronavírus canino.',
    },
    {
      id: '8QCVBqF5ZjvtC0g0L_Kxt',
      name: 'Raiva',
      manufacturer: 'diversos',
      description: 'Tomar inicialmente às 16 semanas depois anualmente.',
    },
  ])
