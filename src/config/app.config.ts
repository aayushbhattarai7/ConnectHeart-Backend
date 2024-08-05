import express from 'express'
import middleware from '../middleware/index';
import sanitizeHtml from 'sanitize-html'

const app = express();

app.use((_, res, next)=> {
    res.locals.sanitizeHtml = sanitizeHtml
    next()
})
middleware(app)
export default app