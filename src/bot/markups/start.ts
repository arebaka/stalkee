import { Markup } from 'telegraf'

import { MarkupBuilder } from '../../types'

export const start: MarkupBuilder = ctx => Markup.inlineKeyboard([[
	Markup.switchToChatButton(ctx.t.markups.start.buttons.switch, '')
]])
