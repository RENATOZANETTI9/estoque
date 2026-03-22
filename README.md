# Sistema de Controle de Estoque

Sistema completo de gerenciamento de estoque desenvolvido com Next.js, Fastify, PostgreSQL e Docker.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 15 (React 19) com TypeScript
- **Backend**: Fastify (Node.js) com TypeScript
- **Banco de Dados**: PostgreSQL 16
- **Containerização**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Proxy**: Nginx
- **Tunnel**: Cloudflared (para acesso externo seguro)

## 📁 Estrutura do Projeto

```
estoque/
├── apps/
│   ├── frontend/          # Aplicação Next.js
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── backend/           # API Fastify
│       ├── src/
│       ├── package.json
│       └── Dockerfile
│
├── infra/
│   ├── docker-compose.yml # Orquestração de containers
│   ├── nginx/
│   │   └── nginx.conf     # Configuração do proxy reverso
│   └── scripts/           # Scripts de deploy
│
├── docs/                  # Documentação
├── .github/
│   └── workflows/         # GitHub Actions
│
├── .gitignore
├── docker-compose.yml     # Configuração principal
└── README.md
```

## 🏃‍♂️ Como Rodar Localmente

### Pré-requisitos
- Docker 24+ e Docker Compose
- Node.js 20+ (apenas para desenvolvimento local)
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/renatozanetti9/estoque.git
cd estoque
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Inicie os containers
```bash
docker-compose up -d
```

### 4. Acesse a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050 (opcional)

### 5. Para desenvolvimento local (sem Docker)
```bash
# Backend
cd apps/backend
npm install
npm run dev

# Frontend (em outro terminal)
cd apps/frontend
npm install
npm run dev
```

## 🐳 Docker Compose

O projeto utiliza Docker Compose para orquestração com os seguintes serviços:

1. **postgres**: Banco de dados PostgreSQL
2. **backend**: API Fastify
3. **frontend**: Aplicação Next.js
4. **nginx**: Proxy reverso
5. **pgadmin**: Interface web para PostgreSQL (opcional)

### Comandos úteis
```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir e reiniciar
docker-compose up -d --build

# Executar comandos em um container
docker-compose exec backend npm run test
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# PostgreSQL
POSTGRES_DB=estoque
POSTGRES_USER=estoque_user
POSTGRES_PASSWORD=senha_segura

# Backend
NODE_ENV=development
DATABASE_URL=postgresql://estoque_user:senha_segura@postgres:5432/estoque
JWT_SECRET=seu_jwt_secret_aqui
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📦 Scripts de Desenvolvimento

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start            # Iniciar em produção
npm run test         # Executar testes
npm run lint         # Verificar código
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start            # Iniciar em produção
npm run test         # Executar testes
npm run lint         # Verificar código
```

## 🧪 Testes

```bash
# Executar todos os testes
docker-compose exec backend npm test
docker-compose exec frontend npm test

# Executar testes com cobertura
docker-compose exec backend npm run test:coverage
```

## 📊 Banco de Dados

### Migrações
```bash
# Executar migrações
docker-compose exec backend npm run migrate:up

# Reverter migrações
docker-compose exec backend npm run migrate:down
```

### Backup
```bash
# Backup do banco
docker-compose exec postgres pg_dump -U estoque_user estoque > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U estoque_user estoque < backup.sql
```

## 🔒 Segurança

- Containers rodam como usuários não-root
- Portas expostas apenas quando necessário
- Secrets gerenciados via variáveis de ambiente
- Health checks em todos os serviços críticos
- Resource limits definidos para todos os containers

## 🚀 Deploy

### Produção
```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD
O projeto inclui GitHub Actions para:
- Build e testes automatizados
- Análise de segurança
- Deploy automatizado em staging/produção

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato com **Renato Zanetti Gomes** ou abra uma issue no repositório.