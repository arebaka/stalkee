import { Markup } from 'telegraf'

import { markupBuilder } from '../../types'

export const start:markupBuilder = ctx => Markup.inlineKeyboard([[
	Markup.switchToChatButton(ctx.t.markups.start.buttons.switch, '')
]])
