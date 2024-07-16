"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_config_1 = require("./env.config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: env_config_1.DotenvConfig.DATABASE_HOST,
    port: env_config_1.DotenvConfig.DATABASE_PORT,
    username: env_config_1.DotenvConfig.DATABASE_USERNAME,
    password: env_config_1.DotenvConfig.DATABASE_PASSWORD,
    database: env_config_1.DotenvConfig.DATABASE_NAME,
    logging: false,
    dropSchema: false,
    synchronize: true,
    entities: ['src/entities/**/*{.ts, .js}'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: [],
});
