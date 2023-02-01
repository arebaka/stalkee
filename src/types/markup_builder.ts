import { Markup } from 'telegraf'
import { InlineKeyboardMarkup } from 'typegram'

import { Context } from './context'

type Options = {[key: string]: string}

export type MarkupBuilder = (
	ctx: Context,
	options?: Options,
) => Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup
