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
const fs_1 = __importDefault(require('fs'))
const path_1 = __importDefault(require('path'))
const typeorm_1 = require('typeorm')
const env_config_1 = require('../config/env.config')
const details_entities_1 = require('./auth/details.entities')
const enum_1 = require('../constant/enum')
const path_utils_1 = require('../utils/path.utils')
const base_entity_1 = __importDefault(require('./base.entity'))
let Media = class Media extends base_entity_1.default {
  name
  mimeType
  type
  details
  path
  transferImageFromTempToUpload(id, type) {
    const TEMP_PATH = path_1.default.join((0, path_utils_1.getTempFolderPath)(), this.name)
    const UPLOAD_PATH = path_1.default.join((0, path_utils_1.getUploadFolderpath)(), type.toLowerCase(), id.toString())
    !fs_1.default.existsSync(UPLOAD_PATH) && fs_1.default.mkdirSync(UPLOAD_PATH, { recursive: true })
    fs_1.default.renameSync(TEMP_PATH, path_1.default.join(UPLOAD_PATH, this.name))
  }
  async loadImagePath() {
    this.path = `${env_config_1.DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.name}`
  }
}
__decorate(
  [(0, typeorm_1.Column)({ nullable: true }), __metadata('design:type', String)],
  Media.prototype,
  'name',
  void 0
)
__decorate(
  [
    (0, typeorm_1.Column)({
      name: 'mimi_type',
    }),
    __metadata('design:type', String),
  ],
  Media.prototype,
  'mimeType',
  void 0
)
__decorate(
  [(0, typeorm_1.Column)({ enum: enum_1.MediaType, type: 'enum' }), __metadata('design:type', String)],
  Media.prototype,
  'type',
  void 0
)
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => details_entities_1.userDetails,
      (auth) => auth.profileImage
    ),
    (0, typeorm_1.JoinColumn)({ name: 'auth_id' }),
    __metadata('design:type', details_entities_1.userDetails),
  ],
  Media.prototype,
  'details',
  void 0
)
__decorate(
  [
    (0, typeorm_1.AfterLoad)(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  Media.prototype,
  'loadImagePath',
  null
)
Media = __decorate([(0, typeorm_1.Entity)('media')], Media)
exports.default = Media
