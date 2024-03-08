import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { config, i18n, logger } from '../../utils'
import { User } from '../../models'

export const setLocale: Middleware<Context> = async (ctx, next) => {
	if (!ctx.from) {
		return await next()
	}

	try {
		const user = await User.findOneByOrFail({ id: ctx.from.id })
		ctx.t = i18n[user.language] || i18n[config.bot.locales[0]]
		return await next()
	}
	catch (err) {
		logger.error(err as string, 'middleware.set_locale')
	}
}
