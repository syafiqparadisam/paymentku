

TRANSACTION_SVC_PATH := services/transactional
AUTH_SVC_PATH := services/auth
COMPOSE_PATH := docker/compose


install:
	cd services/auth && npm install
	cd services/transactional && go mod download
	cd www && npm install
	echo "Successfully install, then please fill .env file inside each services folder, www folder, docker/compose folder like .env.example"

docker-compose:
	docker compose -f ${COMPOSE_PATH}/compose.yml up -d

compose-cicd:
	docker compose -f ${COMPOSE_PATH}/compose_cicd.yml up -d

# TRANSACTION START
run-transactional:
	cd ${TRANSACTION_SVC_PATH} && go build -o server.out server.go && ./server.out

test-transactional:
	cd ${TRANSACTION_SVC_PATH}/test && go test -v ./... --count=1
# TRANSACTION END

# AUTHENTICATION START
run-auth:
	cd ${AUTH_SVC_PATH} && npm run start:dev

test-auth:
	cd ${AUTH_SVC_PATH}/test && npm run test:e2e
# AUTHENTICATION END

#FRONTEND 
run-fe:
	cd www && npm run dev

# ALL
test: test-auth test-transactional

down: 
	docker compose -f ${COMPOSE_PATH}/compose.yml down