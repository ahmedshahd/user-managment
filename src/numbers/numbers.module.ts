import { Module } from '@nestjs/common';
import { NumbersService } from './numbers.service';
import { NumbersController } from './numbers.controller';

@Module({
  controllers: [NumbersController],
  providers: [NumbersService]
})
export class NumbersModule {}
