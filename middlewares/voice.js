const config = require("../config");

module.exports = async (ctx, next) =>
	config.bot.admins.find(id => id == ctx.from.id)
		&& ctx.message.reply_to_message
		&& ctx.message.reply_to_message.voice
		&& next(ctx);
