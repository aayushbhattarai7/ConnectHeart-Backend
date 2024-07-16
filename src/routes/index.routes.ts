import { Router, type Request, type Response } from "express";
import user from './auth.routes'
import post from './post.routes'

export interface Route{
    path:string
    route:Router
}

const router = Router()
const routes:Route[] =[
    {
        path:'/user',
        route:user
    },
    {
        path:'/share',
        route:post
    }
]

routes.forEach((route)=>{
    router.use(route.path,route.route)
})



export default router