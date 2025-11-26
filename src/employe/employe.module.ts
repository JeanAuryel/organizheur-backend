import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';
import { Employe } from '../entities/employe.entity';
import { Categorie } from '../entities/categorie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employe, Categorie])],
  controllers: [EmployeController],
  providers: [EmployeService],
  exports: [EmployeService],
})
export class EmployeModule {}
