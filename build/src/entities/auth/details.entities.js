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
exports.userDetails = void 0
const typeorm_1 = require('typeorm')
const base_entity_1 = __importDefault(require('../base.entity'))
const auth_entity_1 = require('./auth.entity')
const media_entity_1 = __importDefault(require('../media.entity'))
let userDetails = class userDetails extends base_entity_1.default {
  first_name
  middle_name
  last_name
  phone_number
  auth
  profileImage
}
exports.userDetails = userDetails
__decorate(
  [(0, typeorm_1.Column)({ name: 'first_name' }), __metadata('design:type', String)],
  userDetails.prototype,
  'first_name',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ name: 'middle_name', nullable: true }), __metadata('design:type', String)],
  userDetails.prototype,
  'middle_name',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ name: 'last_name' }), __metadata('design:type', String)],
  userDetails.prototype,
  'last_name',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ name: 'phone_number' }), __metadata('design:type', String)],
  userDetails.prototype,
  'phone_number',
  void 0
)
__decorate(
  [
    (0, typeorm_1.OneToOne)(
      () => auth_entity_1.Auth,
      (auth) => auth.details,
      {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    ),
    (0, typeorm_1.JoinColumn)({ name: 'auth_id' }),
    __metadata('design:type', auth_entity_1.Auth),
  ],
  userDetails.prototype,
  'auth',
  void 0
)
__decorate(
  [
    (0, typeorm_1.ManyToMany)(
      () => media_entity_1.default,
      (media) => media.details
    ),
    __metadata('design:type', Array),
  ],
  userDetails.prototype,
  'profileImage',
  void 0
)
exports.userDetails = userDetails = __decorate([(0, typeorm_1.Entity)('users')], userDetails)
