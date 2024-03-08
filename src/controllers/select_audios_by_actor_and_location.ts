import { config, logger } from '../utils'
import { ActorAlias, Audio, LocationAlias } from '../models'

export const selectAudiosByActorAndLocation = async (actor: string, location: string): Promise<Audio[]|undefined> => {
	try {
		actor = actor.toLowerCase()
		location = location.toLowerCase()

		if (actor) {
			const actorEntity = await ActorAlias.findOneBy({
				alias: actor
			})
			actor = actorEntity?.actor || ''
		}
		if (location) {
			const locationEntity = await LocationAlias.findOneBy({
				alias: location
			})
			location = locationEntity?.location || ''
		}

		return await Audio.find({
			take: config.limits.max_result_size,
			order: { nUses: 'DESC' },
			where: {
				actor: actor || undefined,
				location: location || undefined,
			}
		})
	}
	catch (err) {
		logger.error(''+err, 'controller.select_audios_by_actor_and_location')
	}
}
