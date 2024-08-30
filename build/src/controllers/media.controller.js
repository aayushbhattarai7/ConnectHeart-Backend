'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const StatusCodes_1 = require('../constant/StatusCodes')
const message_1 = require('../constant/message')
const HttpException_utils_1 = __importDefault(require('../utils/HttpException.utils'))
class MediaController {
  async create(req, res) {
    if (req?.files?.length === 0) throw HttpException_utils_1.default.badRequest('Sorry file couldnot be uploaded')
    const fileArray = req.files
    const data = fileArray.map((file) => {
      return {
        name: file?.fileName,
        mimeType: file?.mimeType,
        type: req.body?.type,
      }
    })
    res.status(StatusCodes_1.StatusCodes.CREATED).json({
      status: true,
      message: message_1.Message.created,
      data,
    })
  }
}
exports.default = new MediaController()
