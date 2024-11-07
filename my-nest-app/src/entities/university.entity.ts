import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Department } from './department.entity';
import { Student } from './student.entity';

@ObjectType()
@Entity()
export class University {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => [Department], { nullable: true })
  @OneToMany(() => Department, (department) => department.university)
  departments!: Department[];

  @Field(() => [Student], { nullable: true })
  @OneToMany(() => Student, (student) => student.university)
  students!: Student[];
}
