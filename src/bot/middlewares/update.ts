import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { updateUser } from '../../controllers'

export const update: Middleware<Context> = async (ctx, next) => {
	if (!ctx.from) {
		return await next()
	}

	await updateUser(ctx.from)
	return await next()
}
