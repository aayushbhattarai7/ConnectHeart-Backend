"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../constant/message");
const StatusCodes_1 = require("../constant/StatusCodes");
const post_service_1 = __importDefault(require("../services/post.service"));
class PostController {
    async create(req, res) {
        const id = req.user?.id;
        await post_service_1.default.create(req.body, id);
        res.status(StatusCodes_1.StatusCodes.CREATED).json(message_1.Message.created);
    }
    async update(req, res) {
        const userId = req.user?.id;
        await post_service_1.default.update(req.body, userId);
        res.status(StatusCodes_1.StatusCodes.SUCCESS).json(message_1.Message.updated);
    }
    async delete(req, res) {
        const userId = req.user?.id;
        const postId = req.params.id;
        console.log(postId, "posttttt");
        await post_service_1.default.delete(userId, postId, req.body);
        res.status(StatusCodes_1.StatusCodes.SUCCESS).json(message_1.Message.deleted);
    }
}
exports.default = new PostController();
