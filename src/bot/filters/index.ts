import { Composer } from 'telegraf'

import { admin } from './admin'
import { replyToVoice } from './reply_to_voice'

const adminFilter = Composer.filter(admin)
const replyToVoiceFilter = Composer.filter(replyToVoice)

export {
	adminFilter as admin,
	replyToVoiceFilter as replyToVoice
}
