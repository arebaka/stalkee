import { config, logger } from '../utils'
import { Audio } from '../models'

export const selectAllAudios = async (): Promise<Audio[]|undefined> => {
	try {
		return await Audio.find({
			take: config.limits.max_result_size,
			order: { nUses: 'DESC' }
		})
	}
	catch (err) {
		logger.error(''+err, 'controller.select_all_audios')
	}
}
