import rl from 'serverline'

class Controller {

	private handlers:{[command:string]: (args?:string[]) => Promise<void>}

	constructor() {
		this.handlers = {}
		this.setCommand('stop', () => process.exit(0))
	}

	private onLine(line:string): void {
		const parts   = line.trim().split(/\s/g)
		const command = parts[0]
		const params  = parts.slice(1)

		for (const key in this.handlers) {
			if (command == key) {
				this.handlers[key](params)
				break
			}
		}
	}

	private onInterrupt(rl:any): void {
		rl.question(
			'Confirm exit: ',
			(answer:string) => answer.match(/^y(es)?$/i)
				? this.handlers.stop()
				: rl.output.write('\x1b[1K' + rl.getPrompt()))
	}

	init(): void {
		rl.init('> ')
		rl.setCompletion([])

		rl.on('line', (line:string) => this.onLine(line))
		rl.on('SIGINT', (rl:any) => this.onInterrupt(rl))
	}

	close(): void {
		rl.close()
	}

	setCommand(command:string, handler:(args?:string[]) => Promise<void>): Controller {
		this.handlers[command] = handler
		rl.setCompletion(Object.keys(this.handlers))

		return this
	}
}

const readline = new Controller()
export { readline }
