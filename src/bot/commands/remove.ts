import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { removeAudio } from '../../controllers'

export const remove: Middleware<Context> = async ctx => {
	try {
		const message = ctx.message?.reply_to_message
		if (message && 'voice' in message) {
			await removeAudio(message.voice.file_unique_id)
		}
	}
	catch (err) {
		logger.error(err as string, 'command.remove')
		await ctx.reply(ctx.t.commands.remove.res.not_found, Extra.HTML())
	}
}
