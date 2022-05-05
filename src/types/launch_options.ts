import { LaunchPollingOptions, LaunchWebhookOptions } from 'telegraf/typings/telegraf'

export interface LaunchOptions {
	pooling?:LaunchPollingOptions
	webhook?:LaunchWebhookOptions
}
