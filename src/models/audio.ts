import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'

import { Word } from './word'

@Entity('audios')
export class Audio extends BaseEntity {

	@PrimaryGeneratedColumn()
	id:number

	@Column({ name: 'file_id', unique: true, length: 128 })
	fileId:string

	@Column({ name: 'file_uid', unique: true, length: 32 })
	fileUid:string

	@Column({ unsigned: true })
	duration:number

	@Index({ fulltext: true })
	@Column()
	quote:string

	@CreateDateColumn({ name: 'added_at' })
	addedAt:Date

	@Index()
	@Column({ name: 'n_uses', default: 0, unsigned: true })
	nUses:number

	@OneToMany(() => Word, word => word.audio, { cascade: true })
	words:Word[]
}
