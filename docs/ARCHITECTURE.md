# Arquitetura do Sistema
# Sistema de Controle de Estoque

## Visão Arquitetural
Sistema baseado em microserviços com frontend Next.js 15 (App Router) e backend Fastify, utilizando PostgreSQL como banco de dados principal.

## Stack Tecnológica

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript 5.x
- **UI Library:** Shadcn/ui + Tailwind CSS
- **Estado:** React Query (TanStack Query) + Zustand
- **Formulários:** React Hook Form + Zod
- **Testes:** Jest + React Testing Library + Playwright
- **Build:** Turbopack (dev) + Webpack (prod)

### Backend
- **Framework:** Fastify 4.x
- **Linguagem:** TypeScript 5.x
- **ORM:** Prisma 5.x
- **Autenticação:** JWT + bcrypt
- **Validação:** Zod
- **Logging:** Pino
- **Testes:** Jest + Supertest
- **Documentação:** Swagger/OpenAPI 3.0

### Banco de Dados
- **Principal:** PostgreSQL 16.x
- **Cache:** Redis 7.x (opcional para produção)
- **Migrations:** Prisma Migrate
- **Backup:** pg_dump + WAL archiving

### Infraestrutura
- **Containerização:** Docker + Docker Compose
- **Orquestração:** Kubernetes (produção)
- **Cloud:** Google Cloud Platform (GCP)
- **CI/CD:** GitHub Actions
- **Monitoramento:** Prometheus + Grafana
- **Logs:** Loki + Grafana
- **Proxy:** Nginx

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuário (Browser)                        │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS (443)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (Reverse Proxy)                     │
│                    - SSL Termination                         │
│                    - Rate Limiting                          │
│                    - Compression                            │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
    ┌────────────────────┐        ┌────────────────────┐
    │   Frontend         │        │   Backend API      │
    │   Next.js 15       │        │   Fastify          │
    │   Port: 3000       │        │   Port: 3001       │
    └──────────┬─────────┘        └──────────┬─────────┘
               │                              │
               │                              │
    ┌──────────▼─────────┐        ┌──────────▼─────────┐
    │   Static Assets     │        │   API Gateway      │
    │   (CDN)            │        │   - Auth           │
    │   Vercel/Cloud     │        │   - Validation     │
    │   Storage          │        │   - Rate Limiting  │
    └────────────────────┘        └──────────┬─────────┘
                                             │
                                  ┌──────────▼─────────┐
                                  │   Service Layer    │
                                  │   - Products       │
                                  │   - Inventory      │
                                  │   - Reports        │
                                  └──────────┬─────────┘
                                             │
                                  ┌──────────▼─────────┐
                                  │   Data Access      │
                                  │   Layer (Prisma)   │
                                  └──────────┬─────────┘
                                             │
                                  ┌──────────▼─────────┐
                                  │   PostgreSQL       │
                                  │   Database         │
                                  └────────────────────┘
```

## Design de API

### Padrões REST
- **Versionamento:** `/api/v1/`
- **Autenticação:** Bearer Token (JWT)
- **Content-Type:** `application/json`
- **Status Codes:** HTTP padrão
- **Paginação:** `limit` e `offset`
- **Ordenação:** `sort` e `order`
- **Filtros:** query parameters

### Endpoints Principais

#### Autenticação
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

#### Produtos
```
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
GET    /api/v1/products/search
GET    /api/v1/products/categories
```

#### Movimentações
```
GET    /api/v1/movements
POST   /api/v1/movements/entry
POST   /api/v1/movements/exit
GET    /api/v1/movements/:id
GET    /api/v1/movements/product/:productId
GET    /api/v1/movements/report
```

#### Relatórios
```
GET    /api/v1/reports/inventory
GET    /api/v1/reports/movements
GET    /api/v1/reports/dashboard
POST   /api/v1/reports/export
```

### Modelos de Dados (TypeScript)

```typescript
// Product
interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  location?: string;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Movement
interface Movement {
  id: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT' | 'TRANSFER';
  productId: string;
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  reference?: string; // NF, pedido, etc
  userId: string;
  notes?: string;
  createdAt: Date;
}

