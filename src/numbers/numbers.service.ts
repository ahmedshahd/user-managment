import { Injectable } from '@nestjs/common';

@Injectable()
export class NumbersService {
  getNumbersCountWithoutFive(start: number, end: number) { 
   let count = 0;
    for (let num = start; num <= end; num++) {
      if (!this.hasFive(num)) {
        count = Number(count) + Number(num);
      }
    }
    return { result: count };
  }

  private hasFive(num: number): boolean {
    // Helper function to check if a number contains '5'.
    return /5/.test(num.toString());
    // return !Number.toString().includes('5');
  }
}
