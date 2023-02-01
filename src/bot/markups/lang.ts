import { Markup } from 'telegraf'

import { MarkupBuilder } from '../../types'
import { config, i18n } from '../../utils'

export const lang: MarkupBuilder = () => Markup.inlineKeyboard([
	config.bot.locales.map(
		lang => Markup.callbackButton(i18n[lang].language, `lang:${lang}`)
	)
])
