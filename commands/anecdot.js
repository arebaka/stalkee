const db     = require("../db");
const logger = require("../logger");

module.exports = async ctx =>
	db.getRandomAnecdot()
		.then(anecdot => ctx.replyWithMarkdown(
			anecdot || "Больше ничего не знаю."))
		.catch(err => {
			logger.error(err);
			ctx.replyWithMarkdown("Походу не вышло, братан!");
		});
