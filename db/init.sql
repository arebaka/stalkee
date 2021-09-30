CREATE TABLE public.chats (
    id bigint NOT NULL PRIMARY KEY,
    username character varying(32) DEFAULT NULL::character varying,
    title character varying(255) NOT NULL
);

CREATE TABLE public.users (
    id bigint NOT NULL PRIMARY KEY,
    username character varying(32) DEFAULT NULL::character varying,
    first_name character varying(256) NOT NULL,
    last_name character varying(256) DEFAULT NULL::character varying
);

CREATE TABLE public.anecdots (
    id serial NOT NULL PRIMARY KEY,
    text text NOT NULL
);

CREATE TABLE public.stories (
    id serial NOT NULL PRIMARY KEY,
    fileid character varying(128) NOT NULL
);
CREATE TABLE public.voices (
    id serial NOT NULL PRIMARY KEY,
    "character" character varying(255) NOT NULL,
    fileid character varying(128),
    file_uid character varying(32),
    quote text,
    n_uses bigint DEFAULT 0
);

CREATE TABLE public.words (
    id serial NOT NULL PRIMARY KEY,
    voice_id integer NOT NULL,
    word character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS stories_fileid_uindex  ON public.stories USING btree (fileid);
CREATE UNIQUE INDEX IF NOT EXISTS voices_fileid_uindex   ON public.voices  USING btree (fileid);
CREATE UNIQUE INDEX IF NOT EXISTS voices_file_uid_uindex ON public.voices  USING btree (file_uid);

CREATE INDEX IF NOT EXISTS users_first_name_index ON public.users      USING btree (first_name);
CREATE INDEX IF NOT EXISTS users_last_name_index  ON public.users      USING btree (last_name);
CREATE INDEX IF NOT EXISTS users_username_index   ON public.users      USING btree (username);
CREATE INDEX IF NOT EXISTS voices_character_index ON public.voices_old USING btree ("character");
CREATE INDEX IF NOT EXISTS voices_n_uses_index    ON public.voices_old USING btree (n_uses);
CREATE INDEX IF NOT EXISTS words_word_index       ON public.words      USING btree (word);

ALTER TABLE public.words ADD CONSTRAINT words_voice_id_fkey FOREIGN KEY (voice_id) REFERENCES public.voices(id) ON UPDATE CASCADE ON DELETE CASCADE;
