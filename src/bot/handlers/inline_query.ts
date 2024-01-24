import { Middleware } from 'telegraf'
import { InlineQueryResultCachedDocument } from 'typegram'
import { FindManyOptions, Like } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Context } from '../../types'
import { config, logger } from '../../utils'
import { Audio } from '../../models'

function audioToQueryResult(audio: Audio): InlineQueryResultCachedDocument {
	return {
		type: 'document',
		id: `${audio.fileUid}.${uuidv4()}`,
		title: audio.quote,
		description: `${audio.actor || ''}${audio.location ? ' ◆︎ ' + audio.location : ''}\n▷ ${audio.nUses}`,
		document_file_id: audio.fileId
	}
}

const options: FindManyOptions<Audio> = {
	take: config.limits.max_result_size,
	order: { nUses: 'DESC' }
}

export const inlineQuery: Middleware<Context> = async ctx => {
	const query = ctx.inlineQuery?.query.trim().split(/\s+/g).join(' ')
	let audios: Audio[] = []

	try {
		if (!query) {
			audios = await Audio.find(options)
		}
		else if (query.length > 1 && query.startsWith('"') && query.endsWith('"')) {
			audios = await Audio.find({
				...options,
				where: {
					quote: Like(`%${query.slice(1, -1)}%`)
				}
			})
		}
		else {
			const words = query.split(' ')

			audios = await Audio.find({
				...options,
				take: undefined,
				relations: {
					words: true
				}
			})

			for (const word of words) {
				for (let i = 0; i < audios.length; i++) {
					const index = audios[i].words.map(w => w.word).indexOf(word)

					if (index < 0) {
						audios.splice(i--, 1)
					} else {
						audios[i].words.splice(index, 1)
					}
				}
			}

			audios.splice(config.limits.max_result_size)
		}

		await ctx.answerInlineQuery(
			audios.length > 0 ? audios.map(audioToQueryResult) : [],
			{ cache_time: 30 }
		)
	}
	catch (err) {
		logger.error(''+err, 'handler.inline_query')
		await ctx.answerInlineQuery([], { cache_time: 30 })
	}
}
