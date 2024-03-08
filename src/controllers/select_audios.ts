import { logger } from '../utils'
import { Audio } from '../models'
import { selectAllAudios, selectAudiosByActorAndLocation, selectAudiosBySubstring, selectAudiosByWords } from '.'

export const selectAudios = async (query: string): Promise<Audio[]> => {
	try {
		if (!query) {
			return await selectAllAudios() || []
		}
		else if (query.length > 1 && query.startsWith('"') && query.endsWith('"')) {
			return await selectAudiosBySubstring(query.slice(1, -1)) || []
		}
		else if (query.length > 1 && (query.startsWith('@') || query.startsWith('~'))) {
			let first = query.slice(1)
			let second = ''

			const secondMarker = query[0] == '@' ? '~' : '@'
			const secondMarkerIndex = first.indexOf(secondMarker)

			if (secondMarkerIndex > -1) {
				second = first.slice(secondMarkerIndex + 1).trim()
				first = first.slice(0, secondMarkerIndex).trim()
			}

			const [actor, location] = secondMarker == '@' ? [second, first] : [first, second]
			return await selectAudiosByActorAndLocation(actor, location) || []
		}
		else {
			return await selectAudiosByWords(query.split(' ')) || []
		}
	}
	catch (err) {
		logger.error(''+err, 'controller.select_audios')
		return []
	}
}
