const path = require("path");
const fs   = require("fs");

const { Telegraf }   = require("telegraf");
const { v4: uuidv4 } = require("uuid");

const db = require("./db");




class Bot
{
    constructor(token, username)
    {
        this.token    = token;
        this.username = username;

        this.bot = new Telegraf(this.token);

        this.greeting = fs.readFileSync(path.resolve("greeting"), "utf8");

        this.bot.use(async (ctx, next) => {
            await next();
        });

        this.bot.start(ctx => {
            ctx.replyWithMarkdown(this.greeting);
        });

        this.bot.on("message", ctx => {
            if (ctx.from.username == "arelive")
                console.log(ctx.message);
        });

        this.bot.on("inline_query", ctx => {
            let query = ctx.inlineQuery.query
                .trim().toLowerCase().split(/\s+/).join(' ');
            let res    = [];
            let titles = [];

            if (query.startsWith("\"") && query.endsWith("\"")) {
                query  = query.substring(1, query.length - 1);
                titles = Object.keys(db).filter(title => title.includes(query));

                for (let title of titles) {
                    res.push({
                        type:          "voice",
                        id:            uuidv4(),
                        voice_file_id: db[title],
                        title:         title
                    });
                }
            }
            else {
                query  = query.split(' ');
                titles = Object.keys(db).filter(title => query.every(word => title.includes(word)));

                for (let title of titles) {
                    res.push({
                        type:          "voice",
                        id:            uuidv4(),
                        voice_file_id: db[title],
                        title:         title
                    });
                }
            }

            res = res.slice(0, 20);

            ctx.answerInlineQuery(res);
        });
    }

    async start()
    {
        this.bot
            .launch()
            .then(res => {
                console.log(`Bot @${this.username} started.`);
            })
            .catch(err => {
                console.error(err);
            });
    }

    async stop()
    {
        console.log(`Stop the bot @${this.username}`);

        this.bot.stop();
    }

    async reload()
    {
        console.log(`Reload the bot @${this.username}`);

        await this.stop();
        await this.start();
    }
}

module.exports = Bot;
