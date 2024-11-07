import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from '../entities/university.entity';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private universityRepository: Repository<University>,
  ) {}

  findAll(): Promise<University[]> {
    return this.universityRepository.find({
      relations: ['departments', 'students'],
      order: { id: 'ASC' },
    });
  }

  findOne(id: number): Promise<University | null> {
    return this.universityRepository.findOne({
      where: { id },
      relations: ['departments', 'students'],
    });
  }

  create(name: string): Promise<University> {
    const university = this.universityRepository.create({ name });
    return this.universityRepository.save(university);
  }
  async update(id: number, name: string): Promise<University> {
    const university = await this.universityRepository.findOne({
      where: { id },
    });
    if (!university) {
      throw new Error('University not found');
    }
    university.name = name;
    return this.universityRepository.save(university);
  }
  async delete(id: number): Promise<void> {
    const university = await this.universityRepository.findOne({
      where: { id },
    });
    if (!university) {
      throw new Error('University not found');
    }
    await this.universityRepository.remove(university);
  }
}
