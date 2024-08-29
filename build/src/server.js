"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_config_1 = __importDefault(require("./config/app.config"));
const database_config_1 = require("./config/database.config");
const env_config_1 = require("./config/env.config");
const print_1 = __importDefault(require("./utils/print"));
function listen() {
    const PORT = env_config_1.DotenvConfig.PORT;
    const httpServer = (0, http_1.createServer)(app_config_1.default);
    httpServer.listen(PORT);
    print_1.default.info(`🚀 Server is listening on port ${env_config_1.DotenvConfig.PORT}`);
}
database_config_1.AppDataSource.initialize()
    .then(async () => {
    print_1.default.info(`🚀 Database connected successfully `);
    listen(); // Start the server
})
    .catch((err) => {
    print_1.default.error(`❌ Database failed to connect${err?.message}`);
});
