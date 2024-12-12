#!/usr/bin/env zsh
# Use this script to start a docker container for a local development database

DB_CONTAINER_NAME="audiobites-postgres"
DB_PORT=5432

# Generate a secure random password
DB_PASSWORD=$(openssl rand -base64 16)

# Remove existing container if it exists
docker rm -f $DB_CONTAINER_NAME 2>/dev/null || true

# Create and run new container with explicit environment variables
docker run -d \
  --name "$DB_CONTAINER_NAME" \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB=audiobites \
  -p "$DB_PORT":5432 \
  -v postgres_data:/var/lib/postgresql/data \
  docker.io/postgres:latest

# Wait a moment for the container to start
sleep 5

# Update .env file with the new connection string
echo "DATABASE_URL=postgresql://postgres:$DB_PASSWORD@localhost:$DB_PORT/audiobites" > .env

echo "Database container '$DB_CONTAINER_NAME' was successfully created"