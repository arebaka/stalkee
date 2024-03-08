import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { setQuote } from '../../controllers'

export const quote: Middleware<Context> = async ctx => {
	try {
		const message = ctx.message?.reply_to_message
		const quote = ctx.message?.text.split(/\s+/g).slice(1).join(' ')
		if (!message || !quote || !('voice' in message)) {
			return
		}

		const fileUid = message.voice.file_unique_id
		const oldQuote = await setQuote(fileUid, quote)

		await ctx.reply(ctx.t.commands.quote.res.ok
			.replace('{old_quote}', oldQuote || '')
			.replace('{quote}', quote || ''))

		logger.info(`set quote of ${fileUid}`, 'command.quote')
	}
	catch (err) {
		logger.error(err as string, 'command.quote')
		await ctx.reply(ctx.t.commands.quote.res.not_found, Extra.HTML())
	}
}
