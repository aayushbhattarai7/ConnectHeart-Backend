"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_config_1 = require("../config/env.config");
const StatusCodes_1 = require("../constant/StatusCodes");
const errorHandler_middleware_1 = require("./errorHandler.middleware");
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_route_1 = __importDefault(require("../routes/index.route"));
const middleware = (app) => {
    console.log('DotenvConfig', env_config_1.DotenvConfig.CORS_ORIGIN);
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: env_config_1.DotenvConfig.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use((req, res, next) => {
        const userAgent = req.headers['user-agent'];
        const apikey = req.headers['apikey'];
        if (userAgent && userAgent.includes('Mozilla')) {
            next();
        }
        else {
            if (apikey === env_config_1.DotenvConfig.API_KEY)
                next();
            else
                res.status(StatusCodes_1.StatusCodes.FORBIDDEN).send('Forbidden');
        }
    });
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(body_parser_1.default.json());
    app.set("view engine", "ejs");
    app.set('views', path_1.default.join(__dirname, '../', 'views'));
    app.use('/', index_route_1.default);
    // app.use('/', (_, res: Response) => {
    //     res.render('index');
    // });
    app.use(errorHandler_middleware_1.errorHandler);
};
exports.default = middleware;
