import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function categoriesRoutes(app: FastifyInstance) {
  // Get all categories
  app.get('/', async (request, reply) => {
    // In a real application, you would fetch from database
    // Mock response for demonstration
    return reply.status(200).send([
      {
        id: 1,
        name: 'Eletrônicos',
        description: 'Categorias de eletrônicos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])
  })

  // Get category by ID
  app.get('/:id', async (request, reply) => {
    const getCategoryParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = getCategoryParamsSchema.parse(request.params)

    // In a real application, you would fetch from database
    // Mock response for demonstration
    return reply.status(200).send({
      id,
      name: 'Eletrônicos',
      description: 'Categorias de eletrônicos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Create new category
  app.post('/', async (request, reply) => {
    const createCategoryBodySchema = z.object({
      name: z.string(),
      description: z.string().optional()
    })

    const { name, description } = createCategoryBodySchema.parse(request.body)

    // In a real application, you would save to database
    // Mock response for demonstration
    return reply.status(201).send({
      id: 1,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Update category
  app.put('/:id', async (request, reply) => {
    const updateCategoryParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = updateCategoryParamsSchema.parse(request.params)

    const updateCategoryBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional()
    })

    const { name, description } = updateCategoryBodySchema.parse(request.body)

    // In a real application, you would update in database
    // Mock response for demonstration
    return reply.status(200).send({
      id,
      name: name || 'Eletrônicos',
      description: description || 'Categorias de eletrônicos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Delete category
  app.delete('/:id', async (request, reply) => {
    const deleteCategoryParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = deleteCategoryParamsSchema.parse(request.params)

    // In a real application, you would delete from database
    // Mock response for demonstration
    return reply.status(200).send({
      message: `Categoria com ID ${id} deletada com sucesso`
    })
  })
}