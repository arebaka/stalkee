import { Like } from 'typeorm'

import { config, logger } from '../utils'
import { Audio } from '../models'

export const selectAudiosBySubstring = async (query: string): Promise<Audio[]|undefined> => {
	try {
		return await Audio.find({
			take: config.limits.max_result_size,
			order: { nUses: 'DESC' },
			where: {
				quote: Like(`%${query}%`)
			}
		})
	}
	catch (err) {
		logger.error(''+err, 'controller.select_audios_by_substring')
	}
}
