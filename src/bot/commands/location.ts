import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { setLocation } from '../../controllers'

export const location: Middleware<Context> = async ctx => {
	try {
		const message = ctx.message?.reply_to_message
		const location = ctx.message?.text.split(/\s+/g).slice(1).join(' ') || ''
		if (!message || !('voice' in message)) {
			return
		}

		const fileUid = message.voice.file_unique_id
		const oldLocation = await setLocation(fileUid, location)

		await ctx.reply(ctx.t.commands.location.res.ok
			.replace('{old_location}', oldLocation || '')
			.replace('{location}', location || ''))

		logger.info(`set location of ${fileUid} to ${location}`, 'command.location')
	}
	catch (err) {
		logger.error(err as string, 'command.location')
		await ctx.reply(ctx.t.commands.location.res.not_found, Extra.HTML())
	}
}
