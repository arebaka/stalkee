import { logger } from '../utils'
import { Audio } from '../models'

export const useAudio = async (fileUid: string) => {
	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: fileUid
		})

		audio.nUses++
		await audio.save()
	}
	catch (err) {
		logger.error(''+err, 'controller.use_audio')
	}
}
