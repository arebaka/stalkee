import 'reflect-metadata'

import readline from 'readline'

import { App } from './app'

const app = new App()
const rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('> ')

rl.on('line', input => {
	const [command, ...args] = input.split(/\s/g)
	switch (command) {
		case 'stop': app.stop(); break
		case 'reload': app.reload(); break
		case 'mode': app.setMode(args[0]); break
	}
})

process
	.on('SIGINT', app.stop)
	.on('SIGTERM', app.stop)

app.start()
