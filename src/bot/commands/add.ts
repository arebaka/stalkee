import path from 'path'
import fs from 'fs'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import * as markups from '../markups'
import { addAudio } from '../../controllers/add_audio'

export const add: Middleware<Context> = async ctx => {
	try {
		const message = ctx.message?.reply_to_message
		const quote = ctx.message?.text.split(/\s+/g).slice(1).join(' ')
		if (!message || !quote) {
			return
		}

		let fileId: string
		let fileUid: string

		if ('voice' in message) {
			fileId = message.voice.file_id
			fileUid = message.voice.file_unique_id
		}
		else if ('audio' in message) {
			await ctx.replyWithChatAction('record_audio')

			const fileLink = await ctx.telegram.getFileLink(message.audio.file_id)
			const stream: fs.ReadStream = await axios(fileLink, { responseType: 'stream' }).then(res => res.data)

			await new Promise((resolve, reject) => ffmpeg(stream)
				.audioCodec('libopus')
				.output(path.resolve(__dirname, '../../temp.ogg'))
				.on('error', reject)
				.on('end', resolve)
				.run()
			)

			const tempMessage = await ctx.replyWithVoice({
				source: path.resolve(__dirname, '../../temp.ogg'), filename: 'message.ogg'
			})
			fileId = tempMessage.voice.file_id
			fileUid = tempMessage.voice.file_unique_id

			fs.unlinkSync(path.resolve(__dirname, '../../temp.ogg'))
		}
		else {
			return
		}

		const audio = await addAudio(fileId, fileUid, quote)
		if (audio == null) {
			await ctx.reply(ctx.t.commands.add.res.already_added, Extra.HTML())
			return
		}

		await ctx.reply(ctx.t.commands.add.res.ok, Extra
			.HTML()
			.markup(markups.removeAfterAdd(ctx, { fileUid: audio.fileUid }))
		)
		logger.info(`added ${audio.fileUid}`, 'command.add')
	}
	catch (err) {
		logger.error(err as string, 'command.add')
		await ctx.reply(ctx.t.commands.add.res.already_added, Extra.HTML())
	}
}
