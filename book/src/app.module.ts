import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { MembersAndBooksModule } from './members-and-books/members-and-books.module';
import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');
        console.log('db: ', db);
        return configService.get('database');
      },
    }),
    BooksModule,
    MembersModule,
    MembersAndBooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
