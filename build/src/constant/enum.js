'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.AdminAllowedFetures = exports.Role = exports.MediaType = exports.Environment = void 0
var Environment
;(function (Environment) {
  Environment['DEVELOPMENT'] = 'DEVELOPMENT'
  Environment['PRODUCTION'] = 'PRODUCTION'
})(Environment || (exports.Environment = Environment = {}))
var MediaType
;(function (MediaType) {
  MediaType['PROFILE'] = 'PROFILE'
})(MediaType || (exports.MediaType = MediaType = {}))
var Role
;(function (Role) {
  Role['ADMIN'] = 'ADMIN'
  Role['USER'] = 'USER'
})(Role || (exports.Role = Role = {}))
var AdminAllowedFetures
;(function (AdminAllowedFetures) {
  AdminAllowedFetures['SETUP'] = 'SETUP'
  AdminAllowedFetures['MANAGE_ADMIN'] = 'MANAGE_ADMIN'
})(AdminAllowedFetures || (exports.AdminAllowedFetures = AdminAllowedFetures = {}))
