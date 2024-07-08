import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const parseValue = this.schema.parse(value);
      return parseValue;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Validation Failed ${error}`);
    }
  }
}
