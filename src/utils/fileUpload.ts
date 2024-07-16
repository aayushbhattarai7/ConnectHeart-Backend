import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { DotenvConfig } from '../config/env.config'
import { Environment, MediaType } from '../constant/enum'
import HttpException from './HttpException.utils'

const storage = multer.diskStorage({
  destination: function (req: any, _file: any, cb: any) {
    let folderPath = ''

    // if (!req.body.type) return cb(HttpException.badRequest('choose a file'), '')
    // if (!MediaType[req.body.type as keyof typeof MediaType]) return cb(HttpException.badRequest('invalid file type'))
    if (DotenvConfig.NODE_ENV === Environment.DEVELOPMENT)
      folderPath = path.join(process.cwd(), 'public', 'posts', 'temp')
    else folderPath = path.resolve(process.cwd(), 'public', 'posts', 'temp')

    !fs.existsSync(folderPath) && fs.mkdirSync(folderPath, { recursive: true })
    cb(null, folderPath)
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1900) + '.' + file.mimetype.split('/').pop()
    cb(null, fileName)
  },
})
const upload = multer({
  storage,
})
export default upload
