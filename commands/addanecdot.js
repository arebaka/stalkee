const db     = require("../db");
const logger = require("../logger");

module.exports = async ctx => {
	const anecdot = ctx.message.text.split('\n').slice(1).join('\n');
	if (!anecdot || !anecdot.length) return;

	db.addAnecdot(anecdot)
		.then(() => ctx.replyWithMarkdown("Хахахахах, ну ты выдал!"))
		.catch(err => {
			logger.error(err);
			ctx.replyWithMarkdown("Походу не вышло, братан!");
		});
};
