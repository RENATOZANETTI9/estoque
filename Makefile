# Makefile for Estoque Application
# Author: Renato Zanetti Gomes
# Date: 2026-03-22

.PHONY: help dev build test up down clean logs restart migrate seed

# Default target
help:
	@echo "Estoque Application - Makefile Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start development environment"
	@echo "  make build         - Build all services"
	@echo "  make test          - Run tests"
	@echo "  make lint          - Run linters"
	@echo ""
	@echo "Docker:"
	@echo "  make up            - Start all services with docker-compose"
	@echo "  make down          - Stop all services"
	@echo "  make logs          - Show logs for all services"
	@echo "  make restart       - Restart all services"
	@echo "  make clean         - Remove containers, volumes, and images"
	@echo ""
	@echo "Database:"
	@echo "  make migrate       - Run database migrations"
	@echo "  make seed          - Seed database with sample data"
	@echo "  make db-reset      - Reset database (drop, create, migrate, seed)"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy        - Deploy to production"
	@echo "  make rollback      - Rollback to previous version"

# Development commands
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up --build

build:
	@echo "Building all services..."
	docker-compose build

test:
	@echo "Running tests..."
	docker-compose run --rm backend npm test
	docker-compose run --rm frontend npm test

lint:
	@echo "Running linters..."
	@if [ -f "src/backend/package.json" ] && grep -q '"lint"' src/backend/package.json; then \
		docker-compose run --rm backend npm run lint; \
	else \
		echo "No lint script found in backend"; \
	fi
	@if [ -f "src/frontend/package.json" ] && grep -q '"lint"' src/frontend/package.json; then \
		docker-compose run --rm frontend npm run lint; \
	else \
		echo "No lint script found in frontend"; \
	fi

# Docker commands
up:
	@echo "Starting all services..."
	docker-compose up -d

down:
	@echo "Stopping all services..."
	docker-compose down

logs:
	@echo "Showing logs..."
	docker-compose logs -f

restart:
	@echo "Restarting all services..."
	docker-compose restart

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Database commands
migrate:
	@echo "Running database migrations..."
	docker-compose run --rm backend npx prisma migrate deploy

seed:
	@echo "Seeding database..."
	docker-compose run --rm backend npx prisma db seed

db-reset:
	@echo "Resetting database..."
	docker-compose run --rm backend npx prisma migrate reset --force

# Deployment commands
deploy:
	@echo "Deploying to production..."
	@if [ -f ".env.production" ]; then \
		docker-compose -f docker-compose.prod.yml pull; \
		docker-compose -f docker-compose.prod.yml up -d --remove-orphans; \
		echo "Deployment completed successfully!"; \
	else \
		echo "Error: .env.production file not found"; \
		exit 1; \
	fi

rollback:
	@echo "Rolling back to previous version..."
	@if [ -f ".env.production" ]; then \
		docker-compose -f docker-compose.prod.yml down; \
		docker-compose -f docker-compose.prod.yml up -d --remove-orphans; \
		echo "Rollback completed successfully!"; \
	else \
		echo "Error: .env.production file not found"; \
		exit 1; \
	fi

# Health checks
health:
	@echo "Checking service health..."
	@curl -f http://localhost:8080/health || echo "Nginx is not healthy"
	@curl -f http://localhost:3001/health || echo "Backend is not healthy"

# Backup commands
backup:
	@echo "Creating backup..."
	@mkdir -p backups
	@docker exec estoque-db pg_dump -U postgres estoque > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/ directory"

# Monitoring
stats:
	@echo "Container statistics:"
	docker stats --no-stream

ps:
	@echo "Running containers:"
	docker-compose ps

# Environment setup
env-setup:
	@echo "Setting up environment..."
	@if [ ! -f ".env" ]; then \
		cp .env.example .env; \
		echo "Created .env file from example"; \
	else \
		echo ".env file already exists"; \
	fi
	@if [ ! -f ".env.production" ]; then \
		cp .env.example .env.production; \
		echo "Created .env.production file from example"; \
	else \
		echo ".env.production file already exists"; \
	fi

# Security scan
security-scan:
	@echo "Running security scan..."
	@if command -v trivy >/dev/null 2>&1; then \
		trivy image renatozanetti9/estoque-backend:latest; \
		trivy image renatozanetti9/estoque-frontend:latest; \
	else \
		echo "Trivy not installed. Install with: brew install trivy"; \
	fi