import { logger, parseWords } from '../utils'
import { Audio, Word } from '../models'

export const setQuote = async (fileUid: string, quote: string): Promise<string> => {
	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: fileUid
		})
		const oldQuote = audio.quote
		const words = await Word.findBy({ audio: { id: audio.id } })

		audio.quote = quote
		Word.remove(words)
		audio.words = parseWords(quote)

		await audio.save()

		return oldQuote
	}
	catch (err) {
		logger.error(err as string, 'controller.set_quote')
		return ''
	}
}
