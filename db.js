const pg = require("pg");

const config = require("./config");

class DBHelper
{
    constructor()
    {
        this.pool = null;
    }

    async start()
    {
        this.pool = new pg.Pool({
            host:     config.db.host,
            user:     config.db.user,
            password: config.db.password,
            database: config.db.database,
            port:     config.db.port,
            max:      1
        });

        this.pool.on("error", async (err, client) => {
            console.error("PostgreSQL pool is down!", err);
            await this.pool.end();
            process.exit(-1);
        });

        await this.pool.query(`
            create table if not exists users (
                id bigint not null primary key,
                username varchar(32) default null,
                first_name varchar(256) not null,
                last_name varchar(256) default null
            )`);

        await this.pool.query(`
            create table if not exists anecdots (
                id serial not null primary key,
                text text not null
            )`);

        await this.pool.query(`
            create table if not exists voices (
                id serial not null primary key,
                "character" varchar(255) not null,
                fileid varchar(128) not null unique,
                file_uid varchar(32) not null unique,
                quote text not null,
                n_uses bigint not null default 0
            )`);

        await this.pool.query(`
            create table if not exists words (
                id serial not null primary key,
                voice_id int not null references voices (id),
                word varchar(255) not null
            )`);
    }

    async stop()
    {
        await this.pool.end();
    }

    async restart()
    {
        await this.stop();
        await this.start();
    }

    async updateUser(id, username, firstName, lastName)
    {
        await this.pool.query(`
                insert into users (id, username, first_name, last_name)
                values ($1, $2, $3, $4)
                on conflict (id) do update set username = $2, first_name = $3, last_name = $4
            `, [
                id, username, firstName, lastName
            ]);
    }

    async addAnecdot(anecdot)
    {
        await this.pool.query(`
                insert into anecdots (text)
                values ($1)
            `, [
                anecdot
            ]);
    }

    async addQuote(character, fileid, fileUid, quote)
    {
        quote = quote.trim();

        let id = await this.pool.query(`
                insert into voices ("character", fileid, file_uid, quote)
                values ($1, $2, $3, $4)
                returning id
            `, [
                character, fileid, fileUid, quote
            ]);

        id = id.rows[0].id;

        let words = quote
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(/\s+/g);

        for (let word of words) {
            await this.pool.query(`
                    insert into words (voice_id, word)
                    values ($1, $2)
                `, [
                    id, word.toLowerCase()
                ]);
        }

        return id;
    }

    async remQuote(fileUid)
    {
        await this.pool.query(`
                delete from voices
                where file_uid = $1
            `, [
                fileUid
            ]);
    }

    async useQuote(fileUid)
    {
        await this.pool.query(`
                update voices
                set n_uses = n_uses + 1
                where file_uid = $1
            `, [
                fileUid
            ]);
    }

    async getRandomAnecdot()
    {
        let anecdot = await this.pool.query(`
                select text from anecdots
                order by random()
                limit 1
            `);

        return anecdot.rows[0].text;
    }

    async getAllVoices(limit)
    {
        let voices = await this.pool.query(`
                select fileid, file_uid, "character", quote, n_uses
                from voices
                order by n_uses desc
                limit $1
            `, [
                limit
            ]);

        return voices.rows;
    }

    async getVoicesByWords(words, limit)
    {
        let params = [];

        for (let i = 1; i <= words.length; i++) {
            params.push('$' + i);
        }

        let voices = await this.pool.query(`
                select distinct fileid, file_uid, "character", quote, n_uses
                from voices v
                join words w on w.voice_id = v.id
                where w.word in (${params.join(',')})
                order by n_uses desc
                limit ${limit}
            `, words);

        return voices.rows;
    }

    async getVoicesBySub(sub, limit)
    {
        let voices = await this.pool.query(`
                select distinct fileid, file_uid, "character", quote, n_uses
                from voices
                where quote like '%' || $1 || '%'
                order by n_uses desc
                limit $2
            `, [
                sub, limit
            ]);

        return voices.rows;
    }
}

module.exports = new DBHelper();
