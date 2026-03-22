import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { productsRoutes } from './routes/products'
import { categoriesRoutes } from './routes/categories'
import { stockRoutes } from './routes/stock'

const app = fastify()

// Register plugins
app.register(cors, {
  origin: true,
  credentials: true
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'default_secret_key'
})

// Register routes
app.register(authRoutes, { prefix: '/auth' })
app.register(productsRoutes, { prefix: '/products' })
app.register(categoriesRoutes, { prefix: '/categories' })
app.register(stockRoutes, { prefix: '/stock' })

// Health check route
app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

export default app