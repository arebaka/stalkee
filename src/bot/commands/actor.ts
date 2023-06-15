import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const actor: Middleware<Context> = async ctx => {
	const message = ctx.message?.reply_to_message
	const actor = ctx.message?.text.split(/\s+/g).slice(1).join(' ') || ''

	if (!message || !('voice' in message)) {
		return
	}

	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: message.voice.file_unique_id
		})
		const oldActor = audio.actor

		audio.actor = actor
		await audio.save()

		ctx.reply(ctx.t.commands.actor.res.ok
			.replace('{old_actor}', oldActor || '')
			.replace('{actor}', actor || ''))

		logger.info(`set actor of ${audio.fileUid} to ${actor}`, 'command.actor')
	}
	catch (err) {
		logger.error(err as string, 'command.actor')
		ctx.reply(ctx.t.commands.actor.res.not_found, Extra.HTML())
	}
}
