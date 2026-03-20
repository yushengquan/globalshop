#!/bin/bash
# =============================================================
# GlobalShop MySQL Initialization Script
# Usage: ./init-db.sh
# Requires: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
# =============================================================

set -euo pipefail

MYSQL_HOST=${MYSQL_HOST:-127.0.0.1}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_USER=${MYSQL_USER:-shopuser}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-shoppass123}
MYSQL_DATABASE=${MYSQL_DATABASE:-globalshop}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-rootpass123}

echo "[init-db] Waiting for MySQL to be ready..."
for i in $(seq 1 30); do
  if mysqladmin ping -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" --silent 2>/dev/null; then
    echo "[init-db] MySQL is ready."
    break
  fi
  echo "[init-db] Attempt $i/30 - waiting..."
  sleep 2
done

echo "[init-db] Running schema.sql..."
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < schema.sql

echo "[init-db] Done. Database initialized successfully."
