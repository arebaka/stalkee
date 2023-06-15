import path from 'path'
import fs from 'fs'
import toml from 'toml'
import dotenv from 'dotenv'

import { LaunchOptions } from '../types'

interface IBot {
	token: string
	admins: number[]
	options: LaunchOptions
	locales: string[]
}

interface IDB {
	uri: string
}

interface ILimits {
	max_result_size: number
}

class Config {
	bot: IBot
	db: IDB
	limits: ILimits
}

dotenv.config({ override: false })

const source = fs.readFileSync(path.resolve(__dirname, '../../config.toml'), 'utf-8')
const config: Config = toml.parse(source)

config.bot.token = process.env.BOT_TOKEN || config.bot.token
config.db.uri = process.env.DB_URI || config.db.uri

config.bot.admins = process.env.BOT_ADMINS
	? process.env.BOT_ADMINS.split(/\s/g).map(id => +id)
	: config.bot.admins

config.bot.locales = process.env.BOT_LOCALES
	? process.env.BOT_LOCALES.split(/\s/g)
	: config.bot.locales

export { config }
