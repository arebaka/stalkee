const path = require("path");
const fs   = require("fs");
const pg   = require("pg");

const config = require("../config");
const logger = require("../logger");

class DBHelper
{
    constructor()
    {
        this.pool = null;
    }

    async start()
    {
        const sql = fs.readFileSync(path.resolve("db/init.sql"), "utf8").split(';');
        this.pool = new pg.Pool({
            connectionString: config.dbUri,
            max:              1
        });

        this.pool.on("error", async (err, client) => {
            logger.fatal(err, "PostgreSQL");
            await this.pool.end();
            process.exit(-1);
        });

        for (let query of sql) {
            await this.pool.query(query)
                .catch(err => {});
        }
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
                on conflict (id) do update
                set username = $2, first_name = $3, last_name = $4
            `, [
                id, username, firstName, lastName
            ]);
    }

    async updateChat(id, username, title)
    {
        await this.pool.query(`
                insert into chats (id, username, title)
                values ($1, $2, $3)
                on conflict (id) do update
                set username = $2, title = $3
            `, [
                id, username, title
            ]);
    }

    async addAnecdot(anecdot)
    {
        const id = await this.pool.query(`
                insert into anecdots (text)
                values ($1)
                returning id
            `, [anecdot]);

        return id.rows[0].id;
    }

    async addStory(fileid)
    {
        const id = await this.pool.query(`
                insert into stories (fileid)
                values ($1)
                returning id
            `, [fileid]);

        return id.rows[0].id;
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
        const id = await this.pool.query(`
                delete from voices
                where file_uid = $1
                returning id
            `, [fileUid]);

        return id.rows[0].id;
    }

    async useQuote(fileUid)
    {
        const id = await this.pool.query(`
                update voices
                set n_uses = n_uses + 1
                where file_uid = $1
                returning id
            `, [fileUid]);

        return id.rows[0].id;
    }

    async getRandomAnecdot()
    {
        let anecdot = await this.pool.query(`
                select text from anecdots
                order by random()
                limit 1
            `);

        return anecdot.rows.length
            ? anecdot.rows[0].text : null;
    }

    async getRandomStory()
    {
        let story = await this.pool.query(`
                select fileid from stories
                order by random()
                limit 1
            `);

        return story.rows.length
            ? story.rows[0].fileid : null;
    }

    async getAllVoices(limit)
    {
        let voices = await this.pool.query(`
                select fileid, file_uid, "character", quote, n_uses
                from voices
                order by n_uses desc
                limit $1
            `, [limit]);

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
                join words w
                on w.voice_id = v.id
                where w.word in (${params.join(',')})
                group by v.id
                having count (distinct w.word) = ${params.length}
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