// Category
interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
}

// User
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}
```

## Padrões de Código

### Frontend
- **Componentes:** Atomic Design (atoms, molecules, organisms)
- **Estilização:** Tailwind CSS com classes utilitárias
- **Estado:** Server components quando possível, client quando necessário
- **API Calls:** React Query com caching automático
- **Error Handling:** Error boundaries + toast notifications
- **Loading States:** Skeletons + Suspense

### Backend
- **Estrutura:** Controller → Service → Repository
- **Validação:** Zod schemas em todas as entradas
- **Erros:** HTTP status codes apropriados + mensagens claras
- **Logging:** Structured logging com Pino
- **Segurança:** Helmet, CORS, rate limiting
- **Testes:** Unit + Integration + E2E

## Estratégia de Deploy

### Desenvolvimento
```
docker-compose up -d
```

### Staging
- Branch `staging` → Auto-deploy para GCP Cloud Run
- Banco de dados separado
- Dados de teste

### Produção
- Branch `main` → Manual deploy (aprovação necessária)
- Blue/Green deployment
- Database migrations automáticas
- Health checks + rollback automático

## Monitoramento e Observabilidade

### Métricas
1. **Performance:** Response time, throughput, error rate
2. **Business:** Total products, inventory value, movements/day
3. **Infra:** CPU, memory, disk, network
4. **User:** Active users, session duration, feature usage

### Logs
- Estruturados em JSON
- Níveis: error, warn, info, debug
- Contexto: userId, requestId, timestamp
- Centralizados no Loki

### Alertas
- Error rate > 1%
- Response time P95 > 500ms
- Database connections > 80%
- Disk usage > 85%

## Escalabilidade

### Horizontal Scaling
- Stateless backend services
- Database connection pooling
- Redis para session cache
- CDN para assets estáticos

### Vertical Scaling
- Auto-scaling baseado em CPU/memory
- Database read replicas
- Cache layers (Redis)

### Database
- Índices otimizados para queries frequentes
- Partitioning por data para movements
- Read replicas para relatórios
- Backup automático + point-in-time recovery

## Segurança

### Camadas
1. **Network:** VPC, firewall rules, private endpoints
2. **Application:** Input validation, output encoding, CSRF protection
3. **Data:** Encryption at rest + in transit, role-based access
4. **Authentication:** JWT with short expiration, refresh tokens
5. **Authorization:** RBAC (Admin, Manager, Operator)

### Compliance
- LGPD/GDPR compliance
- Audit logging
- Data retention policies
- Regular security audits

## Decisões Arquiteturais

### 1. Next.js 15 (App Router)
**Decisão:** Usar App Router em vez de Pages Router
**Justificativa:** Melhor performance (Server Components), melhor DX, suporte a layouts aninhados
**Trade-offs:** Learning curve, menos bibliotecas compatíveis

### 2. Fastify em vez de Express
**Decisão:** Fastify para backend
**Justificativa:** 2x mais rápido, schema validation nativo, melhor TypeScript support
**Trade-offs:** Menos middleware disponível

### 3. Prisma em vez de TypeORM/Sequelize
**Decisão:** Prisma como ORM
**Justificativa:** Type safety, migrations automáticas, melhor DX
**Trade-offs:** Performance em queries complexas

### 4. PostgreSQL em vez de MongoDB
**Decisão:** PostgreSQL como banco principal
**Justificativa:** Transações ACID, joins eficientes, JSONB para flexibilidade
**Trade-offs:** Menos escalável horizontalmente

### 5. Docker Compose para desenvolvimento
**Decisão:** Docker Compose local
**Justificativa:** Ambiente consistente, fácil setup, reproduzível
**Trade-offs:** Overhead de recursos

## Considerações Futuras

### Fase 2
- Microserviços separados para relatórios pesados
- Message queue (RabbitMQ) para processamento assíncrono
- Elasticsearch para busca avançada

### Fase 3
- Kubernetes para orquestração
- Service mesh (Istio)
- Multi-region deployment
- Disaster recovery automatizado

---

*Documento mantido por: Renato Zanetti Gomes*  
*Última atualização: 2026-03-22*  
*Versão: 1.0*