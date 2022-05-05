import { Middleware } from 'telegraf'
import { InlineQueryResultCachedDocument } from 'typegram'
import { FindManyOptions, In, Like } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Context } from '../../types'
import { config, logger } from '../../util'
import { Audio } from '../../models'

function audioToQueryResult(audio:Audio): InlineQueryResultCachedDocument {
	return {
		type: 'document',
		id: `${audio.fileUid}.${uuidv4()}`,
		title: audio.quote,
		description: ''+audio.nUses,
		document_file_id: audio.fileId
	}
}

const options:FindManyOptions<Audio> = {
	take: config.limits.max_result_size,
	order: { nUses: 'DESC' }
}

export const inlineQuery:Middleware<Context> = async ctx => {
	const query = ctx.inlineQuery.query.trim().split(/\s+/g).join(' ')
	let audios:Audio[]

	try {
		if (!query) {
			audios = await Audio.find(options)
		}
		else if (query.length > 1 && query.startsWith('"') && query.endsWith('"')) {
			audios = await Audio.find({
				...options,
				where: {
					quote: Like(`%${query}%`)  //FIXME
				}
			})
		}
		else {
			const words = query.split(' ')

			audios = await Audio.find({
				...options,
				where: {
					words: { word: In(words) }
				},
				relations: {
					words: true
				}
			})

			audios = audios.filter(audio => audio.words.every(word => words.includes(word.word)))
		}

		ctx.answerInlineQuery(audios.map(audioToQueryResult), { cache_time: 30 })
	}
	catch (err) {
		logger.error(''+err, 'handler.inline_query')
		ctx.answerInlineQuery([], { cache_time: 30 })
	}
}
