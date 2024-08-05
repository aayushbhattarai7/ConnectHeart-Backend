"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../middleware/index"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const app = (0, express_1.default)();
app.use((_, res, next) => {
    res.locals.sanitizeHtml = sanitize_html_1.default;
    next();
});
(0, index_1.default)(app);
exports.default = app;
