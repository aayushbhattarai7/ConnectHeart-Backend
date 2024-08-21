import path from 'path'
import { Environment } from '../constant/enum'
import fs from 'fs'

export const getUploadFolderpath = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'files')
  return path.join(__dirname, '..', '..', 'public', 'files')
}

export const getTempFolderPath = (): string => {
  return path.resolve(process.cwd(), 'public', 'files', 'temp')
}

export const getTempFolderPathForPost = (): string => {
  return path.resolve(process.cwd(), 'public', 'files', 'temp')
}
export const getUploadFolderpathForPost = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'files')
  return path.join(__dirname, '..', '..', 'public', 'files')
}

export const getTempFolderPathForChat = (): string => {
  return path.resolve(process.cwd(), 'public', 'files', 'temp')
}
export const getUploadFolderpathForChat = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'files')
  return path.join(__dirname, '..', '..', 'public', 'files')
}

export const transferImageFromUploadToTemp = (id: string, name: string, type: string): void => {
  const UPLOAD_FOLDER_PATH = path.join(getUploadFolderpathForPost(), type.toLowerCase(), id.toString())
  const TEMP_FOLDER_PATH = path.join(getTempFolderPathForPost(),id.toString())
  if (!fs.existsSync(TEMP_FOLDER_PATH)) fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true })
  const imageName = path.basename(name)
  console.log("🚀 ~ transferImageFromUploadToTemp ~ imageName:", imageName)
  try {
    fs.renameSync(path.join(UPLOAD_FOLDER_PATH,imageName),path.join(TEMP_FOLDER_PATH, imageName))
  } catch (err) {
    console.log('🚀 ~ transferImageFromUploadTOTempFolder ~ err', err)
  }
}
  
