import { Context as DefaultContext } from 'telegraf'

import { Locale } from './locale'

export class Context extends DefaultContext {
	t:Locale
}
