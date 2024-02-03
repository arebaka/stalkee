import path from 'path'
import fs from 'fs'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio, Word } from '../../models'
import * as markups from '../markups'

export const add: Middleware<Context> = async ctx => {
	const message = ctx.message?.reply_to_message
	const quote = ctx.message?.text.split(/\s+/g).slice(1).join(' ')

	if (!message || !quote) {
		return
	}

	try {
		const audio = new Audio()

		audio.quote = quote
		audio.words = quote
			.toLowerCase()
			.replace(/[,./?!@#%^&*;:\-=+\\|`~()[\]{}\u2013]/g, '')
			.split(/\s+/g)
			.map(word => Word.create({ word }))

		if ('voice' in message) {
			audio.fileId = message.voice.file_id
			audio.fileUid = message.voice.file_unique_id
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
			audio.fileId = tempMessage.voice.file_id
			audio.fileUid = tempMessage.voice.file_unique_id
			fs.unlinkSync(path.resolve(__dirname, '../../temp.ogg'))
		}

		await audio.save()

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
