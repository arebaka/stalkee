const config = require("../config");

module.exports = ctx => config.bot.admins.includes(ctx.from.id);
