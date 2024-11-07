import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Specialization } from '../entities/specialization.entity';
import { SpecializationService } from '../services/specialization.service';

@Resolver(() => Specialization)
export class SpecializationResolver {
  constructor(private specializationService: SpecializationService) {}

  @Query(() => [Specialization], { name: 'specializations' })
  getSpecializations() {
    return this.specializationService.findAll();
  }
  @Query(() => [Specialization], { name: 'specializationsByUniversity' })
  async getSpecializationsByUniversity(
    @Args('universityId', { type: () => Int }) universityId: number,
  ) {
    return this.specializationService.findByUniversity(universityId);
  }

  @Query(() => [Specialization], { name: 'specializationsByDepartment' })
  async getSpecializationsByDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
  ) {
    return this.specializationService.findByDepartment(departmentId);
  }

  @Query(() => Specialization, { name: 'specialization' })
  getSpecialization(@Args('id', { type: () => Int }) id: number) {
    return this.specializationService.findOne(id);
  }

  @Mutation(() => Specialization)
  createSpecialization(
    @Args('name') name: string,
    @Args('departmentId', { type: () => Int }) departmentId: number,
  ) {
    return this.specializationService.create(name, departmentId);
  }

  @Query(() => [Specialization], { name: 'specializationWithStudents' })
  getSpecializationWithStudents(@Args('id', { type: () => Int }) id: number) {
    return this.specializationService.findOneWithStudents(id);
  }
  @Query(() => [Specialization], { name: 'filteredSpecializations' })
  async getFilteredSpecializations(
    @Args('universityId', { type: () => Int, nullable: true })
    universityId?: number,
    @Args('departmentId', { type: () => Int, nullable: true })
    departmentId?: number,
  ) {
    return this.specializationService.findByFilters(universityId, departmentId);
  }
  @Mutation(() => Boolean)
  async deleteSpecialization(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      await this.specializationService.delete(id);
      return true;
    } catch (error) {
      console.error('Deletion failed:', error);
      return false;
    }
  }

  @Mutation(() => Specialization, { nullable: true })
  async updateSpecialization(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ): Promise<Specialization | null> {
    return this.specializationService.update(id, name);
  }
}
