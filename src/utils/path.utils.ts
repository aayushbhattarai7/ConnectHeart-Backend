import path from 'path'
import { Environment } from '../constant/enum'

export const getUploadFolderpath = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'uploads')
  return path.join(__dirname, '..', '..', 'public', 'uploads')
}

export const getTempFolderPath = (): string => {
  return path.resolve(process.cwd(), 'public', 'uploads', 'temp')
}

export const getTempFolderPathForPost = (): string => {
  return path.resolve(process.cwd(), 'public', 'posts', 'temp')
}
export const getUploadFolderpathForPost = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'posts', 'upload')
  return path.join(__dirname, '..', '..', 'public', 'posts', 'upload')
}
