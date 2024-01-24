import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { config, i18n, logger } from '../../utils'
import { User } from '../../models'
import * as markups from '../markups'

export const lang: Middleware<Context> = async ctx => {
	const lang = ctx.match && ctx.match[1]
	if (!lang || !ctx.from) {
		return
	}

	if (!config.bot.locales.includes(lang)) {
		await ctx.answerCbQuery(ctx.t.actions.lang.res.invalid_lang, false)
		return
	}

	try {
		const user = await User.findOneByOrFail({ id: ctx.from.id })
		user.language = lang
		user.save()

		ctx.t = i18n[lang]
		await ctx.editMessageText(ctx.t.commands.start.res.ok, Extra
			.HTML()
			.markup(markups.start(ctx)))
	}
	catch (err) {
		await ctx.answerCbQuery(ctx.t.common.res.fail, true)
		logger.error(err as string, 'action.lang')
	}
}
