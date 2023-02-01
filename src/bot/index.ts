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

	command: string
	description: string

	constructor(command: string, description: string) {
		this.command = command
		this.description = description
	}
}



export class Bot {

	public static readonly commands: {[mode: string]: {[cmd: string]: string}} = {
		regular: {
			start: 'завести шарманку',
		},
		admin: {
			add: 'админа заманало каждый раз вводить',
			remove: 'админа заманало каждый раз вводить',
		},
	}

	private bot: Telegraf<Context>
	private options: LaunchOptions = {}
	private botInfo: typegram.User

	constructor(token: string) {
		this.bot = new Telegraf<Context>(token)
		this.bot.catch((err: Error) => logger.error(err.message, 'bot'))

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
		return await this.bot.telegram.getMe()
			.then(info => this.botInfo = info)
	}

	async start(options: LaunchOptions): Promise<void> {
		await this.bot.launch(options)
		this.options = options
		this.botInfo = await this.bot.telegram.getMe()
	}

	async stop(): Promise<void> {
		await this.bot.stop()
	}

	async reload(): Promise<void> {
		await this.bot.stop()
		await this.start(this.options)
	}

	async setMode(mode: string): Promise<void> {
		if (!Bot.commands[mode])
			throw new Error(`No mode named ${mode}`)

		const preparedCommands: {[key: string]: string} = {
			regular: Bot.commands.regular,
			edit: {...Bot.commands.regular, ...Bot.commands.admin},
		}[mode] as {[key: string]: string}

		await this.bot.telegram.setMyCommands(
			Object.entries(preparedCommands)
				.map(([cmd, descr]) => new Command(cmd, descr))
		)
	}
}
