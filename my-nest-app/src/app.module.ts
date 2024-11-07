import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { University } from './entities/university.entity';
import { Department } from './entities/department.entity';
import { Specialization } from './entities/specialization.entity';
import { Student } from './entities/student.entity';

import { UniversityService } from './services/university.service';
import { DepartmentService } from './services/department.service';
import { SpecializationService } from './services/specialization.service';
import { StudentService } from './services/student.service';
import { ChartService } from './services/chart.service';

import { UniversityResolver } from './resolvers/university.resolver';
import { DepartmentResolver } from './resolvers/department.resolver';
import { SpecializationResolver } from './resolvers/specialization.resolver';
import { StudentResolver } from './resolvers/student.resolver';
import { ChartResolver } from './resolvers/chart.resolver';

import { typeOrmConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([University, Department, Specialization, Student]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
  ],
  providers: [
    UniversityService,
    DepartmentService,
    SpecializationService,
    StudentService,
    ChartService,
    UniversityResolver,
    DepartmentResolver,
    SpecializationResolver,
    StudentResolver,
    ChartResolver,
  ],
})
export class AppModule {}
