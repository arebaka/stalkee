const path = require("path");
const fs   = require("fs");

const { Telegraf }   = require("telegraf");
const { v4: uuidv4 } = require("uuid");

const db     = require("./db");
const config = require("./config");




class Bot
{
    constructor(token, username)
    {
        this.token    = token;
        this.username = null;
        this.greeting = fs.readFileSync(path.resolve("greeting"), "utf8");

        this.bot = new Telegraf(this.token);

        this.bot.use(async (ctx, next) => {
            await next();
        });

        this.bot.start(ctx => {
            ctx.replyWithMarkdown(this.greeting);
        });

        this.bot.command("add", async ctx => {
            const replyTo = ctx.message.reply_to_message;

            if (ctx.from.id == config.admin.id
                && replyTo && replyTo.voice
            ) {
                const lines     = ctx.message.text.split('\n');
                const character = lines[0].split(' ')
                    .slice(1).join(' ');
                const quote     = lines
                    .splice(1).join('\n');

                if (!character || !quote)
                    return;

                try {
                    await db.addQuote(
                        character, replyTo.voice.file_id, replyTo.voice.file_unique_id, quote
                    );
                }
                catch (err) {
                    console.error(err);
                    return ctx.replyWithMarkdown("Походу не вышло, братан!");
                }

                ctx.replyWithMarkdown("Хахахахах, ну ты чертыла, мля, внатуре, чертыла!");
            }
        });

        this.bot.command("remove", async ctx => {
            if (ctx.from.id == config.admin.id
                && ctx.message.reply_to_message
                && ctx.message.reply_to_message.voice
            ) {
                await db.remQuote(ctx.message.reply_to_message.voice.file_unique_id);
            }
        });

        this.bot.on("inline_query", async ctx => {
            let query = ctx.inlineQuery.query
                .trim().split(/\s+/).join(' ');
            let voices;

            if (!query) {
                voices = await db.getAllVoices(config.responseLimit);
            }
            else if (query.length > 1 && query.startsWith('"') && query.endsWith('"')) {
                voices = await db.getVoicesBySub(
                    query.substring(1, query.length - 1), config.responseLimit
                );
            }
            else {
                voices = await db.getVoicesByWords(
                    query.split(' '), config.responseLimit
                );
            }

            ctx.answerInlineQuery(voices.map(voice => ({
                type:          "voice",
                id:            `${voice.file_uid}.${uuidv4()}`,
                voice_file_id: voice.fileid,
                title:         voice.quote
            })));
        });

        this.bot.on("chosen_inline_result", async ctx => {
            const fileUid = ctx.update.chosen_inline_result.result_id.split('.')[0];

            await db.useQuote(fileUid);
        });
    }

    async start()
    {
        await db.start();

        this.bot
            .launch(config.params)
            .then(res => {
                this.username = this.bot.botInfo.username;
                console.log(`Bot @${this.username} started.`);
            })
            .catch(err => {
                console.error(err);
                this.bot.stop();
            });
    }

    async stop()
    {
        console.log(`Stop the bot @${this.username}`);

        this.bot.stop();
        await db.stop();
    }

    async reload()
    {
        console.log(`Reload the bot @${this.username}`);

        await this.stop();
        await this.start();
    }
}




module.exports = Bot;
