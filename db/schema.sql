\restrict dbmate

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.points (
    discord_id text NOT NULL,
    points integer NOT NULL
);


--
-- Name: points_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.points_audit_log (
    id bigint NOT NULL,
    discord_id text NOT NULL,
    operation text NOT NULL,
    old_points integer,
    new_points integer,
    changed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: points_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.points_audit_log_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.points_audit_log_id_seq OWNED BY public.points_audit_log.id;

ALTER TABLE ONLY public.points_audit_log ALTER COLUMN id SET DEFAULT nextval('public.points_audit_log_id_seq'::regclass);


--
-- Name: log_points_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_points_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO points_audit_log(discord_id, operation, old_points, new_points)
  VALUES (COALESCE(NEW.discord_id, OLD.discord_id), TG_OP, OLD.points, NEW.points);
  RETURN NULL;
END;
$$;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: points points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points
    ADD CONSTRAINT points_pkey PRIMARY KEY (discord_id);


--
-- Name: points_audit_log points_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points_audit_log
    ADD CONSTRAINT points_audit_log_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: points points_audit_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER points_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.points FOR EACH ROW EXECUTE FUNCTION public.log_points_change();


--
-- PostgreSQL database dump complete
--

\unrestrict dbmate


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20260627132736');
