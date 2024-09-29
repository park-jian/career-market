import { http, HttpResponse } from 'msw'
import userData from './data/users.json'

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    const user = userData.users.find(u => u.id === Number(id))
    
    if (user) {
      return HttpResponse.json(user)
    } else {
      return new HttpResponse(null, { status: 404 })
    }
  }),
]