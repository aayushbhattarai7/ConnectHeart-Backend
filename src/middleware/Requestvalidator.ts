import { plainToClass, type ClassConstructor } from 'class-transformer'
import { validate, type ValidationError } from 'class-validator'
import { type NextFunction, type Request, type Response } from 'express'
import HttpException from '../utils/HttpException.utils'
import { titleNameToCase } from '../utils/titleTOCase'

const getValidationMessage = (errors: ValidationError[], message: string[]) => {
  errors.forEach((err) => {
    if (err.children && err.children?.length > 0) {
      getValidationMessage(err.children, message)
    } else {
      if (err.constraints) {
        Object.values(err.constraints).forEach((value) => {
          const caseValue = titleNameToCase(value)
          message.push(caseValue)
        })
      }
    }
  })
}
class RequestValidator {
  static validate = <T extends object>(classInstance: ClassConstructor<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const convertedObject = plainToClass(classInstance, req.body)
      const validationMessages: string[] = []
      const errors = await validate(convertedObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
      })

        if (errors.length !== 0) {
          getValidationMessage(errors, validationMessages)
          console.log('req error')
          next(HttpException.forbidden(validationMessages[0]))
        }
      next()
    }
  }
}
export default RequestValidator
