'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.catchAsync = void 0
const catchAsync = (fn) => async (req, res, next) => {
  await Promise.resolve(fn(req, res, next)).catch(next)
}
exports.catchAsync = catchAsync
