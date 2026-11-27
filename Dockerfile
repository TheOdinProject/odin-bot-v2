FROM docker.io/library/node:24-slim

# dbmate shells out to pg_dump to keep db/schema.sql up to date after migrations.
# The client must match the Postgres server version (18), so pull it from PGDG.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates postgresql-common \
  && /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y \
  && apt-get install -y --no-install-recommends postgresql-client-18 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# husky's `prepare` hook needs a .git dir; skip it inside the image
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
