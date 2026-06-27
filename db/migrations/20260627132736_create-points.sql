-- migrate:up
CREATE TABLE points (
  discord_id   text PRIMARY KEY,
  points       integer NOT NULL
);

-- migrate:down
DROP TABLE points;
