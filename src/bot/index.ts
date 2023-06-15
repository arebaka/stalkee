import { Telegraf } from 'telegraf'
import typegram from 'typegram'

import { logger } from '../utils'
import { LaunchOptions, Context } from '../types'

import * as middlewares from './middlewares'
import * as filters from './filters'
import * as commands from './commands'
import * as handlers from './handlers'
import * as actions from './actions'



type CommandMap = {[mode: string]: {[cmd: string]: string}}

export class Bot {

	public static readonly commands: CommandMap = {
		regular: {
			start: 'завести шарманку',
			info: 'сейчас я попробую настроить прототип',
		},
		admin: {
			add: 'админа заманало каждый раз вводить',
			remove: 'админа заманало каждый раз вводить',
			quote: 'админа заманало каждый раз вводить',
			actor: 'админа заманало каждый раз вводить',
			location: 'админа заманало каждый раз вводить',
		},
	}

	public static readonly modeCommands: CommandMap = {
		regular: Bot.commands.regular,
		edit: {...Bot.commands.regular, ...Bot.commands.admin},
	}

	private bot: Telegraf<Context>
	private options: LaunchOptions = {}
	private botInfo: typegram.User

	constructor(token: string) {
		this.bot = new Telegraf<Context>(token)
		this.bot.catch((err: Error) => logger.error(err.message, 'bot'))

		this.bot.use(middlewares.update, middlewares.setLocale)

		this.bot.command('start', commands.start)
		this.bot.command('info', filters.replyToVoice, commands.info)

		this.bot
			.command('add', filters.admin, filters.replyToVoiceOrAudio, commands.add)
			.command('remove', filters.admin, filters.replyToVoice, commands.remove)
			.command('quote', filters.admin, filters.replyToVoice, commands.quote)
			.command('actor', filters.admin, filters.replyToVoice, commands.actor)
			.command('location', filters.admin, filters.replyToVoice, commands.location)

		this.bot
			.action(/^lang:(.*)$/, actions.lang)
			.action(/^remove:(.*)$/, actions.remove)

		this.bot
			.on('inline_query', handlers.inlineQuery)
			.on('chosen_inline_result', handlers.chosenInlineResult)
	}

	async getMe(): Promise<typegram.User> {
		this.botInfo = await this.bot.telegram.getMe()
		return this.botInfo
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
		if (!Bot.modeCommands[mode]) {
			throw new Error(`No mode named ${mode}`)
		}

		const preparedCommands = Bot.modeCommands[mode]

		await this.bot.telegram.setMyCommands(
			Object.entries(preparedCommands)
				.map(([command, description]) => ({ command, description }))
		)
	}
}
