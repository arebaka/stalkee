import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn
} from 'typeorm'

@Entity('users')
export class User extends BaseEntity {

	@PrimaryColumn({ type: 'bigint', unique: true })
	id:number

	@Column({ length: 32, nullable: true })
	username:string

	@Column({ name: 'first_name', length: 64 })
	firstName:string

	@Column({ name: 'last_name', length: 64, nullable: true })
	lastName:string

	@Column({ length: 3, default: 'eng' })
	language:string

	@CreateDateColumn({ name: 'updated_at' })
	updatedAt:Date
}
