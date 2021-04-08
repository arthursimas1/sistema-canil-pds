export default function Controller(routes) {
  routes.get('/placeholder', async (request, response) => {
    return response.json({ err: 'placeholder-get' })
  })

  routes.post('/placeholder', async (request, response) => {
    return response.json({ err: 'placeholder-create' })
  })

  routes.put('/placeholder', async (request, response) => {
    return response.json({ err: 'placeholder-update' })
  })

  routes.delete('/placeholder', async (request, response) => {
    return response.json({ err: 'placeholder-delete' })
  })
}
