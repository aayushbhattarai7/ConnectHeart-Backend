"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_entity_1 = require("../entities/posts/posts.entity");
const database_config_1 = require("../config/database.config");
const message_1 = require("../constant/message");
const auth_entity_1 = require("../entities/auth/auth.entity");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
class PostService {
    getPostRepo;
    getAuth;
    constructor(getPostRepo = database_config_1.AppDataSource.getRepository(posts_entity_1.Post), getAuth = database_config_1.AppDataSource.getRepository(auth_entity_1.Auth)) {
        this.getPostRepo = getPostRepo;
        this.getAuth = getAuth;
    }
    async create(data, id) {
        const auth = await this.getAuth.findOneBy({ id });
        if (!auth)
            throw HttpException_utils_1.default.notFound(message_1.Message.notFound);
        const post = this.getPostRepo.create({ ...data, postIt: auth });
        await post.save();
        console.log('Post details saved successfully');
        return post;
    }
    async update(data, userId) {
        const postId = data.id;
        console.log(postId);
        const auth = await this.getAuth.findOneBy({ id: userId });
        if (!auth)
            throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized);
        const post = await this.getPostRepo.findOneBy({ id: postId });
        if (!post)
            throw HttpException_utils_1.default.notFound;
        post.thought = data.thought;
        post.feeling = data.feeling;
        await this.getPostRepo.save(post);
        return message_1.Message.updated;
    }
    async delete(userId, postId, data) {
        try {
            const auth = await this.getAuth.findOneBy({ id: userId });
            if (!auth)
                throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized);
            const post = await this.getPostRepo.findOneBy({ postIt: auth });
            console.log(post, "hehehahaha");
            if (!post)
                throw HttpException_utils_1.default.forbidden;
            await this.getPostRepo.delete(postId);
            this.getPostRepo.delete(postId);
            return postId;
        }
        catch (error) {
            console.log(error);
            return message_1.Message.error;
        }
    }
}
exports.default = new PostService();
