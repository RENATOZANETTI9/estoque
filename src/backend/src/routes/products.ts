import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function productsRoutes(app: FastifyInstance) {
  // Get all products
  app.get('/', async (request, reply) => {
    // In a real application, you would fetch from database
    // Mock response for demonstration
    return reply.status(200).send([
      {
        id: 1,
        name: 'Produto Exemplo',
        description: 'Descrição do produto exemplo',
        price: 99.99,
        categoryId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])
  })

  // Get product by ID
  app.get('/:id', async (request, reply) => {
    const getProductParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = getProductParamsSchema.parse(request.params)

    // In a real application, you would fetch from database
    // Mock response for demonstration
    return reply.status(200).send({
      id,
      name: 'Produto Exemplo',
      description: 'Descrição do produto exemplo',
      price: 99.99,
      categoryId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Create new product
  app.post('/', async (request, reply) => {
    const createProductBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.number().positive(),
      categoryId: z.number().int().positive()
    })

    const { name, description, price, categoryId } = createProductBodySchema.parse(request.body)

    // In a real application, you would save to database
    // Mock response for demonstration
    return reply.status(201).send({
      id: 1,
      name,
      description,
      price,
      categoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Update product
  app.put('/:id', async (request, reply) => {
    const updateProductParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = updateProductParamsSchema.parse(request.params)

    const updateProductBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      categoryId: z.number().int().positive().optional()
    })

    const { name, description, price, categoryId } = updateProductBodySchema.parse(request.body)

    // In a real application, you would update in database
    // Mock response for demonstration
    return reply.status(200).send({
      id,
      name: name || 'Produto Exemplo',
      description: description || 'Descrição do produto exemplo',
      price: price || 99.99,
      categoryId: categoryId || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Delete product
  app.delete('/:id', async (request, reply) => {
    const deleteProductParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = deleteProductParamsSchema.parse(request.params)

    // In a real application, you would delete from database
    // Mock response for demonstration
    return reply.status(200).send({
      message: `Produto com ID ${id} deletado com sucesso`
    })
  })
}