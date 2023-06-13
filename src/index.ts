import 'reflect-metadata'

import readline from 'readline'
import { DataSource } from 'typeorm'

import { config, logger } from './utils'
import { Bot } from './bot'
import { User, Audio, Word } from './models'



let username: string

async function start(): Promise<void> {
	try {
		await db.initialize()
		logger.info('connected to database.', 'process.start')

		await bot.start(config.bot.options)
		await bot.setMode('regular')
		const botInfo = await bot.getMe()
		username = botInfo.username as string

		logger.info(`@${username} started.`, 'process.start')
	}
	catch (err) {
		logger.fatal(''+err, 'process.start')
		process.exit(1)
	}

}

async function stop(): Promise<void> {
	logger.info(`stop @${username}...`, 'process.stop')
	await bot.stop()
}

async function reload(): Promise<void> {
	try {
		logger.info(`reload @${username}...`, 'process.reload')
		await bot.reload()
		logger.info(`@${username} reloaded.`, 'process.reload')
	}
	catch (err) {
		logger.error(''+err, 'process.reload')
	}
}

async function setMode(mode: string): Promise<void> {
	try {
		if (!mode) {
			logger.error('mode is empty!', 'process.mode')
			return
		}

		await bot.setMode(mode)
		logger.info(`set mode of bot @${username} to '${mode}'.`, 'process.mode')
	}
	catch (err) {
		logger.error(''+err, 'process.mode')
	}
}



const bot = new Bot(config.bot.token)

const db = new DataSource({
	type: 'postgres',
	url: config.db.uri,
	synchronize: true,
	logging: false,
	entities: [User, Audio, Word]
})


const rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('> ')

rl.on('line', input => {
	const [command, ...args] = input.split(/\s/g)
	switch (command) {
		case 'stop': stop(); break
		case 'reload': reload(); break
		case 'mode': setMode(args[0]); break;
	}
})

process
	.on('SIGINT', stop)
	.on('SIGTERM', stop)

start()
