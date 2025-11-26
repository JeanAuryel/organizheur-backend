import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeService } from './liste.service';
import { ListeController } from './liste.controller';
import { Liste } from '../entities/liste.entity';
import { Employe } from '../entities/employe.entity';
import { Categorie } from '../entities/categorie.entity';
import { Tache } from '../entities/tache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Liste, Employe, Categorie, Tache])],
  controllers: [ListeController],
  providers: [ListeService],
  exports: [ListeService],
})
export class ListeModule {}
