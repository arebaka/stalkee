import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import * as markups from '../markups'

export const start: Middleware<Context> = async ctx => {
	await ctx.reply(
		ctx.t.commands.start.res.ok,
		Extra.HTML().markup(markups.lang(ctx))
	)
}
