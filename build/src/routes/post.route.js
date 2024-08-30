'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = require('express')
const catchAsync_utils_1 = require('../utils/catchAsync.utils')
const authorization_middleware_1 = require('../middleware/authorization.middleware')
const enum_1 = require('../constant/enum')
const authentication_middleware_1 = require('../middleware/authentication.middleware')
const posts_controller_1 = __importDefault(require('../controllers/posts.controller'))
const router = (0, express_1.Router)()
router.use((0, authentication_middleware_1.authentication)())
router.use((0, authorization_middleware_1.authorization)([enum_1.Role.USER]))
router.post('/', (0, catchAsync_utils_1.catchAsync)(posts_controller_1.default.create))
router.patch('/', posts_controller_1.default.update)
router.delete('/:id', (0, catchAsync_utils_1.catchAsync)(posts_controller_1.default.delete))
exports.default = router
