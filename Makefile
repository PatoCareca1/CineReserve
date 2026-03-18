.PHONY: help build up down logs migrate test seed

help:
	@echo "Comandos disponíveis:"
	@echo "  make build    - Constrói as imagens Docker"
	@echo "  make up       - Inicia a aplicação e os serviços em background"
	@echo "  make down     - Para e remove os containers"
	@echo "  make logs     - Mostra os logs da aplicação em tempo real"
	@echo "  make migrate  - Aplica as migrações na base de dados"
	@echo "  make test     - Corre toda a suite de testes"
	@echo "  make seed     - Popula a base de dados com um filme e assentos de teste"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

migrate:
	docker-compose exec web python manage.py migrate

test:
	docker-compose exec web python manage.py test

seed:
	docker-compose exec web python manage.py seed_db