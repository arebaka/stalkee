import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio, Word } from '../../models'

export const quote: Middleware<Context> = async ctx => {
	const message = ctx.message?.reply_to_message
	const quote = ctx.message?.text.split(/\s+/g).slice(1).join(' ')

	if (!message || !quote || !('voice' in message)) {
		return
	}

	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: message.voice.file_unique_id
		})
		const oldQuote = audio.quote
		const words = await Word.findBy({ audio: { id: audio.id } })

		audio.quote = quote
		Word.remove(words)
		audio.words = quote
			.replace(/[,./?!@#%^&*;:\-=+\\|`~()[\]{}]/g, '')
			.split(/\s+/g)
			.map(word => Word.create({ word }))

		await audio.save()

		await ctx.reply(ctx.t.commands.quote.res.ok
			.replace('{old_quote}', oldQuote || '')
			.replace('{quote}', quote || ''))

		logger.info(`set quote of ${audio.fileUid}`, 'command.quote')
	}
	catch (err) {
		logger.error(err as string, 'command.quote')
		await ctx.reply(ctx.t.commands.quote.res.not_found, Extra.HTML())
	}
}
