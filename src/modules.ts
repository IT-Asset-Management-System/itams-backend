import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AssetModule } from './modules/asset/asset.module';
import { CategoryModule } from './modules/category/category.module';
import { AdminModule } from './modules/admin/admin.module';
import { ManufacturerModule } from './modules/manufacturer/manufacturer.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StatusModule } from './modules/status/status.module';
import { LocationModule } from './modules/location/location.module';
import { DepartmentModule } from './modules/department/department.module';
import { LicenseModule } from './modules/license/license.module';
import { SourceCodeModule } from './modules/sourceCode/sourceCode.module';

export const Modules = [
  ConfigModule.forRoot({}),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname + '/models/entities/**/*{.ts,.js}'],
    synchronize: true,
  }),
  BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
  }),
  AuthModule,
  UsersModule,
  AdminModule,
  AssetModule,
  CategoryModule,
  ManufacturerModule,
  SupplierModule,
  StatusModule,
  LocationModule,
  DepartmentModule,
  LicenseModule,
  SourceCodeModule,
];
