import { logger } from '../utils'
import { Audio } from '../models'

export const setLocation = async (fileUid: string, location: string): Promise<string> => {
	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: fileUid
		})
		const oldLocation = audio.location

		audio.location = location
		await audio.save()

		return oldLocation
	}
	catch (err) {
		logger.error(err as string, 'controller.set_location')
		return ''
	}
}
