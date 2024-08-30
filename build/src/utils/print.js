'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const chalk_1 = __importDefault(require('chalk'))
const env_config_1 = require('../config/env.config')
const logger_config_1 = require('../config/logger.config')
const enum_1 = require('../constant/enum')
const log = console.log
class Print {
  static error(message) {
    if (env_config_1.DotenvConfig.NODE_ENV === enum_1.Environment.DEVELOPMENT)
      log(chalk_1.default.red('ERROR: ', message))
    else logger_config_1.Logger.error(message)
  }
  static info(message) {
    if (env_config_1.DotenvConfig.NODE_ENV === enum_1.Environment.DEVELOPMENT)
      log(chalk_1.default.green('INFO: ', message))
    else logger_config_1.Logger.info(message)
  }
  static warn(message) {
    if (env_config_1.DotenvConfig.NODE_ENV === enum_1.Environment.DEVELOPMENT)
      log(chalk_1.default.bgRed('WARNING: ', message))
    else logger_config_1.Logger.warn(message)
  }
  static debug(message) {
    if (env_config_1.DotenvConfig.NODE_ENV === enum_1.Environment.DEVELOPMENT)
      log(chalk_1.default.blue('DEBUG: ', message))
    else logger_config_1.Logger.debug(message)
  }
}
exports.default = Print
