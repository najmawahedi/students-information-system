import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Student } from '../entities/student.entity';
import { StudentService } from '../services/student.service';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query(() => [Student], { name: 'students' })
  async getStudents() {
    return this.studentService.findAll();
  }

  @Query(() => Student, { name: 'student' })
  async getStudent(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.findOne(id);
  }

  @Query(() => [Student], { name: 'studentsByUniversity' })
  async getStudentsByUniversity(
    @Args('universityId', { type: () => Int }) universityId: number,
  ) {
    return this.studentService.findByUniversity(universityId);
  }

  @Query(() => [Student], { name: 'studentsByDepartmentAndUniversity' })
  async getStudentsByDepartmentAndUniversity(
    @Args('universityId', { type: () => Int }) universityId: number,
    @Args('departmentId', { type: () => Int }) departmentId: number,
  ) {
    return this.studentService.findByDepartmentAndUniversity(
      universityId,
      departmentId,
    );
  }

  @Query(() => [Student], {
    name: 'studentsBySpecializationDepartmentAndUniversity',
  })
  async getStudentsBySpecializationDepartmentAndUniversity(
    @Args('universityId', { type: () => Int }) universityId: number,
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('specializationId', { type: () => Int }) specializationId: number,
  ) {
    return this.studentService.findBySpecializationDepartmentAndUniversity(
      universityId,
      departmentId,
      specializationId,
    );
  }

  @Mutation(() => Student)
  async createStudent(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('age', { type: () => Int }) age: number,
    @Args('specializationId', { type: () => Int }) specializationId: number,
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('universityId', { type: () => Int }) universityId: number,
  ) {
    return this.studentService.create({
      name,
      email,
      age,
      specializationId,
      departmentId,
      universityId,
    });
  }

  @Mutation(() => Boolean)
  async deleteStudent(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.delete(id);
  }
  @Mutation(() => Student)
  async updateStudent(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('age', { type: () => Int }) age: number,
    @Args('specializationId', { type: () => Int }) specializationId: number,
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('universityId', { type: () => Int }) universityId: number,
  ) {
    return this.studentService.update(id, {
      name,
      email,
      age,
      specializationId,
      departmentId,
      universityId,
    });
  }
}
