import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { getAudio } from '../../controllers'

export const info: Middleware<Context> = async ctx => {
	try {
		const message = ctx.message?.reply_to_message
		if (!message || !('voice' in message)) {
			return
		}

		const audio = await getAudio(message.voice.file_unique_id)
		if (!audio) {
			await ctx.reply(ctx.t.commands.info.res.not_found, Extra.HTML())
			return
		}

		await ctx.reply(ctx.t.commands.info.res.ok
			.replace('{actor}', audio.actor || '')
			.replace('{location}', audio.location || '')
			.replace('{n_uses}', ''+audio.nUses || '')
			.replace('{quote}', audio.quote || '')
		)
	}
	catch (err) {
		logger.error(err as string, 'command.info')
		await ctx.reply(ctx.t.commands.info.res.not_found, Extra.HTML())
	}
}
