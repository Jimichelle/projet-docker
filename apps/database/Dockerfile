FROM postgres:16-alpine

COPY init.sql /docker-entrypoint-initdb.d/

# Variables d'environnement par défaut (peuvent être surchargées dans docker-compose)
ENV POSTGRES_DB=taskdb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

EXPOSE 5432


