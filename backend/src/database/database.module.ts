import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

interface DatabaseConfig {
  type: 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'oracle' | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        switch (process.env.NODE_ENV) {
          case 'staging':
            return {
              ...configService.get<DatabaseConfig>('database.staging'),
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              autoLoadEntities: true,
            };
          case 'production':
            return {
              ...configService.get<DatabaseConfig>('database.production'),
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              autoLoadEntities: true,
            };
          default:
            return {
              ...configService.get<DatabaseConfig>('database.local'),
              autoLoadEntities: true,
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              synchronize: true, //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
            };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
