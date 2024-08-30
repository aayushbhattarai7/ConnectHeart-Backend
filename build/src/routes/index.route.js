'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const auth_routes_1 = __importDefault(require('./auth.routes'))
const post_route_1 = __importDefault(require('./post.route'))
const router = (0, express_1.Router)()
const routes = [
  {
    path: '/user',
    route: auth_routes_1.default,
  },
  {
    path: '/share',
    route: post_route_1.default,
  },
]
routes.forEach((route) => {
  router.use(route.path, route.route)
})
exports.default = router
