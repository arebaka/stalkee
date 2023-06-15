import { Logger } from 'typeorm'

import { logger } from '../utils'

export class DBLogger implements Logger {

	logQuery(query: string, parameters?: any[] | undefined) {}

	logQueryError(error: string | Error, query: string, parameters?: any[] | undefined) {
		logger.error(error.toString(), 'database.query')
	}
	logQuerySlow(time: number, query: string, parameters?: any[] | undefined) {
		logger.warn(`too slow (${time}): ` + query, 'database.query')
	}
	logSchemaBuild(message: string) {
		logger.info(message, 'database.schema')
	}
	logMigration(message: string) {
		logger.info(message, 'database.migration')
	}
	log(level: 'warn' | 'info' | 'log', message: any) {
		logger.log(level.toUpperCase(), message as string, 'database')
	}
}
