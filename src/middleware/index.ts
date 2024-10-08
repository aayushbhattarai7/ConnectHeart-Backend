import cors from 'cors'
import path from 'path'
import { DotenvConfig } from '../config/env.config'
import { StatusCodes } from '../constant/StatusCodes'
import { errorHandler } from './errorHandler.middleware'
import express, { NextFunction, Request, Response, type Application } from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import routes from '../routes/index.routes'

const middleware = (app: Application) => {
  console.log('DotenvConfig', DotenvConfig.CORS_ORIGIN)
  app.use(compression())
  // app.use(
  //   //   origin: DotenvConfig.CORS_ORIGIN,
  //   // })
  //   cors({
  //     origin: DotenvConfig.CORS_ORIGIN,
  //     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  //     allowedHeaders: ['Content-Type', 'Authorization'],
  //   }),
  // );
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  )
  app.use((req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent']
    const apikey = req.headers['apikey']
    if (userAgent && userAgent.includes('Mozilla')) {
      next()
    } else {
      if (apikey === DotenvConfig.API_KEY) next()
      else res.status(StatusCodes.FORBIDDEN).send('Forbidden')
    }
  })
  app.use(bodyParser.json())

  app.set('public', path.join(__dirname, '../', '../', 'public', 'files'))
  app.use(express.static(path.join(__dirname, '../', '../', 'public/files')))
  app.use(express.urlencoded({ extended: false }))

  app.use('/api', routes)

  app.use(errorHandler)
}

export default middleware
