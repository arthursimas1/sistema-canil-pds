import wlc from '../waterline.mjs'

export default () =>
  wlc.disease.createEach([
    {
      id: 'NGMDfCU9kXWN8Zhz2xO-t',
      name: 'Gripe canina',
      description: 'Sintomas: tosse, febre e corrimento nasal.\nA vacina para gripe canina não é recomendada para todos os cães (consultar o médico veterinário).',
    },
    {
      id: '5yxveckOXIFRor81G2F8L',
      name: 'Raiva canina',
      description: 'O vírus é espalhado pela saliva, seja por uma mordida de um animal infectado ou por saliva que contamina uma ferida na pele. Além disso, qualquer contato com animais selvagens, pode trazer risco de infecção por raiva.',
    },
    {
      id: 'oxrl3i6C4uDLohu2qj8di',
      name: 'Cinomose canina',
      description: 'Sintomas: febre, corrimento ocular e nasal, tosse, diarreia, vômitos, convulsões e paralisia. Filhotes e cães adultos geralmente contraem a doença através de secreções respiratórias de cães infectados ou partículas do vírus no ar. A doença é muitas vezes fatal.',
    },
    {
      id: 'ERv7cHiBi7h7j4Mt_GJmK',
      name: 'Parvovirose canina',
      description: 'Sintomas: tosse, febre e corrimento nasal. É causada pelo parvovírus. O vírus é muito contagioso e ataca o sistema gastrointestinal, causando vômito, febre e diarreia grave. É transmitido através do contato direto entre cães, bem como por fezes contaminadas, contato com o piso, tigelas, coleira, e até mãos ou roupas das pessoas.',
    },
    {
      id: '8jn__Gil9nN5GGFW8gJcw',
      name: 'Dirofilariose',
      description: 'Entre os sintomas estão tosse, problemas respiratórios, fraqueza, doença cardíaca e perda de peso. A dirofilariose é causada por parasitas que se alojam no coração do seu cão, causando danos no coração, vasos sanguíneos e pulmões. A doença é transmitida por mosquitos, e por isso é mais comum em períodos mais quentes do ano e em regiões litorâneas.',
    },
    {
      id: '2d3qXgbnWgHVptMsQkGY6',
      name: 'Doença de Lyme',
      description: 'Os sintomas podem ser perda de apetite, vômito, dor, febre e inflamação nas articulações que fazem o cão a mancar. A doença de Lyme também conhecida como borreliose é causada por uma bactéria chamada Borrelia burgdorferi, que é transmitida através da picada do carrapato.',
    },
  ])
