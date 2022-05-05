import type { Context } from '../../types'

export function replyToVoice(ctx:Context): boolean {
	const mess = ctx.message?.reply_to_message
	if (!mess)
		return false

	return 'voice' in mess
}
