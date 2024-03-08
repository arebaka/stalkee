import {
	BaseEntity,
	Column,
	Entity,
	Index,
	PrimaryGeneratedColumn
} from 'typeorm'

@Entity('actor_aliases')
export class ActorAlias extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	alias: string

	@Column()
	actor: string
}
