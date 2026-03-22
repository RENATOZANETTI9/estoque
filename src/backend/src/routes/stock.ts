import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function stockRoutes(app: FastifyInstance) {
  // Get all stock movements
  app.get('/', async (request, reply) => {
    // In a real application, you would fetch from database
    // Mock response for demonstration
    return reply.status(200).send([
      {
        id: 1,
        productId: 1,
        warehouseId: 1,
        type: 'entrada',
        quantity: 10,
        unitPrice: 50.00,
        totalValue: 500.00,
        movementDate: new Date().toISOString(),
        description: 'Entrada de estoque',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ])
  })

  // Get stock movement by ID
  app.get('/:id', async (request, reply) => {
    const getStockParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = getStockParamsSchema.parse(request.params)

    // In a real application, you would fetch from database
    // Mock response for demonstration
    return reply.status(200).send({
      id,
      productId: 1,
      warehouseId: 1,
      type: 'entrada',
      quantity: 10,
      unitPrice: 50.00,
      totalValue: 500.00,
      movementDate: new Date().toISOString(),
      description: 'Entrada de estoque',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Create new stock movement (entrada, saída, transferência)
  app.post('/', async (request, reply) => {
    const createStockBodySchema = z.object({
      productId: z.number().int().positive(),
      warehouseId: z.number().int().positive(),
      type: z.enum(['entrada', 'saída', 'transferência']),
      quantity: z.number().positive(),
      unitPrice: z.number().positive().optional(),
      description: z.string().optional()
    })

    const { productId, warehouseId, type, quantity, unitPrice, description } = createStockBodySchema.parse(request.body)

    // In a real application, you would save to database
    // Calculate total value if unitPrice is provided
    const totalValue = unitPrice ? quantity * unitPrice : 0

    // Mock response for demonstration
    return reply.status(201).send({
      id: 1,
      productId,
      warehouseId,
      type,
      quantity,
      unitPrice,
      totalValue,
      movementDate: new Date().toISOString(),
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Update stock movement
  app.put('/:id', async (request, reply) => {
    const updateStockParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = updateStockParamsSchema.parse(request.params)

    const updateStockBodySchema = z.object({
      productId: z.number().int().positive().optional(),
      warehouseId: z.number().int().positive().optional(),
      type: z.enum(['entrada', 'saída', 'transferência']).optional(),
      quantity: z.number().positive().optional(),
      unitPrice: z.number().positive().optional(),
      description: z.string().optional()
    })

    const { productId, warehouseId, type, quantity, unitPrice, description } = updateStockBodySchema.parse(request.body)

    // In a real application, you would update in database
    // Calculate total value if unitPrice is provided
    const totalValue = unitPrice ? (quantity || 10) * unitPrice : 0

    // Mock response for demonstration
    return reply.status(200).send({
      id,
      productId: productId || 1,
      warehouseId: warehouseId || 1,
      type: type || 'entrada',
      quantity: quantity || 10,
      unitPrice,
      totalValue,
      movementDate: new Date().toISOString(),
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  })

  // Delete stock movement
  app.delete('/:id', async (request, reply) => {
    const deleteStockParamsSchema = z.object({
      id: z.string().regex(/^\d+$/).transform(Number)
    })

    const { id } = deleteStockParamsSchema.parse(request.params)

    // In a real application, you would delete from database
    // Mock response for demonstration
    return reply.status(200).send({
      message: `Movimentação de estoque com ID ${id} deletada com sucesso`
    })
  })
}