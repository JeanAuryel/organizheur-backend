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
  ForbiddenException,
} from '@nestjs/common';
import { EmployeService } from './employe.service';
import {
  CreateEmployeDto,
  UpdateEmployeDto,
  EmployeResponseDto,
} from '../dto/employe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('employes')
@UseGuards(JwtAuthGuard)
export class EmployeController {
  constructor(private readonly employeService: EmployeService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(
    @Body() createEmployeDto: CreateEmployeDto,
  ): Promise<EmployeResponseDto> {
    return this.employeService.create(createEmployeDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(): Promise<EmployeResponseDto[]> {
    return this.employeService.findAll();
  }

  @Get('me')
  async getProfile(
    @Request() req: RequestWithUser,
  ): Promise<EmployeResponseDto> {
    return this.employeService.findOne(req.user.mailEmploye);
  }

  @Get('categorie/:idCategorie')
  async findByCategorie(
    @Param('idCategorie') idCategorie: string,
    @Request() req: RequestWithUser,
  ): Promise<EmployeResponseDto[]> {
    const user = req.user;

    if (!user.estAdmin && user.idCategorie !== +idCategorie) {
      throw new ForbiddenException(
        'Vous ne pouvez voir que les employés de votre catégorie',
      );
    }

    return this.employeService.findByCategorie(+idCategorie);
  }

  @Get(':mailEmploye')
  async findOne(
    @Param('mailEmploye') mailEmploye: string,
    @Request() req: RequestWithUser,
  ): Promise<EmployeResponseDto> {
    const user = req.user;

    if (!user.estAdmin && user.mailEmploye !== mailEmploye) {
      throw new ForbiddenException('Accès non autorisé');
    }

    return this.employeService.findOne(mailEmploye);
  }

  @Patch(':mailEmploye')
  async update(
    @Param('mailEmploye') mailEmploye: string,
    @Body() updateEmployeDto: UpdateEmployeDto,
    @Request() req: RequestWithUser,
  ): Promise<EmployeResponseDto> {
    const user = req.user;

    if (!user.estAdmin && user.mailEmploye !== mailEmploye) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre profil');
    }

    if (!user.estAdmin && updateEmployeDto.estAdmin !== undefined) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier le statut administrateur',
      );
    }

    if (!user.estAdmin && updateEmployeDto.categoriesGerees !== undefined) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier les catégories gérées',
      );
    }

    return this.employeService.update(mailEmploye, updateEmployeDto);
  }

  @Delete(':mailEmploye')
  @UseGuards(AdminGuard)
  async remove(@Param('mailEmploye') mailEmploye: string): Promise<void> {
    return this.employeService.remove(mailEmploye);
  }
}
