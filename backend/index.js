/* eslint-env node */
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyCors from '@fastify/cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const buildPath = path.join(__dirname, 'build')
const fastify = Fastify({ logger: true })
const httpServer = createServer(fastify.server)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id)
  })
})

await fastify.register(fastifyCors, {
  origin: '*',
  credentials: true,
})

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  try {
    const json = JSON.parse(body)
    done(null, json)
  }
  catch (err) {
    err.statusCode = 400
    done(err, undefined)
  }
})

fastify.post('/api/v1/signup', async (request, reply) => {
  const { username, password } = request.body

  if (!username || !password) {
    return reply.code(400).send({ message: 'Username and password are required' })
  }

  if (username === 'admin') {
    return reply.code(409).send({ message: 'User already exists' })
  }

  const user = {
    username,
    token: 'fake-jwt-token',
  }

  return reply.code(201).send(user)
})

fastify.register(fastifyStatic, {
  root: buildPath,
})

fastify.setNotFoundHandler((request, reply) => {
  reply.type('text/html').sendFile('index.html')
})

const start = async () => {
  try {
    const PORT = process.env.PORT || 5001
    await fastify.ready()
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`)
    })
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
