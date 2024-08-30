'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.getTempFolderPathForPost =
  exports.getUploadFolderpathForPost =
  exports.getTempFolderPath =
  exports.getUploadFolderpath =
    void 0
const path_1 = __importDefault(require('path'))
const enum_1 = require('../constant/enum')
const getUploadFolderpath = () => {
  if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
    return path_1.default.resolve(process.cwd(), 'public', 'uploads')
  return path_1.default.join(__dirname, '..', '..', 'public', 'uploads')
}
exports.getUploadFolderpath = getUploadFolderpath
const getTempFolderPath = () => {
  return path_1.default.resolve(process.cwd(), 'public', 'uploads', 'temp')
}
exports.getTempFolderPath = getTempFolderPath
const getUploadFolderpathForPost = () => {
  if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
    return path_1.default.resolve(process.cwd(), 'public', 'uploads')
  return path_1.default.join(__dirname, '..', '..', 'public', 'posts')
}
exports.getUploadFolderpathForPost = getUploadFolderpathForPost
const getTempFolderPathForPost = () => {
  return path_1.default.resolve(process.cwd(), 'public', 'posts', 'temp')
}
exports.getTempFolderPathForPost = getTempFolderPathForPost
