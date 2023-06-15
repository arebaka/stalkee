import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const chosenInlineResult: Middleware<Context> = async ctx => {
	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: ctx.chosenInlineResult?.result_id.split('.')[0]
		})

		audio.nUses++
		await audio.save()
	}
	catch (err) {
		logger.error(err as string, 'handler.chosen_inline_result')
	}
}
