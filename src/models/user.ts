import {
	BaseEntity,
	Column,
	Entity,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity('users')
export class User extends BaseEntity {

	@PrimaryColumn('bigint')
	id: number

	@Column({ nullable: true, length: 32 })
	username: string

	@Column({ name: 'first_name', length: 64 })
	firstName: string

	@Column({ name: 'last_name', nullable: true, length: 64 })
	lastName: string

	@Column('character', { default: 'eng', length: 3 })
	language: string

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}
