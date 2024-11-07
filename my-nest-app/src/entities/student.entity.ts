import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Specialization } from './specialization.entity';
import { Department } from './department.entity';
import { University } from './university.entity';

@ObjectType()
@Entity()
export class Student {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  email!: string;

  @Field(() => Int)
  @Column()
  age!: number;

  @Field(() => Specialization)
  @ManyToOne(
    () => Specialization,
    (specialization) => specialization.students,
    {
      eager: true,
    },
  )
  specialization!: Specialization;

  @Field(() => Department)
  @ManyToOne(() => Department, (department) => department.students, {
    eager: true,
  })
  department!: Department;

  @Field(() => University)
  @ManyToOne(() => University, (university) => university.students, {
    eager: true,
  })
  university!: University;
}
