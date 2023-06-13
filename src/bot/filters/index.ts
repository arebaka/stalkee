import { Composer } from 'telegraf'

import { admin } from './admin'
import { replyToVoice } from './reply_to_voice'
import { replyToVoiceOrAudio } from './reply_to_voice_or_audio'

const adminFilter = Composer.filter(admin)
const replyToVoiceFilter = Composer.filter(replyToVoice)
const replyToVoiceOrAudioFilter = Composer.filter(replyToVoiceOrAudio)

export {
	adminFilter as admin,
	replyToVoiceFilter as replyToVoice,
	replyToVoiceOrAudioFilter as replyToVoiceOrAudio
}
