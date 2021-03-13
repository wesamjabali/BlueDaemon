CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.cdm_role_password(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    role_name text NOT NULL,
    guild_id text NOT NULL,
    password text NOT NULL
);