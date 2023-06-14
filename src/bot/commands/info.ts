import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const info: Middleware<Context> = async ctx => {
	const message = ctx.message?.reply_to_message

	if (message && 'voice' in message) {
		try {
			const audio = await Audio.findOneByOrFail({
				fileUid: message.voice.file_unique_id
			})

			ctx.reply(ctx.t.commands.info.res.ok
				.replace('{actor}', audio.actor || '')
				.replace('{location}', audio.location || '')
				.replace('{n_uses}', ''+audio.nUses || '')
				.replace('{quote}', audio.quote || '')
			)
		}
		catch (err) {
			logger.error(''+err, 'command.info')
			ctx.reply(ctx.t.commands.info.res.not_found, Extra.HTML())
		}
	}
}
