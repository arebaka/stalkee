import { User as TelegramUser } from 'typegram'

import { config, logger } from '../utils'
import { User } from '../models'

const DEFAULT_LANG = config.bot.locales[0]

export const updateUser = async (telegramUser: TelegramUser) => {
	try {
		let user = await User.findOneBy({ id: telegramUser.id })

		if (!user) {
			user = new User()
			user.id = telegramUser.id
			user.language = DEFAULT_LANG
		}

		user.username = telegramUser.username || ''
		user.firstName = telegramUser.first_name
		user.lastName = telegramUser.last_name || ''
		user.updatedAt = new Date()

		await user.save()
	}
	catch (err) {
		logger.error(''+err, 'controller.update')
	}
}
