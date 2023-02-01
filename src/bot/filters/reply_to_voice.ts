import type { Context } from '../../types'

export function replyToVoice(ctx: Context): boolean {
	return !!ctx.message?.reply_to_message && 'voice' in ctx.message.reply_to_message
}
