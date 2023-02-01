import { Markup } from 'telegraf'

import { MarkupBuilder } from '../../types'

export const removeAfterAdd: MarkupBuilder = (
	ctx, options
) => Markup.inlineKeyboard([[
	Markup.callbackButton(
		ctx.t.markups.remove_after_add.buttons.remove, `remove:${options?.fileUid}`)
]])
