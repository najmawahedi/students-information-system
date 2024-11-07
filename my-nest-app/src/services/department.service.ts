import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { University } from '../entities/university.entity';
import { Specialization } from '../entities/specialization.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(University)
    private universityRepository: Repository<University>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ['university', 'specializations', 'students'],
    });
  }

  findOne(id: number): Promise<Department | null> {
    return this.departmentRepository.findOne({
      where: { id },
      relations: ['university', 'specializations', 'students'],
    });
  }

  async create(name: string, universityId: number): Promise<Department> {
    const university = await this.universityRepository.findOne({
      where: { id: universityId },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    const department = this.departmentRepository.create({ name, university });
    return this.departmentRepository.save(department);
  }

  findByUniversity(universityId?: number): Promise<Department[]> {
    if (universityId) {
      return this.departmentRepository.find({
        where: { university: { id: universityId } },
        relations: ['university', 'specializations', 'students'],
        order: { id: 'ASC' },
      });
    }
    return this.findAll();
  }

  async edit(id: number, name: string): Promise<Department> {
    const department = await this.findOne(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    department.name = name;
    return this.departmentRepository.save(department);
  }

  async delete(id: number): Promise<boolean> {
    const department = await this.findOne(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    await this.studentRepository.delete({ department: { id } });
    await this.specializationRepository.delete({ department: { id } });

    await this.departmentRepository.remove(department);
    return true;
  }
}
