# Arquitetura do Sistema - Controle de Estoque

## Visão Geral da Arquitetura

Sistema baseado em microserviços com frontend monolítico, projetado para alta disponibilidade, escalabilidade horizontal e manutenibilidade.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Browser/Mobile)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────┐
│                    Cloudflare CDN + WAF                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Nginx (Load Balancer)                    │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
    ┌──────────▼──────────┐        ┌──────────▼──────────┐
    │   Frontend (Next.js)│        │   Backend (Fastify) │
    │   - SSR/SSG         │        │   - API REST        │
    │   - PWA             │        │   - WebSocket       │
    └──────────┬──────────┘        └──────────┬──────────┘
               │                              │
    ┌──────────▼──────────────────────────────▼──────────┐
    │              Service Mesh (Consul)                 │
    │              - Service Discovery                   │
    │              - Health Checks                       │
    │              - Circuit Breaker                     │
    └──────────┬──────────────────────────────┬──────────┘
               │                              │
    ┌──────────▼──────────┐        ┌──────────▼──────────┐
    │   PostgreSQL        │        │   Redis             │
    │   - Primary         │        │   - Cache           │
    │   - Replica         │        │   - Session         │
    │   - Read Replicas   │        │   - Pub/Sub         │
    └─────────────────────┘        └─────────────────────┘
```

## Stack Tecnológica

### Frontend (Next.js 15)
- **Framework**: Next.js 15 com App Router
- **UI Library**: React 19 + TypeScript
- **State Management**: Zustand (leve) + React Query
- **Styling**: Tailwind CSS + CSS Modules
- **Forms**: React Hook Form + Zod (validação)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Internationalization**: next-intl
- **Testing**: Jest + React Testing Library + Cypress

### Backend (Fastify)
- **Framework**: Fastify 4.x (alta performance)
- **Language**: TypeScript
- **Validation**: Zod + @fastify/type-provider-zod
- **Authentication**: @fastify/jwt + @fastify/cookie
- **Database ORM**: Prisma (type-safe)
- **Caching**: @fastify/redis
- **Rate Limiting**: @fastify/rate-limit
- **WebSocket**: @fastify/websocket
- **File Upload**: @fastify/multipart
- **Documentação**: @fastify/swagger + @fastify/swagger-ui
- **Testing**: Jest + Supertest

### Banco de Dados
- **Primary**: PostgreSQL 16 (transacional)
- **Cache**: Redis 7 (sessões, cache, pub/sub)
- **Search**: Elasticsearch 8 (busca full-text)
- **Queue**: RabbitMQ (processamento assíncrono)

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (produção)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger
- **Proxy**: Nginx
- **Tunnel**: Cloudflared (para acesso externo)

## Design de Sistema

### Princípios de Design
1. **Separation of Concerns**: Cada serviço tem responsabilidade única
2. **Loose Coupling**: Comunicação via API REST/WebSocket
3. **High Cohesion**: Componentes relacionados agrupados
4. **Fail Fast**: Validação precoce e tratamento de erros
5. **Idempotency**: Operações repetíveis sem efeitos colaterais

### Padrões Arquiteturais
- **Clean Architecture**: Domínio → Aplicação → Infraestrutura
- **CQRS**: Separação de comandos (write) e queries (read)
- **Event Sourcing**: Histórico imutável de eventos
- **Repository Pattern**: Abstração de acesso a dados
- **Strategy Pattern**: Algoritmos intercambiáveis
- **Observer Pattern**: Notificações e eventos

## API Contracts

### REST API Design

#### Base URL
```
https://api.estoque.zanetti.dev/v1
```

#### Autenticação
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@empresa.com",
  "password": "senha123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@empresa.com",
    "role": "admin"
  }
}
```

#### Produtos
```http
GET /products
Authorization: Bearer {token}
Query Params:
  - page: number (default: 1)
  - limit: number (default: 20)
  - search: string
  - category: string
  - sort: "name" | "created_at" | "updated_at"
  - order: "asc" | "desc"

POST /products
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "code": "PROD001",
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "category_id": "uuid",
  "unit": "UN",
  "price": 29.90,
  "cost": 15.50,
  "min_stock": 10,
  "max_stock": 100,
  "image": File
}
```

#### Movimentações
```http
POST /movements
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "ENTRY", // ENTRY, EXIT, ADJUSTMENT, TRANSFER
  "product_id": "uuid",
  "quantity": 10,
  "unit_price": 15.50,
  "document_number": "NF123456",
  "date": "2026-03-22T10:00:00Z",
  "notes": "Notas adicionais"
}
```

### WebSocket API
```javascript
// Conexão
const ws = new WebSocket('wss://api.estoque.zanetti.dev/ws');

// Eventos
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'AUTH',
    token: 'jwt_token'
  }));
  
  ws.send(JSON.stringify({
    type: 'SUBSCRIBE',
    channel: 'stock_updates'
  }));
};

// Recebendo atualizações em tempo real
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'STOCK_UPDATE':
      console.log('Estoque atualizado:', data.payload);
      break;
    case 'ALERT':
      console.log('Alerta:', data.payload);
      break;
  }
};
```

## Estrutura de Diretórios

### Frontend (Next.js)
```
apps/frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── (auth)/            # Rotas de autenticação
│   │   ├── (dashboard)/       # Rotas do dashboard
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # Layout raiz
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Componentes base
│   │   ├── forms/             # Componentes de formulário
│   │   ├── tables/            # Componentes de tabela
│   │   └── charts/            # Componentes de gráficos
│   ├── lib/                   # Utilitários
│   │   ├── api/               # Cliente HTTP
│   │   ├── auth/              # Autenticação
│   │   ├── utils/             # Funções utilitárias
│   │   └── constants/         # Constantes
│   ├── hooks/                 # Custom hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   └── styles/                # Estilos globais
├── public/                    # Arquivos estáticos
└── tests/                     # Testes
```

