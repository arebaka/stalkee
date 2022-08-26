import { Context as BaseContext } from 'telegraf'

import { Locale } from './locale'

export class Context extends BaseContext {
	t:Locale
}
