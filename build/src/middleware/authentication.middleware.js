'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.authentication = void 0
const env_config_1 = require('../config/env.config')
const message_1 = require('../constant/message')
const HttpException_utils_1 = __importDefault(require('../utils/HttpException.utils'))
const webToken_service_1 = __importDefault(require('../utils/webToken.service'))
const authentication = () => {
  return (req, res, next) => {
    const tokens = req.headers.authorization?.split(' ')
    try {
      if (!tokens) {
        throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized)
      }
      const mode = tokens[0]
      const accessToken = tokens[1]
      if (mode != 'token' || !accessToken)
        throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized)
      const payload = webToken_service_1.default.verify(accessToken, env_config_1.DotenvConfig.ACCESS_TOKEN_SECRET)
      if (payload) {
        req.user = payload
        next()
      } else {
        throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized)
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        next(HttpException_utils_1.default.unauthorized(message_1.Message.tokenExpire))
        return
      }
      next(HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized))
    }
  }
}
exports.authentication = authentication
