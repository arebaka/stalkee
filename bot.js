const path = require("path");
const fs   = require("fs");

const Telegraf = require("telegraf").Telegraf;
const uuidv4   = require("uuid").v4;

const db     = require("./db");
const config = require("./config");
const logger = require("./logger");




module.exports = class Bot
{
    constructor(token)
    {
        this.token    = token;
        this.username = null;
        this.greeting = fs.readFileSync(path.resolve("greeting"), "utf8");
        this.bot      = new Telegraf(this.token);

        this.bot.use(async (ctx, next) => {
            try {
                await db.updateUser(
                    ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name
                );

                ctx.chat && ctx.chat.type != "private"
                    ? await db.updateChat(ctx.chat.id, ctx.chat.username, ctx.chat.title) : null;

                await next();
            }
            catch (err) {
                logger.error(err);
                ctx.replyWithMarkdown("Что то пошло не так!");
            }
        });

        this.bot.start(ctx => {
            ctx.replyWithMarkdown(this.greeting);
        });

        this.bot.command("add", async ctx => {
            const replyTo   = ctx.message.reply_to_message;
            const lines     = ctx.message.text.split('\n');
            const character = lines[0].split(' ')
                .slice(1).join(' ');
            const quote     = lines
                .splice(1).join('\n');

            if (ctx.from.id != config.admin.id || !replyTo || !replyTo.voice || !character || !quote)
                return;

            try {
                await db.addQuote(
                    character, replyTo.audio.file_id, replyTo.audio.file_unique_id, quote
                );
            }
            catch (err) {
                logger.error(err);
                return ctx.replyWithMarkdown("Походу не вышло, братан!");
            }

            ctx.replyWithMarkdown("Хахахахах, ну ты чертыла, мля, внатуре, чертыла!");
        });

        this.bot.command("remove", async ctx => {
            if (ctx.from.id == config.admin.id
                && ctx.message.reply_to_message
                && ctx.message.reply_to_message.voice
            ) {
                await db.remQuote(ctx.message.reply_to_message.voice.file_unique_id);

                ctx.replyWithMarkdown("Ну, проветришься - заходи!");
            }
        });

        this.bot.command("addanecdot", async ctx => {
            const anecdot = ctx.message.text
                .split('\n').slice(1).join('\n');

            if (!anecdot || !anecdot.length || ctx.from.id != config.admin.id)
                return;

            try {
                await db.addAnecdot(anecdot);
            }
            catch (err) {
                logger.error(err);
                return ctx.replyWithMarkdown("Походу не вышло, братан!");
            }

            ctx.replyWithMarkdown("Хахахахах, ну ты выдал!");
        });

        this.bot.command("anecdot", async ctx => {
            const anecdot = await db.getRandomAnecdot();

            anecdot
                ? ctx.replyWithMarkdown(anecdot)
                : ctx.replyWithMarkdown("Больше ничего не знаю.");
        });

        this.bot.command("music", async ctx => {
            const fileid = fs.readFileSync(path.resolve("music_fileid"), "utf8");

            fileid
                ? ctx.replyWithAudio(fileid)
                : ctx.replyWithMarkdown("Чё то настроения нет играть совсем.");
        });

        this.bot.command("setmusic", async ctx => {
            const replyTo = ctx.message.reply_to_message;

            if (ctx.from.id != config.admin.id || !replyTo || !replyTo.audio)
                return;

            fs.writeFileSync(path.resolve("music_fileid"), replyTo.audio.file_id);
            ctx.replyWithMarkdown("Да, душевно!");
        });

        this.bot.command("story", async ctx => {
            const fileid = await db.getRandomStory();

            fileid
                ? ctx.replyWithVoice(fileid)
                : ctx.replyWithMarkdown("Больше ничего не знаю.");
        });

        this.bot.command("addstory", async ctx => {
            const replyTo = ctx.message.reply_to_message;

            if (ctx.from.id != config.admin.id || !replyTo || !replyTo.voice)
                return;

            try {
                await db.addStory(replyTo.voice.file_id);
            }
            catch (err) {
                logger.error(err);
                return ctx.replyWithMarkdown("Походу не вышло, братан!");
            }

            ctx.replyWithMarkdown("Хахахахах, ну ты чертыла, мля, внатуре, чертыла!");
        });

        this.bot.on("inline_query", async ctx => {
            let query = ctx.inlineQuery.query
                .trim().split(/\s+/).join(' ');
            let voices;

            if (!query) {
                voices = await db.getAllVoices(config.responseLimit);
            }
            else if (query.length > 1
                && query.startsWith('"')
                && query.endsWith('"')
            ) {
                voices = await db.getVoicesBySub(
                    query.substring(1, query.length - 1),
                    config.responseLimit
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
                logger.info(`Bot @${this.username} started.`);
            })
            .catch(err => {
                logger.error(err);
            });
    }

    async stop()
    {
        logger.info(`Stop the bot @${this.username}`);

        await this.bot.stop();
        await db.stop();

        process.exit(0);
    }

    async reload()
    {
        logger.info(`Reload the bot @${this.username}`);

        await this.bot.stop();
		await db.stop();
        await this.start();
    }
}
