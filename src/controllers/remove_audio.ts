import { logger } from '../utils'
import { Audio } from '../models'

export const removeAudio = async (fileUid: string): Promise<boolean> => {
	try {
		const res = await Audio.delete({ fileUid: fileUid })
		return !!res.affected
	}
	catch (err) {
		logger.error(''+err, 'controller.remove_audio')
		return false
	}
}
