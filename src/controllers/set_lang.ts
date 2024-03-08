import { User as TelegramUser } from 'typegram'

import { logger } from '../utils'
import { User } from '../models'

export const setLang = async (telegramUser: TelegramUser, lang: string) => {
	try {
		const user = await User.findOneByOrFail({ id: telegramUser.id })
		user.language = lang
		await user.save()
	}
	catch (err) {
		logger.error(''+err, 'controller.set_lang')
	}
}
