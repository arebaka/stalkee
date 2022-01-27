const db     = require("../db");
const logger = require("../logger");

module.exports = async ctx =>
	db.addStory(ctx.message.reply_to_message.voice.file_id)
		.then(() => ctx.replyWithMarkdown(
			"Хахахахах, ну ты чертыла, мля, внатуре, чертыла!"))
		.catch(err => {
			logger.error(err);
			ctx.replyWithMarkdown("Походу не вышло, братан!");
		});
