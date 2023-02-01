import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { config, logger } from '../../utils'
import { User } from '../../models'

const DEFAULT_LANG = config.bot.locales[0]

export const update: Middleware<Context> = async (ctx, next) => {
	if (!ctx.from)
		return next()

	try {
		let user = await User.findOneBy({ id: ctx.from.id })

		if (!user) {
			user = new User()
			user.id = ctx.from.id
			user.language = DEFAULT_LANG
		}

		user.username = ctx.from.username || ''
		user.firstName = ctx.from.first_name
		user.lastName = ctx.from.last_name || ''
		user.updatedAt = new Date()

		await user.save()
		next()
	}
	catch (err) {
		logger.error(''+err, 'middleware.update')
	}
}
