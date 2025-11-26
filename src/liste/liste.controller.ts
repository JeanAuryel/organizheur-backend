import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ListeService } from './liste.service';
import {
  CreateListeDto,
  UpdateListeDto,
  ListeResponseDto,
} from '../dto/liste.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('listes')
@UseGuards(JwtAuthGuard)
export class ListeController {
  constructor(private readonly listeService: ListeService) {}

  @Post()
  create(
    @Body() createListeDto: CreateListeDto,
    @Request() req: RequestWithUser,
  ): Promise<ListeResponseDto> {
    return this.listeService.create(createListeDto, req.user.mailEmploye);
  }

  @Get()
  findAll(@Request() req: RequestWithUser): Promise<ListeResponseDto[]> {
    return this.listeService.findAll(req.user.mailEmploye, req.user.estAdmin);
  }

  @Get('personnelles')
  getListesPersonnelles(
    @Request() req: RequestWithUser,
  ): Promise<ListeResponseDto[]> {
    return this.listeService.getListesPersonnelles(req.user.mailEmploye);
  }

  @Get('categorie/:idCategorie')
  getListesByCategorie(
    @Param('idCategorie', ParseIntPipe) idCategorie: number,
    @Request() req: RequestWithUser,
  ): Promise<ListeResponseDto[]> {
    return this.listeService.getListesByCategorie(
      idCategorie,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ListeResponseDto> {
    return this.listeService.findOne(
      id,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListeDto: UpdateListeDto,
    @Request() req: RequestWithUser,
  ): Promise<ListeResponseDto> {
    return this.listeService.update(
      id,
      updateListeDto,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    return this.listeService.remove(
      id,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }
}
