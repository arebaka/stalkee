const db     = require("../db");
const logger = require("../logger");

module.exports = async ctx =>
	db.getRandomStory()
		.then(fileid => fileid
			? ctx.replyWithVoice(fileid)
			: ctx.replyWithMarkdown("Больше ничего не знаю."))
		.catch(err => {
			logger.error(err);
			ctx.replyWithMarkdown("Походу не вышло, братан!");
		});
