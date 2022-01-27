const db     = require("../db");
const logger = require("../logger");

module.exports = async ctx => {
	const replyTo   = ctx.message.reply_to_message;
	const lines     = ctx.message.text.split('\n');
	const character = lines[0].split(' ').slice(1).join(' ');
	const quote     = lines.splice(1).join('\n');

	if (!character || !quote) return;

	db.addQuote(character, replyTo.voice.file_id,
			replyTo.voice.file_unique_id, quote)
		.then(() => ctx.replyWithMarkdown(
			"Хахахахах, ну ты чертыла, мля, внатуре, чертыла!"))
		.catch(err => {
			logger.error(err);
			ctx.replyWithMarkdown("Походу не вышло, братан!");
		});
};
