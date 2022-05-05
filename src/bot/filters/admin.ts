import type { Context } from '../../types'
import { config, logger } from '../../util'

export function admin(ctx:Context): boolean {
	if (ctx.from != null && config.bot.admins.includes(ctx.from.id))
		return true

	logger.warn(`${ctx.from.first_name} (${ctx.from.id}) is not admin!`, 'filter.admin')
	return false
}
