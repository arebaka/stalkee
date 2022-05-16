import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { i18n, logger } from '../../utils'
import { User } from '../../models'

export const setLocale:Middleware<Context> = async (ctx, next) => {
	try {
		const user = await User.findOneByOrFail({ id: ctx.from.id })
		ctx.t = i18n[user.language]
		next()
	}
	catch (err) {
		logger.error(''+err, 'middleware.set_locale')
	}
}
