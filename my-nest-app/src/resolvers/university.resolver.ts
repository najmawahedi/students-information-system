import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { University } from '../entities/university.entity';
import { UniversityService } from '../services/university.service';

@Resolver(() => University)
export class UniversityResolver {
  constructor(private universityService: UniversityService) {}

  @Query(() => [University], { name: 'universities' })
  getUniversities() {
    return this.universityService.findAll();
  }

  @Query(() => University, { name: 'university' })
  getUniversity(@Args('id', { type: () => Int }) id: number) {
    return this.universityService.findOne(id);
  }

  @Mutation(() => University)
  createUniversity(@Args('name') name: string) {
    return this.universityService.create(name);
  }
  @Mutation(() => University)
  updateUniversity(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ) {
    return this.universityService.update(id, name);
  }
  @Mutation(() => University, { nullable: true })
  async deleteUniversity(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<University | null> {
    return this.universityService
      .delete(id)
      .then(() => null)
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to delete university');
      });
  }
}
