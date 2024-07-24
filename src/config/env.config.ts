import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
export class DotenvConfig {
  //Development Confguration
  static NODE_ENV = process.env.NODE_ENV
  static PORT = +process.env.PORT!

  //Database configuration
  static DATABASE_HOST = process.env.DATABASE_HOST
  static DATABASE_PORT = +process.env.DATABASE_PORT!
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
  static DATABASE_NAME = process.env.DATABASE_NAME

  static BASE_URL = process.env.BASE_URL

  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
  static ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN!
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!
  static REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN!

  //* Email Information
  static MAIL_HOST = process.env.MAIL_HOST
  static MAIL_AUTH = process.env.MAIL_AUTH
  static MAIL_PASSWORD = process.env.MAIL_PASSWORD
  static MAIL_PORT = process.env.MAIL_PORT
  static MAIL_USERNAME = process.env.MAIL_USERNAME
  static MAIL_FROM = process.env.MAIL_FROM

  static OTP_SECRET = process.env.OTP_SECRET!

  static DEBUG_MODE = process.env.DEBUG_MODE

  //Cors Origin List
  static CORS_ORIGIN = process.env.CORS_ORIGIN || []

  //API KEy for postman or Thunder client
  static API_KEY = process.env.API_KEY
}
