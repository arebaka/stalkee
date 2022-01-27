const uuidv4 = require("uuid").v4;

const config = require("../config");
const db     = require("../db");

module.exports = async ctx => {
	let query = ctx.inlineQuery.query.trim().split(/\s+/).join(' ');
	let voices;

	if (!query) {
		voices = await db.getAllVoices(config.limits.max_result_size);
	}
	else if (query.length > 1 && query.startsWith('"') && query.endsWith('"')) {
		voices = await db.getVoicesBySub(
			query.substring(1, query.length - 1),
			config.limits.max_result_size);
	}
	else {
		voices = await db.getVoicesByWords(
			query.split(' '), config.limits.max_result_size);
	}

	ctx.answerInlineQuery(voices.map(voice => ({
			type:          "voice",
			id:            `${voice.file_uid}.${uuidv4()}`,
			voice_file_id: voice.fileid,
			title:         voice.quote
		})));
};
