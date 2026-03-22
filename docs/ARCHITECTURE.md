# Arquitetura do Sistema - Sistema de Gestão de Estoque

## Visão Arquitetural

### Arquitetura Geral
```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Browser/Mobile)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────┐
│                    Load Balancer (Nginx)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
        │   Frontend   │ │   API GW   │ │   Static   │
        │   Next.js    │ │   Fastify  │ │   Assets   │
        └───────┬──────┘ └─────┬──────┘ └────────────┘
                │              │
        ┌───────▼──────────────▼──────┐
        │        Services Layer        │
        ├──────────────────────────────┤
        │ • Auth Service               │
        │ • Product Service            │
        │ • Inventory Service          │
        │ • Supplier Service           │
        │ • Report Service             │
        └───────┬──────────────┬──────┘
                │              │
        ┌───────▼──────────────▼──────┐
        │       Data Access Layer      │
        ├──────────────────────────────┤
        │ • PostgreSQL (Primary)       │
        │ • Redis (Cache/Sessions)     │
        │ • Bull (Job Queue)           │
        └──────────────────────────────┘
```

## Stack Tecnológica

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **State Management**: Zustand
- **Styling**: Tailwind CSS + CSS Modules
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library + Cypress

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Fastify
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **Rate Limiting**: fastify-rate-limit
- **CORS**: @fastify/cors
- **Swagger**: @fastify/swagger
- **Testing**: Jest + Supertest

### Banco de Dados
- **Primary**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Seeding**: Prisma Seed

### Infraestrutura
- **Container**: Docker + Docker Compose
- **Orchestration**: Docker Swarm (future: Kubernetes)
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Cloud**: Google Cloud Platform

## Design de Sistema

### Princípios Arquiteturais
1. **Separation of Concerns**: Cada serviço tem responsabilidade única
2. **Domain-Driven Design**: Organização por domínios de negócio
3. **Event-Driven**: Comunicação assíncrona entre serviços
4. **CQRS**: Separação de comandos e consultas
5. **Idempotency**: Operações podem ser repetidas sem efeitos colaterais

### Padrões de Design
- **Repository Pattern**: Abstraction de acesso a dados
- **Factory Pattern**: Criação de objetos complexos
- **Strategy Pattern**: Algoritmos intercambiáveis
- **Observer Pattern**: Notificações de eventos
- **Decorator Pattern**: Adição de funcionalidades

## API Contracts

### Autenticação
```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'operator';
  };
}

// POST /api/auth/refresh
interface RefreshResponse {
  token: string;
}
```

### Produtos
```typescript
// GET /api/products
interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minStock?: number;
  maxStock?: number;
}

interface ProductResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  cost: number;
  supplierId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/products
interface CreateProductRequest {
  code: string;
  name: string;
  description?: string;
  category: string;
  minStock: number;
  unit: string;
  price: number;
  cost: number;
  supplierId?: string;
}

// PUT /api/products/:id
interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: string;
  minStock?: number;
  price?: number;
  cost?: number;
}
```

### Movimentações
```typescript
// POST /api/inventory/entries
interface CreateEntryRequest {
  supplierId: string;
  products: Array<{
    productId: string;
    quantity: number;
    unitCost: number;
    batch?: string;
    expirationDate?: Date;
  }>;
  notes?: string;
}

// POST /api/inventory/withdrawals
interface CreateWithdrawalRequest {
  reason: 'sale' | 'transfer' | 'loss' | 'adjustment';
  destination?: string;
  products: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
  notes?: string;
}

// GET /api/inventory/movements
interface MovementResponse {
  id: string;
  type: 'entry' | 'withdrawal' | 'adjustment';
  productId: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  userId: string;
  createdAt: Date;
  metadata: Record<string, any>;
}
```

### Fornecedores
```typescript
// GET /api/suppliers
interface SupplierResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  rating: number;
  totalPurchases: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
}

// POST /api/suppliers
interface CreateSupplierRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  taxId?: string;
}
```

## Estrutura de Diretórios

