import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { removeAudio } from '../../controllers'

export const remove: Middleware<Context> = async ctx => {
	const fileUid = ctx.match && ctx.match[1]
	if (!fileUid) {
		return
	}

	try {
		await removeAudio(fileUid)
		await ctx.editMessageText(ctx.t.actions.remove.res.ok)
	}
	catch (err) {
		await ctx.answerCbQuery(ctx.t.common.res.fail, true)
		logger.error(err as string, 'action.remove')
	}
}
