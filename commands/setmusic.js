const path = require("path");
const fs   = require("fs");

const config = require("../config");

module.exports = async ctx => {
	const replyTo = ctx.message.reply_to_message;
	if (!replyTo || !replyTo.audio) return;

	fs.writeFileSync(path.resolve("music_fileid"), replyTo.audio.file_id);
	ctx.replyWithMarkdown("Да, душевно!");
};
