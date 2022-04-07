const Composer = require("telegraf").Composer;

module.exports = {
	admin: Composer.filter(require("./admin")),
	voice: Composer.filter(require("./voice"))
};
