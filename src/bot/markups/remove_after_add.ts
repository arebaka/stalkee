import { Markup } from 'telegraf'

import { markupBuilder } from '../../types'

export const removeAfterAdd:markupBuilder = (
	ctx, { fileUid }
) => Markup.inlineKeyboard([[
	Markup.callbackButton(
		ctx.t.markups.remove_after_add.buttons.remove, `remove:${fileUid}`)
]])
