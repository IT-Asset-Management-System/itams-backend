import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRepositoryModule } from './modules/githubRepository/githubRepository.module';

export const Modules = [
  ConfigModule.forRoot({}),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname + '/model/entities/**/*{.ts,.js}'],
    synchronize: true,
  }),
  GithubRepositoryModule,
];
