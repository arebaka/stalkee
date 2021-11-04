const path = require("path");
const fs   = require("fs");
const toml = require("toml");

const config = toml.parse(fs.readFileSync(path.resolve("config.toml")));




module.exports = {
    token:  process.env.TOKEN || config.bot.token,
    params: config.params,
    admin: {
        id: process.env.ADMIN_ID || config.bot.admin_id
    },
    dbUri: process.env.DBURI || config.db.uri,
    responseLimit: process.env.RESPONSE_LIMIT || config.bot.response_limit
};
