import {
	BaseEntity,
	Column,
	Entity,
	Index,
	ManyToOne,
	PrimaryColumnCannotBeNullableError,
	PrimaryGeneratedColumn
} from 'typeorm'

import { Audio } from './audio'

@Entity('words')
export class Word extends BaseEntity {

	@PrimaryGeneratedColumn()
	id:PrimaryColumnCannotBeNullableError

	@ManyToOne(() => Audio, audio => audio.words, { nullable: false })
	audio:Audio

	@Column()
	@Index()
	word:string
}
