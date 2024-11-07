import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { University } from './university.entity';
import { Specialization } from './specialization.entity';
import { Student } from './student.entity';

@ObjectType()
@Entity()
export class Department {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => University, { nullable: true })
  @ManyToOne(() => University, (university) => university.departments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  university!: University | null;

  @Field(() => [Specialization], { nullable: 'itemsAndList' })
  @OneToMany(
    () => Specialization,
    (specialization) => specialization.department,
    {
      cascade: true,
    },
  )
  specializations!: Specialization[] | null;

  @Field(() => [Student], { nullable: 'itemsAndList' })
  @OneToMany(() => Student, (student) => student.department, {
    nullable: true,
  })
  students!: Student[] | null;
}
