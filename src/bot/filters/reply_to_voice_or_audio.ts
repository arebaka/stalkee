import type { Context } from '../../types'

export const replyToVoiceOrAudio = (ctx: Context): boolean => {
	const replyToMessage = ctx.message?.reply_to_message
	return !!replyToMessage && ('voice' in replyToMessage || 'audio' in replyToMessage)
}
