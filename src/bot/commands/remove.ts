import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const remove:Middleware<Context> = async ctx => {
	const mess = ctx.message.reply_to_message

	if ('voice' in mess) {
		try {
			const audio = await Audio.findOneByOrFail({
				fileUid: mess.voice.file_unique_id
			})

			await audio.remove()

			ctx.reply(ctx.t.commands.remove.res.ok, Extra.HTML())
			logger.info(`removed ${audio.fileUid}`, 'command.remove')
		}
		catch (err) {
			logger.error(''+err, 'command.remove')
			ctx.reply(ctx.t.commands.remove.res.not_found, Extra.HTML())
		}
	}
}
