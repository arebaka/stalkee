import { logger } from '../utils'
import { Audio } from '../models'

export const getAudio = async (fileUid: string): Promise<Audio|null> => {
	try {
		return await Audio.findOneBy({
			fileUid: fileUid
		})
	}
	catch (err) {
		logger.error(''+err, 'controller.get_audio')
		return null
	}
}
