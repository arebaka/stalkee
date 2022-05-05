import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../util'
import { Audio, Word } from '../../models'
import * as markups from '../markups'

export const add:Middleware<Context> = async ctx => {
	const mess  = ctx.message.reply_to_message
	const quote = ctx.message.text.split(/\s+/g).slice(1).join(' ')

	if (quote && 'voice' in mess) {
		const audio = new Audio()

		audio.fileId   = mess.voice.file_id
		audio.fileUid  = mess.voice.file_unique_id
		audio.duration = mess.voice.duration
		audio.quote    = quote

		audio.words = quote
			.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
			.split(/\s+/g)
			.map(word => Word.create({ word }))

		try {
			await audio.save()

			ctx.reply(ctx.t.commands.add.res.ok, Extra.HTML().markup(
				markups.removeAfterAdd(ctx, { fileUid: audio.fileUid })))

			logger.info(`added ${audio.fileUid}`, 'command.add')
		}
		catch (err) {
			logger.error(''+err, 'command.add')
			ctx.reply(ctx.t.commands.add.res.already_added, Extra.HTML())
		}
	}
}
