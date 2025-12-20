import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EventType } from 'src/enums/event.enum';

export class CreateEventDto {
  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsMongoId()
  productId?: string;

  @IsOptional()
  @IsMongoId()
  orderId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  qty?: number;

  @IsOptional()
  payload?: Record<string, unknown>;
}
