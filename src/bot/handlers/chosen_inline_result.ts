import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { useAudio } from '../../controllers'

export const chosenInlineResult: Middleware<Context> = async ctx => {
	try {
		const fileUid = ctx.chosenInlineResult?.result_id.split('.')[0]
		if (fileUid != null) {
			await useAudio(fileUid)
		}
	}
	catch (err) {
		logger.error(err as string, 'handler.chosen_inline_result')
	}
}
