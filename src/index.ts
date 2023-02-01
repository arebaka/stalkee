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
		logger.info(`Connected to database.`, 'process.start')

		await bot.start(config.bot.options)
		await bot.setMode('regular')
		username = (await bot.getMe()).username as string
		logger.info(`@${username} started.`, 'process.start')
	}
	catch (err) {
		logger.fatal(''+err, 'process.start')
		process.exit(1)
	}

}

async function stop(): Promise<void> {
	logger.info(`Stop @${username}...`, 'process.stop')
	await bot.stop()
}

async function reload(): Promise<void> {
	logger.info(`Reload @${username}...`, 'process.reload')
	await bot.reload()
	logger.info(`@${username} reloaded.`, 'process.reload')
}

async function setMode(mode: string): Promise<void> {
	await bot.setMode(mode)
		.then(() => logger.info(`Set mode of bot @${username} to '${mode}'.`))
		.catch(err => logger.error(err, 'bot.mode'))
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
	switch (input) {
		case 'stop': stop(); break
		case 'reload': reload(); break
		// TODO mode
	}
})

process
	.on('SIGINT', stop)
	.on('SIGTERM', stop)

start()
