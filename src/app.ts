import { DataSource, Logger } from 'typeorm'

import { Bot } from './bot'
import { config, logger } from './utils'
import { DBLogger } from './database/logger'
import { User, Audio, Word, ActorAlias, LocationAlias } from './models'

export class App {

	private bot: Bot
	private db: DataSource
	private dbLogger: Logger
	private username: string

	constructor() {
		this.bot = new Bot(config.bot.token)
		this.dbLogger = new DBLogger()
		this.db = new DataSource({
			type: 'postgres',
			url: config.db.uri,
			synchronize: true,
			logger: this.dbLogger,
			entities: [User, Audio, Word, ActorAlias, LocationAlias]
		})
	}

	async start(): Promise<void> {
		try {
			await this.db.initialize()
			logger.info('connected to database.', 'process.start')

			await this.bot.start(config.bot.options)
			const botInfo = await this.bot.getMe()
			this.username = botInfo.username as string

			logger.info(`@${this.username} started.`, 'process.start')
		}
		catch (err) {
			logger.fatal(err as string, 'process.start')
			process.exit(1)
		}

	}

	async stop(): Promise<void> {
		logger.info(`stop @${this.username}...`, 'process.stop')
		await this.bot.stop()
		await this.db.destroy()
		process.exit(0)
	}

	async reload(): Promise<void> {
		try {
			logger.info(`reload @${this.username}...`, 'process.reload')
			await this.bot.reload()
			logger.info(`@${this.username} reloaded.`, 'process.reload')
		}
		catch (err) {
			logger.error(err as string, 'process.reload')
		}
	}

	async setMode(mode: string): Promise<void> {
		try {
			if (!mode) {
				logger.error('mode is empty!', 'process.mode')
				return
			}

			await this.bot.setMode(mode)
			logger.info(`set mode of bot @${this.username} to '${mode}'.`, 'process.mode')
		}
		catch (err) {
			logger.error(err as string, 'process.mode')
		}
	}
}
