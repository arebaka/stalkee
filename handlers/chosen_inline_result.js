const db = require("../db");

module.exports = async ctx => {
	const fileUid = ctx.update.chosen_inline_result.result_id.split('.')[0];
	db.useQuote(fileUid);
};
