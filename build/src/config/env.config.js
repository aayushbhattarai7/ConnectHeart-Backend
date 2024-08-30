'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.DotenvConfig = void 0
const dotenv_1 = __importDefault(require('dotenv'))
const path_1 = __importDefault(require('path'))
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') })
class DotenvConfig {
  //Development Confguration
  static NODE_ENV = process.env.NODE_ENV
  static PORT = +process.env.PORT
  //Database configuration
  static DATABASE_HOST = process.env.DATABASE_HOST
  static DATABASE_PORT = +process.env.DATABASE_PORT
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
  static DATABASE_NAME = process.env.DATABASE_NAME
  static BASE_URL = process.env.BASE_URL
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
  static ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
  static REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN
  static DEBUG_MODE = process.env.DEBUG_MODE
  //Cors Origin List
  static CORS_ORIGIN = process.env.CORS_ORIGIN || []
  //API KEy for postman or Thunder client
  static API_KEY = process.env.API_KEY
}
exports.DotenvConfig = DotenvConfig
