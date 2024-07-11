import cors from 'cors';
import path from 'path';
import { DotenvConfig } from '../config/env.config';
import { morganMiddleware } from './morgan.middleware';
import { StatusCodes } from '../constant/StatusCodes';
import { errorHandler } from './errorHandler.middleware';
import express, { NextFunction, Request, Response, type Application } from 'express';
import compression from 'compression';
import bodyParser, { urlencoded } from 'body-parser';
import routes from '../routes/index.route';

const middleware = (app: Application) => {
    console.log('DotenvConfig', DotenvConfig.CORS_ORIGIN);
    app.use(compression());
    app.use(cors({
        origin: DotenvConfig.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use((req: Request, res: Response, next: NextFunction) => {
        const userAgent = req.headers['user-agent'];
        const apikey = req.headers['apikey'];
        if (userAgent && userAgent.includes('Mozilla')) {
            next();
        } else {
            if (apikey === DotenvConfig.API_KEY) next();
            else res.status(StatusCodes.FORBIDDEN).send('Forbidden');
        }
    });
    app.use(express.urlencoded({extended:false}))
    app.use(bodyParser.json());

    app.set("view engine", "ejs"); 
    app.set('views', path.join(__dirname, '../', 'views')); 

    app.use('/', routes);

    // app.use('/', (_, res: Response) => {
    //     res.render('index');
    // });

    app.use(errorHandler);
};

export default middleware;
