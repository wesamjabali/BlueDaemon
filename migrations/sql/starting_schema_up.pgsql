CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.cdm_role_password(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    role_name text NOT NULL,
    guild_id text NOT NULL,
    password text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cdm_guild_config(
    created_at timestamptz NOT NULL default NOW(),
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    guild_id text UNIQUE NOT NULL,
    server_description text NOT NULL,
    prefix text NOT NULL,
    mod_role text NOT NULL,
    faculty_role text NOT NULL,
    log_channel text NOT NULL,
    current_quarter text NOT NULL,
    self_role_prefix text NOT NULL,
    primary_color text NOT NULL
)
