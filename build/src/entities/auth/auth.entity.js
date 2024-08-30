'use strict'
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc)
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return c > 3 && r && Object.defineProperty(target, key, r), r
  }
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v)
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.Auth = void 0
const typeorm_1 = require('typeorm')
const details_entities_1 = require('./details.entities')
const enum_1 = require('../../constant/enum')
const base_entity_1 = __importDefault(require('../base.entity'))
const posts_entity_1 = require('../posts/posts.entity')
let Auth = class Auth extends base_entity_1.default {
  email
  username
  password
  role
  details
  posts
  tokens
}
exports.Auth = Auth
__decorate(
  [
    (0, typeorm_1.Column)({
      unique: true,
    }),
    __metadata('design:type', String),
  ],
  Auth.prototype,
  'email',
  void 0
)
__decorate(
  [
    (0, typeorm_1.Column)({
      unique: true,
    }),
    __metadata('design:type', String),
  ],
  Auth.prototype,
  'username',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ select: false }), __metadata('design:type', String)],
  Auth.prototype,
  'password',
  void 0
)
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: enum_1.Role,
      default: enum_1.Role.USER,
    }),
    __metadata('design:type', String),
  ],
  Auth.prototype,
  'role',
  void 0
)
__decorate(
  [
    (0, typeorm_1.OneToOne)(
      () => details_entities_1.userDetails,
      (details) => details.auth,
      { cascade: true }
    ),
    __metadata('design:type', details_entities_1.userDetails),
  ],
  Auth.prototype,
  'details',
  void 0
)
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => posts_entity_1.Post,
      (post) => post.postIt,
      { cascade: true }
    ),
    __metadata('design:type', posts_entity_1.Post),
  ],
  Auth.prototype,
  'posts',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ nullable: true }), __metadata('design:type', String)],
  Auth.prototype,
  'tokens',
  void 0
)
exports.Auth = Auth = __decorate([(0, typeorm_1.Entity)('auth')], Auth)
