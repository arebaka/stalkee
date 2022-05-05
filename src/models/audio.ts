import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryColumnCannotBeNullableError,
	PrimaryGeneratedColumn
} from 'typeorm'

import { Word } from './word'

@Entity('audios')
export class Audio extends BaseEntity {

	@PrimaryGeneratedColumn()
	id:PrimaryColumnCannotBeNullableError

	@Column({ name: 'file_id', length: 128, unique: true })
	fileId:string

	@Column({ name: 'file_uid', length: 32, unique: true })
	fileUid:string

	@Column({ unsigned: true })
	duration:number

	@Column()
	quote:string

	@CreateDateColumn({ name: 'added_at' })
	addedAt:Date

	@Column({ name: 'n_uses', unsigned: true, default: 0 })
	@Index()
	nUses:number

	@OneToMany(() => Word, word => word.audio, { cascade: true })
	words:Word[]
}
