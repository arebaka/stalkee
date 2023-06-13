import path from 'path'
import fs from 'fs'
import yaml from 'yaml'

import { Locale } from '../types'
import { config } from './config'

const i18n: {[key: string]: Locale} = {}

for (const lang of config.bot.locales) {
	const source = fs.readFileSync(path.resolve(`res/i18n/${lang}.yaml`), 'utf8')
	i18n[lang] = yaml.parse(source)
}

export { i18n }
