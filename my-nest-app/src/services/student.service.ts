import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Specialization } from '../entities/specialization.entity';
import { Department } from '../entities/department.entity';
import { University } from '../entities/university.entity';

interface CreateStudentInput {
  name: string;
  email: string;
  age: number;
  specializationId: number;
  departmentId: number;
  universityId: number;
}

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(University)
    private universityRepository: Repository<University>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      relations: ['specialization', 'department', 'university'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['specialization', 'department', 'university'],
    });
  }

  async findByUniversity(universityId: number): Promise<Student[]> {
    return this.studentRepository.find({
      where: { university: { id: universityId } },
      relations: ['specialization', 'department', 'university'],
    });
  }

  async findByDepartmentAndUniversity(
    universityId: number,
    departmentId: number,
  ): Promise<Student[]> {
    return this.studentRepository.find({
      where: {
        university: { id: universityId },
        department: { id: departmentId },
      },
      relations: ['specialization', 'department', 'university'],
    });
  }

  async findBySpecializationDepartmentAndUniversity(
    universityId: number,
    departmentId: number,
    specializationId: number,
  ): Promise<Student[]> {
    return this.studentRepository.find({
      where: {
        university: { id: universityId },
        department: { id: departmentId },
        specialization: { id: specializationId },
      },
      relations: ['specialization', 'department', 'university'],
    });
  }

  async create(studentData: CreateStudentInput): Promise<Student> {
    const specialization = await this.specializationRepository.findOne({
      where: { id: studentData.specializationId },
    });

    const department = await this.departmentRepository.findOne({
      where: { id: studentData.departmentId },
    });

    const university = await this.universityRepository.findOne({
      where: { id: studentData.universityId },
    });

    if (!specialization || !department || !university) {
      throw new Error('Specialization, department, or university not found');
    }

    const newStudent = this.studentRepository.create({
      name: studentData.name,
      email: studentData.email,
      age: studentData.age,
      specialization,
      department,
      university,
    });

    return this.studentRepository.save(newStudent);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.studentRepository.delete(id);
    return result.affected ? true : false;
  }
  async delete(id: number): Promise<boolean> {
    const result = await this.studentRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Student not found');
    }

    return result.affected !== 0;
  }
  async update(
    id: number,
    studentData: CreateStudentInput,
  ): Promise<Student | null> {
    const student = await this.findOne(id);
    if (!student) {
      throw new Error('Student not found');
    }

    const specialization = await this.specializationRepository.findOne({
      where: { id: studentData.specializationId },
    });

    const department = await this.departmentRepository.findOne({
      where: { id: studentData.departmentId },
    });

    const university = await this.universityRepository.findOne({
      where: { id: studentData.universityId },
    });

    if (!specialization || !department || !university) {
      throw new Error('Specialization, department, or university not found');
    }

    await this.studentRepository.update(id, {
      name: studentData.name,
      email: studentData.email,
      age: studentData.age,
      specialization,
      department,
      university,
    });

    return this.findOne(id);
  }
}
