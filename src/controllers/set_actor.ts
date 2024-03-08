import { logger } from '../utils'
import { Audio } from '../models'

export const setActor = async (fileUid: string, actor: string): Promise<string> => {
	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: fileUid
		})
		const oldActor = audio.actor

		audio.actor = actor
		await audio.save()

		return oldActor
	}
	catch (err) {
		logger.error(err as string, 'controller.set_actor')
		return ''
	}
}
