const path = require("path");
const fs   = require("fs");

module.exports = async ctx => {
	const fileid = fs.readFileSync(path.resolve("music_fileid"), "utf8");

	fileid ? ctx.replyWithAudio(fileid)
		: ctx.replyWithMarkdown("Чё то настроения нет играть совсем.");
};
