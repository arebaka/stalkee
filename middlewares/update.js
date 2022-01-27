const db     = require("../db");
const logger = require("../logger");

module.exports = async (ctx, next) =>
	db.updateUser(ctx.from.id, ctx.from.username,
			ctx.from.first_name, ctx.from.last_name)
		.then(() => ctx.chat && ctx.chat.type != "private"
			&& db.updateChat(ctx.chat.id,
				ctx.chat.username, ctx.chat.title))
		.then(() => next(ctx))
		.catch(err => logger.error(err));