```
src/
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rotas de autenticação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── products/          # Gestão de produtos
│   │   ├── inventory/         # Movimentações
│   │   ├── suppliers/         # Fornecedores
│   │   ├── reports/           # Relatórios
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Componentes básicos UI
│   │   ├── forms/             # Componentes de formulário
│   │   ├── tables/            # Componentes de tabela
│   │   └── charts/            # Componentes de gráficos
│   ├── lib/                   # Utilitários e configurações
│   │   ├── api/               # Cliente API
│   │   ├── auth/              # Autenticação
│   │   ├── store/             # Zustand stores
│   │   └── utils/             # Funções utilitárias
│   └── styles/                # Estilos globais
│
├── backend/
│   ├── src/
│   │   ├── modules/           # Módulos por domínio
│   │   │   ├── auth/          # Autenticação
│   │   │   ├── products/      # Produtos
│   │   │   ├── inventory/     # Estoque
│   │   │   ├── suppliers/     # Fornecedores
│   │   │   └── reports/       # Relatórios
│   │   ├── core/              # Núcleo da aplicação
│   │   │   ├── config/        # Configurações
│   │   │   ├── database/      # Database setup
│   │   │   ├── middleware/    # Middlewares
│   │   │   └── utils/         # Utilitários
│   │   ├── shared/            # Código compartilhado
│   │   │   ├── dtos/          # Data Transfer Objects
│   │   │   ├── schemas/       # Schemas de validação
│   │   │   └── types/         # Tipos TypeScript
│   │   └── app.ts             # Aplicação Fastify
│   └── prisma/                # Schema e migrations
│       ├── schema.prisma      # Schema do banco
│       └── migrations/        # Migrations
│
└── shared/                    # Código compartilhado
    ├── types/                 # Tipos compartilhados
    ├── constants/             # Constantes
    └── utils/                 # Utilitários compartilhados
```

## Comunicação entre Serviços

### Síncrona (HTTP/REST)
- Frontend ↔ Backend
- Serviços internos (baixa latência)

### Assíncrona (Message Queue)
- Processamento de relatórios
- Envio de notificações
- Sincronização com sistemas externos

### Eventos
```typescript
// Evento: Produto com estoque baixo
interface LowStockEvent {
  type: 'LOW_STOCK';
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  timestamp: Date;
}

// Evento: Movimentação registrada
interface MovementEvent {
  type: 'MOVEMENT_REGISTERED';
  movementId: string;
  productId: string;
  quantity: number;
  movementType: 'entry' | 'withdrawal';
  userId: string;
  timestamp: Date;
}
```

## Segurança

### Autenticação
- JWT com refresh tokens
- Tokens com expiração de 15 minutos
- Refresh tokens com expiração de 7 dias
- Revogação de tokens

### Autorização
- RBAC (Role-Based Access Control)
- Permissões granulares
- Middleware de autorização

### Proteção
- Rate limiting por IP/usuário
- CORS configurado
- Helmet para headers de segurança
- Sanitização de inputs
- Validação de schemas

## Performance

### Cache Strategy
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│     CDN     │────▶│   Redis     │
│   Cache     │     │   Cache     │     │   Cache     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                     │
                    ┌──────▼─────────────┐       │
                    │   Nginx Cache      │       │
                    └────────────────────┘       │
                           │                     │
                    ┌──────▼─────────────────────▼────┐
                    │        Application Layer        │
                    └─────────────────────────────────┘
                           │
                    ┌──────▼────┐
                    │ PostgreSQL│
                    └───────────┘
```

### Otimizações
- **Lazy Loading**: Componentes e rotas
- **Code Splitting**: Por rota e feature
- **Image Optimization**: Next.js Image
- **Database Indexing**: Índices estratégicos
- **Query Optimization**: Paginação e filtros

## Monitoramento

### Métricas
- **Application**: Request rate, error rate, latency
- **Database**: Query performance, connections, locks
- **Infrastructure**: CPU, memory, disk, network
- **Business**: User activity, feature usage

### Alertas
- **Critical**: Service down, high error rate
- **Warning**: High latency, low disk space
- **Info**: Deployment completed, user milestones

## Escalabilidade

### Horizontal Scaling
- Stateless application design
- Session storage in Redis
- Database connection pooling
- Load balancer with health checks

### Vertical Scaling
- Database optimization
- Query caching
- Connection pooling tuning

## Deployment

### Ambiente de Desenvolvimento
- Docker Compose local
- Hot reload para frontend/backend
- Database seeding automático

### Ambiente de Produção
- Multi-container deployment
- Blue-green deployment
- Database migrations automáticas
- Rollback strategy

## Considerações Futuras

### Microservices
- Separação por domínio de negócio
- API Gateway para roteamento
- Service discovery
- Circuit breaker pattern

### Serverless
- Funções para processamento batch
- Event-driven architecture
- Pay-per-use cost model

### Multi-tenant
- Isolamento de dados por tenant
- Shared database, separate schemas
- Tenant-aware middleware

---

**Versão**: 1.0  
**Última Atualização**: 2026-03-22  
**Responsável**: Renato Zanetti Gomes  
**Status**: Em desenvolvimento