### Backend (Fastify)
```
apps/backend/
├── src/
│   ├── core/                  # Núcleo da aplicação
│   │   ├── domain/            # Entidades e value objects
│   │   ├── application/       # Casos de uso
│   │   └── infrastructure/    # Implementações externas
│   ├── modules/               # Módulos da aplicação
│   │   ├── auth/              # Autenticação
│   │   ├── products/          # Produtos
│   │   ├── movements/         # Movimentações
│   │   ├── reports/           # Relatórios
│   │   └── users/             # Usuários
│   ├── shared/                # Código compartilhado
│   │   ├── errors/            # Erros customizados
│   │   ├── middleware/        # Middleware global
│   │   ├── plugins/           # Plugins Fastify
│   │   └── utils/             # Utilitários
│   ├── config/                # Configurações
│   ├── database/              # Configuração do banco
│   └── server.ts              # Ponto de entrada
├── prisma/                    # Schema Prisma
└── tests/                     # Testes
```

## Comunicação entre Serviços

### Síncrona (HTTP/REST)
- Frontend → Backend (API REST)
- Backend → Serviços externos (integrações)
- Health checks entre serviços

### Assíncrona (Eventos)
```typescript
// Producer (Backend)
await rabbitmq.publish('stock.movement.created', {
  productId: 'uuid',
  quantity: 10,
  type: 'ENTRY',
  userId: 'uuid',
  timestamp: new Date().toISOString()
});

// Consumer (Serviço de Notificações)
rabbitmq.subscribe('stock.movement.created', async (message) => {
  if (message.quantity < 0) {
    await notificationService.sendLowStockAlert(message.productId);
  }
});
```

### Em Tempo Real (WebSocket)
- Atualizações de estoque em tempo real
- Notificações push para usuários
- Dashboard com métricas ao vivo

## Segurança

### Camadas de Segurança
1. **Cloudflare WAF**: Proteção contra DDoS e ataques web
2. **Nginx**: Rate limiting e filtragem básica
3. **Application Layer**: Validação de entrada, sanitização
4. **Database Layer**: Prepared statements, row-level security
5. **Infrastructure**: Network policies, secrets management

### Autenticação e Autorização
- JWT com refresh tokens
- RBAC (Role-Based Access Control)
- Permissões granulares por recurso
- Sessões distribuídas no Redis
- 2FA opcional para administradores

### Criptografia
- TLS 1.3 em todas as comunicações
- Dados sensíveis criptografados em repouso (AES-256)
- Senhas com bcrypt (cost: 12)
- Secrets no HashiCorp Vault (produção)

## Monitoramento e Observabilidade

### Métricas
```prometheus
# Métricas customizadas
estoque_products_total
estoque_movements_total{type="ENTRY|EXIT"}
estoque_users_active
estoque_api_requests_total{endpoint,method,status}
estoque_api_response_time_seconds{endpoint,method}

# Métricas de sistema
container_cpu_usage
container_memory_usage
postgres_connections_active
redis_memory_used
```

### Logs Estruturados
```json
{
  "timestamp": "2026-03-22T10:00:00Z",
  "level": "INFO",
  "service": "backend",
  "module": "products",
  "operation": "create",
  "userId": "uuid",
  "productId": "uuid",
  "duration": 150,
  "requestId": "req-123",
  "message": "Product created successfully"
}
```

### Tracing Distribuído
```
Frontend (req-123)
  ├── Backend API (req-123)
  │   ├── Database Query (req-123)
  │   └── Cache Get (req-123)
  └── External Service (req-123)
```

## Escalabilidade

### Horizontal Scaling
- Frontend: Stateless, escala ilimitada
- Backend: Stateless com session no Redis
- PostgreSQL: Read replicas + connection pooling
- Redis: Cluster mode
- Nginx: Load balancing round-robin

### Vertical Scaling
- PostgreSQL: Máquinas com mais RAM/CPU
- Redis: Instâncias maiores para cache
- Backend: Instâncias com mais CPU para processamento

### Estratégias de Cache
1. **CDN**: Assets estáticos (Cloudflare)
2. **Redis**: Dados frequentemente acessados
3. **Browser Cache**: Assets versionados
4. **Database Cache**: Materialized views, índices

## Deployment

### Ambiente de Desenvolvimento
```bash
docker-compose up -d
```

### Ambiente de Staging
- Kubernetes namespace isolado
- Banco de dados separado
- Configurações similares à produção
- Deploy automático via CI/CD

### Ambiente de Produção
- Kubernetes cluster multi-AZ
- PostgreSQL com replicação síncrona
- Redis cluster 3 nodes
- Nginx ingress controller
- Certificados Let's Encrypt automáticos
- Backup automático diário

### CI/CD Pipeline
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: docker-compose run backend npm test
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build and push Docker images
        run: docker build -t estoque-frontend:latest .
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/
```

## Disaster Recovery

### RTO (Recovery Time Objective): 4 horas
### RPO (Recovery Point Objective): 1 hora

### Plano de Recuperação
1. **Identificação**: Monitoramento detecta falha
2. **Contenção**: Isolar componente afetado
3. **Recuperação**: Restaurar do backup mais recente
4. **Validação**: Testes de integridade
5. **Retorno**: Retomar operações normais

### Backups
- PostgreSQL: Backup contínuo (WAL) + snapshots diários
- Redis: RDB snapshots a cada hora
- Arquivos: Backup no S3 compatível
- Configurações: Versionadas no Git

---

**Arquitetura mantida por:** Renato Zanetti Gomes  
**Última revisão:** 2026-03-22  
**Versão:** 2.0.0