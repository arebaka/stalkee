type Dict = {[key: string]: string}

interface Command {
	descr: string
	res: Dict
}

interface Handler {
	res: Dict
}

interface Markup {
	buttons: Dict
}

interface Action {
	res: Dict
}

export interface Locale {
	language: string
	iso_639_1_code: string
	name: string
	common: {
		res: Dict & {
			fail: string
		}
	}
	commands: {
		start: Command & {
			res: {
				ok: string
			}
		}
		info: Command & {
			res: {
				ok: string
				not_found: string
			}
		}
		add: Command & {
			res: {
				ok: string
				already_added: string
			}
		}
		remove: Command & {
			res: {
				ok: string
				not_found: string
			}
		}
		quote: Command & {
			res: {
				ok: string
				not_found: string
			}
		}
		actor: Command & {
			res: {
				ok: string
				not_found: string
			}
		}
		location: Command & {
			res: {
				ok: string
				not_found: string
			}
		}
	}
	handlers: {
		inlineQuery: Handler & { res: Record<string, never> }
		chosen_inline_query: Handler & { res: Record<string, never> }
	}
	markups: {
		lang: Markup & { buttons: Record<string, never> }
		start: Markup & {
			buttons: {
				switch: string
			}
		}
		remove_after_add: Markup & {
			buttons: {
				remove: string
			}
		}
	}
	actions: {
		lang: Action & {
			res: {
				invalid_lang: string
			}
		}
		remove: Action & {
			res: {
				ok: string
			}
		}
	}
}
