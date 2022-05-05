import 'reflect-metadata'

import { DataSource } from 'typeorm'

import { config, logger, readline } from './util'
import { Bot } from './bot'
import { User, Audio, Word } from './models'




async function start(): Promise<void> {
	try {
		await db.initialize()
		logger.info(`Connected to database.`, 'process.start')

		await bot.start(config.bot.options)
		await bot.setMode('regular')
		const username = (await bot.getMe()).username
		logger.info(`@${username} started.`, 'process.start')
	}
	catch(err) {
		logger.fatal(''+err, 'process.start')
		readline.close()
	}

}

async function stop(): Promise<void> {
	const username = (await bot.getMe()).username

	logger.info(`Stop @${username}...`, 'process.stop')
	await bot.stop()
	readline.close()
}

async function reload(): Promise<void> {
	const username = (await bot.getMe()).username

	logger.info(`Reload @${username}...`, 'process.reload')
	await bot.reload()
	logger.info(`@${username} reloaded.`, 'process.reload')
}

async function setMode(args:string[]): Promise<void> {
	bot.setMode(args[0])
}




const bot = new Bot(config.bot.token)

const db = new DataSource({
	type: 'postgres',
	url: config.db.uri,
	synchronize: true,
	logging: false,
	entities: [User, Audio, Word]
})




readline.init()

readline
	.setCommand('stop', stop)
	.setCommand('reload', reload)
	.setCommand('mode', setMode)

process
	.on('SIGINT', stop)
	.on('SIGTERM', stop)

process.on('uncaughtException', err => {
	logger.error(err.stack, 'process')
	reload()
})

start()
