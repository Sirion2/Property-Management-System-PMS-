FROM postgres:16

ENV POSTGRES_DB=DB_NAME
ENV POSTGRES_USER=DB_USER
ENV POSTGRES_PASSWORD=admin_password

COPY 01-init.sql /docker-entrypoint-initdb.d/ 
COPY 02-create-admin.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
