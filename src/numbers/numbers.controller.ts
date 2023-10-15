import { Controller, Get, Param } from '@nestjs/common';
import { NumbersService } from './numbers.service';
import { Public } from 'src/auth/common/decorators';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@Public()
@ApiTags('numbers') 
@Controller('numbers')
export class NumbersController {
  constructor(private numbersService: NumbersService) {}
  @Get(':start/:end')
  @ApiOperation({ summary: 'Get the count of numbers without the digit 5' })
  @ApiResponse({ status: 200, description: 'The count of numbers without the digit 5' })
  @ApiParam({ name: 'start', type: Number, description: 'The start of the number range' })
  @ApiParam({ name: 'end', type: Number, description: 'The end of the number range' })
  getNumbersCountWithoutFive(
    @Param('start') start: number,
    @Param('end') end: number,
  ) {
    return this.numbersService.getNumbersCountWithoutFive(start, end);
  }
}
