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

// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { config } from 'dotenv';
// import { join } from 'path';

// config();

// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   url: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   autoLoadEntities: true,
//   entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')],
//   synchronize: true, // set to false in production
// };
