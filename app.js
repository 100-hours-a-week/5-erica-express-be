import express from 'express'
import http from 'http'
import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import commentRouter from './routes/comment.js'
import porfileImageRouter from './routes/profileImage.js'
import postImageRouter from './routes/postImage.js'

import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const server = http.createServer(app)
const port = 8000
const corsOptions = {
	origin: '*'
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.text())

app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/posts', commentRouter)
app.use('/images/profile', porfileImageRouter)
app.use('/images/post', postImageRouter)

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
