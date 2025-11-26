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
import { TacheService } from './tache.service';
import {
  CreateTacheDto,
  UpdateTacheDto,
  TacheResponseDto,
} from '../dto/tache.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('taches')
@UseGuards(JwtAuthGuard)
export class TacheController {
  constructor(private readonly tacheService: TacheService) {}

  @Post()
  create(
    @Body() createTacheDto: CreateTacheDto,
    @Request() req: RequestWithUser,
  ): Promise<TacheResponseDto> {
    return this.tacheService.create(createTacheDto, req.user.mailEmploye);
  }

  @Get()
  findAll(@Request() req: RequestWithUser): Promise<TacheResponseDto[]> {
    return this.tacheService.findAll(req.user.mailEmploye, req.user.estAdmin);
  }

  @Get('liste/:idListe')
  getTachesByListe(
    @Param('idListe', ParseIntPipe) idListe: number,
    @Request() req: RequestWithUser,
  ): Promise<TacheResponseDto[]> {
    return this.tacheService.getTachesByListe(
      idListe,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<TacheResponseDto> {
    return this.tacheService.findOne(
      id,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTacheDto: UpdateTacheDto,
    @Request() req: RequestWithUser,
  ): Promise<TacheResponseDto> {
    return this.tacheService.update(
      id,
      updateTacheDto,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Patch(':id/toggle')
  toggleTacheEtat(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<TacheResponseDto> {
    return this.tacheService.toggleTacheEtat(
      id,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    return this.tacheService.remove(
      id,
      req.user.mailEmploye,
      req.user.estAdmin,
    );
  }
}
