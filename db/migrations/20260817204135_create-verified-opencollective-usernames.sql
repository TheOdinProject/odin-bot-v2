-- migrate:up
CREATE TABLE verified_opencollective_usernames(
  username   text PRIMARY KEY
);

-- migrate:down
DROP TABLE verified_opencollective_usernamess;
