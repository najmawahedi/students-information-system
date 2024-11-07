import { Resolver, Query } from '@nestjs/graphql';
import { ChartService } from '../services/chart.service';
import {
  EntityCounts,
  StudentDistribution,
  StudentByUniversity,
  StudentByDepartment,
  StudentBySpecialization,
  DepartmentWithUniversityCount,
  SpecializationWithDeptAndUniversityCount,
} from '../types/chart.types';

@Resolver()
export class ChartResolver {
  constructor(private readonly chartService: ChartService) {}

  @Query(() => EntityCounts)
  async entityCounts(): Promise<EntityCounts> {
    return this.chartService.getEntityCounts();
  }

  @Query(() => StudentDistribution)
  async studentDistribution(): Promise<StudentDistribution> {
    return this.chartService.getStudentDistribution();
  }

  @Query(() => [StudentByUniversity])
  async studentCountsByUniversity(): Promise<StudentByUniversity[]> {
    return this.chartService.getStudentCountsByUniversity();
  }

  @Query(() => [StudentByDepartment])
  async studentCountsByDepartment(): Promise<StudentByDepartment[]> {
    return this.chartService.getStudentCountsByDepartment();
  }

  @Query(() => [DepartmentWithUniversityCount])
  async studentCountsByDepartmentWithUniversity(): Promise<
    DepartmentWithUniversityCount[]
  > {
    return this.chartService.getStudentCountsByDepartmentWithUniversity();
  }

  @Query(() => [StudentBySpecialization])
  async studentCountsBySpecialization(): Promise<StudentBySpecialization[]> {
    return this.chartService.getStudentCountsBySpecialization();
  }
  @Query(() => [SpecializationWithDeptAndUniversityCount])
  async studentCountsBySpecializationWithDeptAndUniversity(): Promise<
    SpecializationWithDeptAndUniversityCount[]
  > {
    return this.chartService.getSpecializationWithDeptAndUniversityCounts();
  }
}
