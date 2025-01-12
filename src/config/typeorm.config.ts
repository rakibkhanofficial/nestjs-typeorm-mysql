import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'nestjs_user',
  password: 'Rakib@123',
  database: 'nestjs_typeorm_mysql',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
};
