-- migrate:up
CREATE TABLE points (
  discord_id   text PRIMARY KEY,
  points       integer NOT NULL
);

CREATE TABLE points_audit_log (
  id          bigserial PRIMARY KEY,
  discord_id  text NOT NULL,
  operation   text NOT NULL,
  old_points  integer,
  new_points  integer,
  changed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE FUNCTION log_points_change() RETURNS trigger AS $$
BEGIN
  INSERT INTO points_audit_log(discord_id, operation, old_points, new_points)
  VALUES (COALESCE(NEW.discord_id, OLD.discord_id), TG_OP, OLD.points, NEW.points);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER points_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON points
FOR EACH ROW EXECUTE FUNCTION log_points_change();

-- migrate:down
DROP TRIGGER points_audit_trigger ON points;
DROP FUNCTION log_points_change();
DROP TABLE points_audit_log;
DROP TABLE points;
