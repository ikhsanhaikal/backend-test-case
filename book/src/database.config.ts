import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', () => {
  const dataSourceOptions: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    entities: ['dist/**/*.entity.js'],
    // migrations: ['dist/migrations/*.js'],
    dropSchema: true,
    synchronize: true,
  };
  return dataSourceOptions;
});

//const dataSource = new DataSource(dataSourceOptions);
//
//export default dataSource;
