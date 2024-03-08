import { Word } from '../models'

export const parseWords = (quote: string): Word[] => {
	return quote
		.toLowerCase()
		.replace(/[,./?!@#%^&*;:\-=+\\|"`~()[\]{}\u2013]/g, '')
		.split(/\s+/g)
		.map(word => Word.create({ word }))
}
