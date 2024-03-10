import { Telegraf } from 'telegraf'
import typegram from 'typegram'

import { config, i18n, logger } from '../utils'
import { LaunchOptions, Context } from '../types'

import * as middlewares from './middlewares'
import * as filters from './filters'
import * as commands from './commands'
import * as handlers from './handlers'
import * as actions from './actions'



type CommandsCategory = 'regular'|'admin'
type AllowedCommand = 'start'|'info'|'add'|'remove'|'quote'|'actor'|'location'

export class Bot {

	public static readonly commands: {[category: string]: AllowedCommand[]} = {
		regular: ['start', 'info'],
		admin: ['start', 'info', 'add', 'remove', 'quote', 'actor', 'location'],
	}

	private bot: Telegraf<Context>
	private options: LaunchOptions = {}
	private botInfo: typegram.User

	private static _buildCommands(category: CommandsCategory, locale: string) {
		return Bot.commands[category].map(command => ({
			command: command,
			description: i18n[locale].commands[command].descr
		}))
	}

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
			.action(/^lang:([^:]+)$/, actions.lang)
			.action(/^remove:([^:]+)$/, actions.remove)

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
		await this.setMyCommands()
	}

	async stop(): Promise<void> {
		await this.bot.stop()
	}

	async reload(): Promise<void> {
		await this.bot.stop()
		await this.start(this.options)
	}

	/**
	 * @deprecated with Bot API 6
	 */
	async setMode(mode: string): Promise<void> {
		logger.warn('Setting mode is deprecated!', 'bot.set_mode')
	}

	async setMyCommands() {
		await this.bot.telegram.setMyCommands(
			Bot._buildCommands('regular', config.bot.default_locale))
		for (const locale of config.bot.locales) {
			await this.bot.telegram.setMyCommands(
				Bot._buildCommands('regular', locale), {
					language_code: i18n[locale].iso_639_1_code
			})
		}

		const adminCommands = Bot._buildCommands('admin', config.bot.default_locale)
		for (const userId of config.bot.admins) {
			await this.bot.telegram.setMyCommands(
				adminCommands, { scope: { type: 'chat', chat_id: userId } })
		}
	}
}
