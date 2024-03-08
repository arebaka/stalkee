import { config, logger } from '../utils'
import { Audio } from '../models'

export const selectAudiosByWords = async (words: string[]): Promise<Audio[]|undefined> => {
	try {
		const audios = await Audio.find({
			order: { nUses: 'DESC' },
			relations: {
				words: true
			}
		})

		for (const word of words) {
			for (let i = 0; i < audios.length; i++) {
				const index = audios[i].words.map(w => w.word).indexOf(word)

				if (index < 0) {
					audios.splice(i--, 1)
				} else {
					audios[i].words.splice(index, 1)
				}
			}
		}

		audios.splice(config.limits.max_result_size)
		return audios
	}
	catch (err) {
		logger.error(''+err, 'controller.select_audios_by_words')
	}
}
