import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from '../entities/specialization.entity';
import { Department } from '../entities/department.entity';

@Injectable()
export class SpecializationService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Specialization[]> {
    return this.specializationRepository.find({
      relations: ['students'],
      order: { id: 'ASC' },
    });
  }

  findOne(id: number): Promise<Specialization | null> {
    return this.specializationRepository.findOne({
      where: { id },
      relations: ['students'],
    });
  }

  findOneWithStudents(id: number): Promise<Specialization | null> {
    return this.specializationRepository.findOne({
      where: { id },
      relations: ['students'],
    });
  }

  async create(name: string, departmentId: number): Promise<Specialization> {
    const department = await this.departmentRepository.findOneBy({
      id: departmentId,
    });

    if (!department) {
      throw new Error('Department not found');
    }

    const specialization = this.specializationRepository.create({
      name,
      department,
    });

    return this.specializationRepository.save(specialization);
  }
  async findByUniversity(universityId: number): Promise<Specialization[]> {
    return this.specializationRepository.find({
      relations: ['department', 'department.university'],
      where: {
        department: {
          university: {
            id: universityId,
          },
        },
      },
    });
  }

  async findByDepartment(departmentId: number): Promise<Specialization[]> {
    return this.specializationRepository.find({
      where: {
        department: {
          id: departmentId,
        },
      },
      relations: ['department'],
    });
  }
  async findByFilters(
    universityId?: number,
    departmentId?: number,
  ): Promise<Specialization[]> {
    const query = this.specializationRepository
      .createQueryBuilder('specialization')
      .leftJoinAndSelect('specialization.department', 'department')
      .leftJoinAndSelect('department.university', 'university');

    if (universityId) {
      query.andWhere('university.id = :universityId', { universityId });
    }

    if (departmentId) {
      query.andWhere('department.id = :departmentId', { departmentId });
    }

    return query.getMany();
  }
  async delete(id: number): Promise<void> {
    const result = await this.specializationRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Specialization not found');
    }
  }

  async update(id: number, name: string): Promise<Specialization | null> {
    await this.specializationRepository.update(id, { name });
    return this.findOne(id);
  }
}
