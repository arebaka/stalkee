import { Markup } from 'telegraf'
import { InlineKeyboardMarkup } from 'typegram'

import { Context } from './context'

type Options = {[key:string]: string}

export type markupBuilder = (
	ctx?:Context, options?:Options
) => Markup<InlineKeyboardMarkup> & InlineKeyboardMarkup
