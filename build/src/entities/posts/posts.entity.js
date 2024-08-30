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
exports.Post = void 0
const typeorm_1 = require('typeorm')
const base_entity_1 = __importDefault(require('../base.entity'))
// import { PostMedia} from './postMedia.entity'
const auth_entity_1 = require('../../entities/auth/auth.entity')
let Post = class Post extends base_entity_1.default {
  thought
  feeling
  // @OneToMany(()=> PostMedia,(postMedia) =>postMedia.posts)
  // postImage:Post[]
  postIt
}
exports.Post = Post
__decorate(
  [(0, typeorm_1.Column)({ name: 'thought' }), __metadata('design:type', String)],
  Post.prototype,
  'thought',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ name: 'feeling' }), __metadata('design:type', String)],
  Post.prototype,
  'feeling',
  void 0
)
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => auth_entity_1.Auth,
      (postIt) => postIt.posts,
      {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    ),
    (0, typeorm_1.JoinColumn)({ name: 'auth_id' }),
    __metadata('design:type', auth_entity_1.Auth),
  ],
  Post.prototype,
  'postIt',
  void 0
)
exports.Post = Post = __decorate([(0, typeorm_1.Entity)('post')], Post)
