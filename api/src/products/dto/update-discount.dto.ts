import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateDiscountDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsOptional()
  @IsDateString()
  discountUntil?: string;
}
