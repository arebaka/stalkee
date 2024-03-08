import type { Context } from '../../types'
import { config, logger } from '../../utils'

export const admin = (ctx: Context): boolean => {
	if (!ctx.from) {
		return false
	}

	if (config.bot.admins.includes(ctx.from.id)) {
		return true
	} else {
		logger.warn(`${ctx.from.first_name} (${ctx.from.id}) is not admin!`, 'filter.admin')
		return false
	}
}
