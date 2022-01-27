const db     = require("../db");
const logger = require("../logger");

module.exports = async ctx =>
	db.remQuote(ctx.message.reply_to_message.voice.file_unique_id)
		.then(() => ctx.replyWithMarkdown("Ну, проветришься - заходи!"))
		.catch(err => {
			logger.error(err);
			ctx.replyWithMarkdown("Походу не вышло, братан!");
		});
