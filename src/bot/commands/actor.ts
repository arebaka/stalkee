import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { setActor } from '../../controllers'

export const actor: Middleware<Context> = async ctx => {
	try {
		const message = ctx.message?.reply_to_message
		const actor = ctx.message?.text.split(/\s+/g).slice(1).join(' ') || ''
		if (!message || !('voice' in message)) {
			return
		}

		const fileUid = message.voice.file_unique_id
		const oldActor = await setActor(fileUid, actor)

		await ctx.reply(ctx.t.commands.actor.res.ok
			.replace('{old_actor}', oldActor || '')
			.replace('{actor}', actor || ''))

		logger.info(`set actor of ${fileUid} to ${actor}`, 'command.actor')
	}
	catch (err) {
		logger.error(err as string, 'command.actor')
		await ctx.reply(ctx.t.commands.actor.res.not_found, Extra.HTML())
	}
}
