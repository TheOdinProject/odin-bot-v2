-- migrate:up
CREATE TABLE rotations(
  name   text PRIMARY KEY,
  queue  text[] NOT NULL DEFAULT ARRAY[]::text[]
);

-- migrate:down
DROP TABLE rotations;
