import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Department } from '../entities/department.entity';
import { DepartmentService } from '../services/department.service';

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private departmentService: DepartmentService) {}

  @Query(() => [Department], { name: 'departments' })
  async getDepartments(
    @Args('universityId', { type: () => Int, nullable: true })
    universityId?: number,
  ): Promise<Department[]> {
    return this.departmentService.findByUniversity(universityId);
  }

  @Query(() => Department, { name: 'department' })
  getDepartment(@Args('id', { type: () => Int }) id: number) {
    return this.departmentService.findOne(id);
  }

  @Mutation(() => Department)
  createDepartment(
    @Args('name') name: string,
    @Args('universityId', { type: () => Int }) universityId: number,
  ) {
    return this.departmentService.create(name, universityId);
  }
  @Mutation(() => Department)
  async editDepartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ): Promise<Department> {
    return this.departmentService.edit(id, name);
  }

  @Mutation(() => Boolean)
  async deleteDepartment(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.departmentService.delete(id);
  }
}
