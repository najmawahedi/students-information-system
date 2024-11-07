import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EntityCounts {
  @Field(() => Int)
  universities!: number;

  @Field(() => Int)
  departments!: number;

  @Field(() => Int)
  specializations!: number;

  @Field(() => Int)
  students!: number;
}

@ObjectType()
export class CountByCategory {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class StudentDistribution {
  @Field(() => [StudentByUniversity])
  byUniversity!: StudentByUniversity[];

  @Field(() => [StudentByDepartment])
  byDepartment!: StudentByDepartment[];

  @Field(() => [StudentBySpecialization])
  bySpecialization!: StudentBySpecialization[];
}

@ObjectType()
export class StudentByUniversity {
  @Field(() => Int)
  universityId!: number;

  @Field(() => String)
  universityName!: string;

  @Field(() => Int)
  studentCount!: number;
}

@ObjectType()
export class StudentByDepartment {
  @Field(() => Int)
  departmentId!: number;

  @Field(() => String)
  departmentName!: string;

  @Field(() => Int)
  studentCount!: number;
}

@ObjectType()
export class StudentBySpecialization {
  @Field(() => Int)
  specializationId!: number;

  @Field(() => String)
  specializationName!: string;

  @Field(() => Int)
  studentCount!: number;
}

@ObjectType()
export class DepartmentWithUniversityCount {
  @Field(() => Int)
  departmentId!: number;

  @Field(() => String)
  departmentName!: string;

  @Field(() => String)
  universityName!: string;

  @Field(() => Int)
  studentCount!: number;
}

interface DepartmentData {
  departmentId: number;
  departmentName: string;
  universityName: string;
  studentCount: number;
}
@ObjectType()
export class SpecializationWithDeptAndUniversityCount {
  @Field(() => Int)
  specializationId!: number;

  @Field(() => String)
  specializationName!: string;

  @Field(() => String)
  departmentName!: string;

  @Field(() => String)
  universityName!: string;

  @Field(() => Int)
  studentCount!: number;
}

interface SpecializationData {
  specializationId: number;
  specializationName: string;
  departmentName: string;
  universityName: string;
  studentCount: number;
}
