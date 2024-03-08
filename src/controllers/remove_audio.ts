import { logger } from '../utils'
import { Audio } from '../models'

export const removeAudio = async (fileUid: string) => {
	try {
		await Audio.delete({ fileUid: fileUid })
	}
	catch (err) {
		logger.error(''+err, 'controller.remove_audio')
	}
}
