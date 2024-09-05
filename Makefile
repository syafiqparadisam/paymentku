

USER_SVC_PATH := services/user
HISTORY_SVC_PATH := services/history
TRANSACTION_SVC_PATH := services/transaction
AUTH_SVC_PATH := services/auth
COMPOSE_PATH := docker/compose/dev
COMPOSE_PATH_TEST=docker/compose/test


dev-docker:
	docker compose -f ${COMPOSE_PATH}/compose.yml up -d

test-docker:
	docker compose -f ${COMPOSE_PATH_TEST}/compose.yml up -d

# USER START
run-user: docker
	cd ${USER_SVC_PATH} && go build -o server.out server.go && ./server

test-user: docker
	cd ${USER_SVC_PATH}/test && go test -v ./... --count=1

install-user: 
	cd ${USER_SVC_PATH} && go mod download
# USER END

generate:
	cd ${AUTH_SVC_PATH} && npx drizzle-kit generate

# TRANSACTION START
run-transaction: docker	
	cd ${TRANSACTION_SVC_PATH} && go build -o server.out server.go && ./server

test-transaction:
	cd ${TRANSACTION_SVC_PATH}/test && go test -v ./... --count=1
# TRANSACTION END

# HISTORY START
run-history: docker
	cd ${HISTORY_SVC_PATH} && go build -o server.out server.go && ./server
	

test-history: docker
	cd ${HISTORY_SVC_PATH}/test && go test -v ./... --count=1
# HISTORY END

# AUTHENTICATION START
run-auth: docker
	cd ${AUTH_SVC_PATH} && npm run start:dev


test-auth: docker
	cd ${AUTH_SVC_PATH}/test && npm run test:e2e
# AUTHENTICATION END

#FRONTEND 
run-fe:
	cd www && npm run dev

# ALL
test: test-user test-transaction test-history test-auth 

# MIGRATE
migrate-run: docker
	cd services/auth && npm run migrate-run

migrate-revert: docker
	cd services/auth && npm run migrate-revert

down: 
	docker compose -f ${COMPOSE_PATH}/compose.yml down