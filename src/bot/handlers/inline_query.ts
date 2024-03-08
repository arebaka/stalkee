import { Middleware } from 'telegraf'
import { InlineQueryResultCachedDocument } from 'typegram'
import { v4 as uuidv4 } from 'uuid'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'
import { selectAudios } from '../../controllers'

const audioToQueryResult = (audio: Audio): InlineQueryResultCachedDocument => {
	return {
		type: 'document',
		id: `${audio.fileUid}.${uuidv4()}`,
		title: audio.quote,
		description: `${audio.actor || ''}${audio.location ? ' ◆︎ ' + audio.location : ''}\n▷ ${audio.nUses}`,
		document_file_id: audio.fileId
	}
}

export const inlineQuery: Middleware<Context> = async ctx => {
	try {
		const query = ctx.inlineQuery?.query.trim().split(/\s+/g).join(' ')
		if (query == null) {
			return await ctx.answerInlineQuery([], { cache_time: 30 })
		}

		const audios = await selectAudios(query)
		await ctx.answerInlineQuery(
			audios.length > 0 ? audios.map(audioToQueryResult) : [],
			{ cache_time: 30 }
		)
	}
	catch (err) {
		logger.error(''+err, 'handler.inline_query')
		await ctx.answerInlineQuery([], { cache_time: 0 })
	}
}
