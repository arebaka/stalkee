const path = require("path");
const fs   = require("fs");

const greeting = fs.readFileSync(path.resolve("greeting"), "utf8");

module.exports = async ctx => ctx.replyWithMarkdown(greeting);
