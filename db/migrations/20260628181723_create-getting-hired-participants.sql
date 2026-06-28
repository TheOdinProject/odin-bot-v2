-- migrate:up
CREATE TABLE getting_hired_participants (
  discord_id   text PRIMARY KEY
);

-- migrate:down
DROP TABLE getting_hired_participants;
