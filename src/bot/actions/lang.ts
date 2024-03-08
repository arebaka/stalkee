import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { config, i18n, logger } from '../../utils'
import * as markups from '../markups'
import { setLang } from '../../controllers'

export const lang: Middleware<Context> = async ctx => {
	const lang = ctx.match && ctx.match[1]
	if (!lang || !ctx.from) {
		return
	}

	try {
		if (!config.bot.locales.includes(lang)) {
			await ctx.answerCbQuery(ctx.t.actions.lang.res.invalid_lang, false)
			return
		}

		await setLang(ctx.from, lang)
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
