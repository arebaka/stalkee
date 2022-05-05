import { Markup } from 'telegraf'

import { markupBuilder } from '../../types'
import { config, i18n } from '../../util'

const buttons = config.bot.locales.map(
	lang => Markup.callbackButton(i18n[lang].language, `lang:${lang}`))

export const lang:markupBuilder = () => Markup.inlineKeyboard([buttons])
