import { Router } from 'express'
import user from './auth.routes'
import post from './post.routes'
import connect from './connect.routes'
import like from './like.routes'
import chat from './chat.routes'
export interface Route {
  path: string
  route: Router
}

const router = Router()
const routes: Route[] = [
  {
    path: '/user',
    route: user,
  },
  {
    path: '/post',
    route: post,
  },
  {
    path:'/connect',
    route:connect
  },
  {
    path:'/like',
    route: like
  }, 
  {
    path:'/chat',
    route:chat
  },
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router
