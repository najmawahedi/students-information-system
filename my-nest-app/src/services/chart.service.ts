import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { University } from '../entities/university.entity';
import { Department } from '../entities/department.entity';
import { Specialization } from '../entities/specialization.entity';
import {
  EntityCounts,
  StudentDistribution,
  StudentByUniversity,
  StudentByDepartment,
  StudentBySpecialization,
  DepartmentWithUniversityCount,
  SpecializationWithDeptAndUniversityCount,
} from '../types/chart.types';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(University)
    private universityRepo: Repository<University>,
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    @InjectRepository(Specialization)
    private specializationRepo: Repository<Specialization>,
  ) {}

  async getEntityCounts(): Promise<EntityCounts> {
    const universities = await this.universityRepo.count();
    const departments = await this.departmentRepo.count();
    const specializations = await this.specializationRepo.count();
    const students = await this.studentRepo.count();
    return { universities, departments, specializations, students };
  }

  async getStudentDistribution(): Promise<StudentDistribution> {
    const byUniversity = await this.getStudentCountsByUniversity();
    const byDepartment = await this.getStudentCountsByDepartment();
    const bySpecialization = await this.getStudentCountsBySpecialization();

    return { byUniversity, byDepartment, bySpecialization };
  }

  async getStudentCountsByUniversity(): Promise<StudentByUniversity[]> {
    const results = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.university', 'university')
      .select('student.universityId', 'universityId')
      .addSelect('university.name', 'universityName')
      .addSelect('COUNT(*)', 'studentCount')
      .groupBy('student.universityId')
      .addGroupBy('university.name')
      .getRawMany();

    return results.map((result) => ({
      universityId: result.universityId,
      universityName: result.universityName,
      studentCount: parseInt(result.studentCount, 10),
    }));
  }

  async getStudentCountsByDepartment(): Promise<StudentByDepartment[]> {
    const results = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.department', 'department')
      .select('student.departmentId', 'departmentId')
      .addSelect('department.name', 'departmentName')
      .addSelect('COUNT(*)', 'studentCount')
      .groupBy('student.departmentId')
      .addGroupBy('department.name')
      .getRawMany();

    return results.map((result) => ({
      departmentId: result.departmentId,
      departmentName: result.departmentName,
      studentCount: parseInt(result.studentCount, 10),
    }));
  }

  async getStudentCountsBySpecialization(): Promise<StudentBySpecialization[]> {
    const results = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.specialization', 'specialization')
      .select('student.specializationId', 'specializationId')
      .addSelect('specialization.name', 'specializationName')
      .addSelect('COUNT(*)', 'studentCount')
      .groupBy('student.specializationId')
      .addGroupBy('specialization.name')
      .getRawMany();

    return results.map((result) => ({
      specializationId: result.specializationId,
      specializationName: result.specializationName,
      studentCount: parseInt(result.studentCount, 10),
    }));
  }

  async getStudentCountsByDepartmentWithUniversity(): Promise<
    DepartmentWithUniversityCount[]
  > {
    const results = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.department', 'department')
      .leftJoinAndSelect('department.university', 'university')
      .select('department.id', 'departmentId')
      .addSelect('department.name', 'departmentName')
      .addSelect('university.name', 'universityName')
      .addSelect('COUNT(*)', 'studentCount')
      .groupBy('department.id, department.name, university.name')
      .getRawMany();

    return results.map((result) => ({
      departmentId: result.departmentId,
      departmentName: result.departmentName,
      universityName: result.universityName,
      studentCount: parseInt(result.studentCount, 10),
    }));
  }
  async getSpecializationWithDeptAndUniversityCounts(): Promise<
    SpecializationWithDeptAndUniversityCount[]
  > {
    const results = await this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.specialization', 'specialization')
      .leftJoinAndSelect('student.department', 'department')
      .leftJoinAndSelect('department.university', 'university')
      .select('specialization.id', 'specializationId')
      .addSelect('specialization.name', 'specializationName')
      .addSelect('department.name', 'departmentName')
      .addSelect('university.name', 'universityName')
      .addSelect('COUNT(*)', 'studentCount')
      .groupBy(
        'specialization.id, specialization.name, department.name, university.name',
      )
      .getRawMany();

    return results.map((result) => ({
      specializationId: result.specializationId,
      specializationName: result.specializationName,
      departmentName: result.departmentName,
      universityName: result.universityName,
      studentCount: parseInt(result.studentCount, 10),
    }));
  }
}
