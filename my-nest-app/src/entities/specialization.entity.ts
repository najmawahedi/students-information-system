import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Department } from './department.entity';
import { Student } from './student.entity';

@ObjectType()
@Entity()
export class Specialization {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => Department)
  @ManyToOne(() => Department, (department) => department.specializations, {
    nullable: false,
    onDelete: 'CASCADE', 
  })
  department!: Department;

  @Field(() => [Student], { nullable: 'items' })
  @OneToMany(() => Student, (student) => student.specialization)
  students!: Student[];
}
