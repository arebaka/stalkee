import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const remove: Middleware<Context> = async ctx => {
	const message = ctx.message?.reply_to_message

	if (message && 'voice' in message) {
		try {
			const audio = await Audio.findOneByOrFail({
				fileUid: message.voice.file_unique_id
			})

			await audio.remove()

			ctx.reply(ctx.t.commands.remove.res.ok, Extra.HTML())
			logger.info(`removed ${audio.fileUid}`, 'command.remove')
		}
		catch (err) {
			logger.error(err as string, 'command.remove')
			ctx.reply(ctx.t.commands.remove.res.not_found, Extra.HTML())
		}
	}
}
