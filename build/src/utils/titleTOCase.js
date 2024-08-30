'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.titleNameToCase = titleNameToCase
function titleNameToCase(inputString) {
  const parts = inputString.split(/(?=[A-Z])/)
  const result = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  return result
}
