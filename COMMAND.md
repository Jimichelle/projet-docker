# BDD 

docker build -t jimichelle/bdd-application:latest ./apps/database
docker run -d --name database-application -p 5432:5432 -e POSTGRES_DB=taskdb -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres jimichelle/bdd-application:latest
docker push jimichelle/bdd-application:latest
https://hub.docker.com/r/jimichelle/bdd-application

# BACK 

docker build -t jimichelle/back-application:latest ./apps/back-app
docker run -d --name back-application -p 3008:3008 -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_NAME=taskdb -e DB_USER=postgres -e DB_PASSWORD=postgres -e FRONTEND_URL=http://localhost:3000 jimichelle/back-application:latest
docker push jimichelle/back-application:latest
https://hub.docker.com/r/jimichelle/back-application

# FRONT 

docker build -t jimichelle/front-application:latest ./apps/front-app
docker run -d --name front-application -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:3008 jimichelle/front-application:latest
docker push jimichelle/front-application:latest
https://hub.docker.com/r/jimichelle/front-application

# DOCKERHUB
https://hub.docker.com/u/jimichelle