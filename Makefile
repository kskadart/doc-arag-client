.PHONY: help dev build start stop logs clean install

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Run development server
	npm run dev

build: ## Build production bundle
	npm run build

docker-build: ## Build Docker image
	docker compose build

up: ## Start all services with Docker Compose
	docker compose up -d

down: ## Stop all services
	docker compose down

logs: ## View logs
	docker compose logs -f

restart: ## Restart all services
	docker compose restart

clean: ## Clean build artifacts and dependencies
	rm -rf .next node_modules

rebuild: clean install build ## Clean and rebuild everything

docker-rebuild: down ## Rebuild and restart Docker services
	docker compose build --no-cache
	docker compose up -d

status: ## Show status of services
	docker compose ps

