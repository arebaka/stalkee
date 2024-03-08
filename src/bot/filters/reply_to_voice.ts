import type { Context } from '../../types'

export const replyToVoice = (ctx: Context): boolean =>
	!!ctx.message?.reply_to_message && 'voice' in ctx.message.reply_to_message
