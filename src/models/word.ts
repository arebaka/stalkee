import {
	BaseEntity,
	Column,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'

import { Audio } from './audio'

@Entity('words')
export class Word extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => Audio, audio => audio.words, { nullable: false, onDelete: 'CASCADE' })
	audio: Audio

	@Index()
	@Column()
	word: string
}
