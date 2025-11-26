import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TacheService } from './tache.service';
import { TacheController } from './tache.controller';
import { Tache } from '../entities/tache.entity';
import { Liste } from '../entities/liste.entity';
import { Employe } from '../entities/employe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tache, Liste, Employe])],
  controllers: [TacheController],
  providers: [TacheService],
  exports: [TacheService],
})
export class TacheModule {}
