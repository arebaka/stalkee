import { logger, parseWords } from '../utils'
import { Audio } from '../models'

export const addAudio = async (fileId: string, fileUid: string, quote: string): Promise<Audio|null> => {
	try {
		const audio = new Audio()

		audio.fileId = fileId
		audio.fileUid = fileUid
		audio.quote = quote
		audio.words = parseWords(quote)

		return await audio.save()
	}
	catch (err) {
		logger.error(err as string, 'controller.set_quote')
		return null
	}
}
