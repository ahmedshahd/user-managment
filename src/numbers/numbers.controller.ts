import { Controller, Get, Param } from '@nestjs/common';
import { NumbersService } from './numbers.service';
import { Public } from 'src/auth/common/decorators';


@Public()
@Controller('numbers')
export class NumbersController {
  constructor(private numbersService: NumbersService) {}
  @Get(':start/:end')
  getNumbersCountWithoutFive(
    @Param('start') start: number,
    @Param('end') end: number,
  ) {
    return this.numbersService.getNumbersCountWithoutFive(start, end);
  }
}
