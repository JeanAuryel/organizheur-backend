import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategorieService } from './categorie.service';
import {
  CreateCategorieDto,
  UpdateCategorieDto,
  CategorieResponseDto,
} from '../dto/categorie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(
    @Body() createCategorieDto: CreateCategorieDto,
  ): Promise<CategorieResponseDto> {
    return this.categorieService.create(createCategorieDto);
  }

  @Get()
  findAll(): Promise<CategorieResponseDto[]> {
    return this.categorieService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategorieResponseDto> {
    return this.categorieService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategorieDto: UpdateCategorieDto,
  ): Promise<CategorieResponseDto> {
    return this.categorieService.update(id, updateCategorieDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categorieService.remove(id);
  }
}
