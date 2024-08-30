'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
const env_config_1 = require('../config/env.config')
class webTokenService {
  sign(user, options, role) {
    return jsonwebtoken_1.default.sign(
      {
        id: user.id,
        role,
      },
      options.secret,
      {
        expiresIn: options.expiresIn,
      }
    )
  }
  verify(token, secret) {
    return jsonwebtoken_1.default.verify(token, secret)
  }
  generateTokens(user, role) {
    const accessToken = this.sign(
      user,
      {
        expiresIn: env_config_1.DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
        secret: env_config_1.DotenvConfig.ACCESS_TOKEN_SECRET,
      },
      role
    )
    const refreshToken = this.sign(
      user,
      {
        expiresIn: env_config_1.DotenvConfig.REFRESH_TOKEN_EXPIRES_IN,
        secret: env_config_1.DotenvConfig.REFRESH_TOKEN_SECRET,
      },
      role
    )
    return { accessToken, refreshToken }
  }
  generateAccessToken(user, role) {
    return this.sign(
      user,
      {
        expiresIn: env_config_1.DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
        secret: env_config_1.DotenvConfig.ACCESS_TOKEN_SECRET,
      },
      role
    )
  }
}
exports.default = new webTokenService()
