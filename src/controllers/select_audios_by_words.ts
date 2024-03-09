import { config, logger } from '../utils'
import { Audio } from '../models'

export const selectAudiosByWords = async (words: string[]): Promise<Audio[]|undefined> => {
	try {
		if (words.length == 0) {
			return []
		}

		// limitation: select all audios that include first word
		const audios = await Audio.createQueryBuilder('a')
			.innerJoin('a.words', 'w1')
			.where('w1.word = :word', { word: words[0] })
			.innerJoinAndSelect('a.words', 'w2')
			.orderBy('a.n_uses', 'DESC')
			.getMany()

		// count same words of each selected audio, sync indexes
		const wordsCounter: {[word: string]: number}[] = []
		for (const audio of audios) {
			const counter: {[word: string]: number} = {}
			for (const word of audio.words) {
				if (!(word.word in counter)) {
					counter[word.word] = 0
				}
				counter[word.word]++
			}
			wordsCounter.push(counter)
		}

		const res: Audio[] = []
		for (let i = 0; i < audios.length; i++) {
			let excluded = false
			for (const word of words) {
				if (!(word in wordsCounter[i]) || wordsCounter[i][word] <= 0) {
					excluded = true
					break
				}
				wordsCounter[i][word]--
			}
			if (!excluded) {
				res.push(audios[i])
			}
		}

		res.splice(config.limits.max_result_size)
		return res
	}
	catch (err) {
		logger.error(''+err, 'controller.select_audios_by_words')
	}
}
