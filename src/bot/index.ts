import { Telegraf } from 'telegraf'
import typegram from 'typegram'

import { logger } from '../utils'
import { LaunchOptions, Context } from '../types'

import * as middlewares from './middlewares'
import * as filters from './filters'
import * as commands from './commands'
import * as handlers from './handlers'
import * as actions from './actions'



class Command implements typegram.BotCommand {

	command:string
	description:string

	constructor(command:string, description:string) {
		this.command     = command
		this.description = description
	}
}



export class Bot {

	public static readonly commands:{[key:string]: typegram.BotCommand[]} = {
		regular: [
			new Command('start', 'завести шарманку')
		],
		admin: [
			new Command('add', 'админа заманало каждый раз вводить'),
			new Command('remove', 'админа заманало каждый раз вводить')
		]
	}

	private bot:Telegraf<Context>
	private options:LaunchOptions = {}

	constructor(token:string) {
		this.bot = new Telegraf<Context>(token)
		this.bot.catch((err:Error) => logger.error(err.message, 'bot'))

		this.bot.use(middlewares.update, middlewares.setLocale)

		this.bot.command('start', commands.start)

		this.bot
			.command('add', filters.admin, filters.replyToVoice, commands.add)
			.command('remove', filters.admin, filters.replyToVoice, commands.remove)

		this.bot
			.action(/^lang:(.*)$/, actions.lang)
			.action(/^remove:(.*)$/, actions.remove)

		this.bot
			.on('inline_query', handlers.inlineQuery)
			.on('chosen_inline_result', handlers.chosenInlineResult)
	}

	async getMe(): Promise<typegram.User> {
		return this.bot.telegram.getMe()
	}

	async start(options:LaunchOptions): Promise<void> {
		this.options = options

		try {
			await this.bot.launch(options)
		}
		catch (err) {
			logger.fatal(''+err, 'bot.start')
			process.exit(1)
		}
	}

	async stop(): Promise<void> {
		this.bot.stop()
	}

	async reload(): Promise<void> {
		await this.bot.stop()
		await this.start(this.options)
	}

	async setMode(mode:string): Promise<void> {
		switch (mode) {
			case 'regular':
				this.bot.telegram.setMyCommands(Bot.commands.regular)
			break
			case 'edit':
				this.bot.telegram.setMyCommands(
					Bot.commands.regular.concat(Bot.commands.admin))
			break
		}
	}
}
