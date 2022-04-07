module.exports = ctx =>
	ctx.message.reply_to_message
	&& ctx.message.reply_to_message.voice;
