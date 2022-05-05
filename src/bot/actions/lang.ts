import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { config, i18n, logger } from '../../util'
import { User } from '../../models'
import * as markups from '../markups'

export const lang:Middleware<Context> = async ctx => {
	const lang = ctx.match[1]

	if (!config.bot.locales.includes(lang)) {
		ctx.answerCbQuery(ctx.t.actions.lang.res.invalid_lang, false)
		return
	}

	try {
		const user = await User.findOneByOrFail({ id: ctx.from.id })
		user.language = lang
		user.save()

		ctx.t = i18n[lang]
		ctx.editMessageText(ctx.t.commands.start.res.ok, Extra
			.HTML()
			.markup(markups.start(ctx)))
	}
	catch (err) {
		ctx.answerCbQuery(ctx.t.common.res.fail, true)
		logger.error(''+err, 'middleware.lang')
	}
}
