// src/db.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { Department } from './entities/department.entity';
import { Specialization } from './entities/specialization.entity';
import { Student } from './entities/student.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'najma',
  database: process.env.POSTGRES_DB || 'another',
  entities: [University, Department, Specialization, Student],
  synchronize: true,
};
