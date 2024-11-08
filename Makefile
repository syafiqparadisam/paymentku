

USER_SVC_PATH := services/user
HISTORY_SVC_PATH := services/history
TRANSACTION_SVC_PATH := services/transaction
AUTH_SVC_PATH := services/auth
COMPOSE_PATH := docker/compose/dev

docker-compose:
	docker compose -f ${COMPOSE_PATH}/compose.yml up -d

# USER START
run-user: docker-compose
	cd ${USER_SVC_PATH} && go build -o server.out server.go && ./server

test-user: docker-compose
	cd ${USER_SVC_PATH}/test && go test -v ./... --count=1

install-user: 
	cd ${USER_SVC_PATH} && go mod download
# USER END


# TRANSACTION START
run-transaction: docker-compose	
	cd ${TRANSACTION_SVC_PATH} && go build -o server.out server.go && ./server

test-transaction:
	cd ${TRANSACTION_SVC_PATH}/test && go test -v ./... --count=1
# TRANSACTION END

# HISTORY START
run-history: docker-compose
	cd ${HISTORY_SVC_PATH} && go build -o server.out server.go && ./server
	

test-history: docker-compose
	cd ${HISTORY_SVC_PATH}/test && go test -v ./... --count=1
# HISTORY END

# AUTHENTICATION START
run-auth: docker-compose
	cd ${AUTH_SVC_PATH} && npm run start:dev


test-auth: docker-compose
	cd ${AUTH_SVC_PATH}/test && npm run test:e2e
# AUTHENTICATION END

#FRONTEND 
run-fe:
	cd www && npm run dev

# ALL
test: test-user test-transaction test-history test-auth 

# MIGRATE
migrate-run: docker-compose
	cd services/auth && npm run migrate-run

migrate-revert: docker-compose
	cd services/auth && npm run migrate-revert

down: 
	docker compose -f ${COMPOSE_PATH}/compose.yml down