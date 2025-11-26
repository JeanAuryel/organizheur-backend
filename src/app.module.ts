import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategorieModule } from './categorie/categorie.module';
import { EmployeModule } from './employe/employe.module';
import { ListeModule } from './liste/liste.module';
import { TacheModule } from './tache/tache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // IMPORTANT: false en production, utiliser les migrations
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    CategorieModule,
    EmployeModule,
    ListeModule,
    TacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
