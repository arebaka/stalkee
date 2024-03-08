import {
	BaseEntity,
	Column,
	Entity,
	Index,
	PrimaryGeneratedColumn
} from 'typeorm'

@Entity('location_aliases')
export class LocationAlias extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	alias: string

	@Column()
	location: string
}
