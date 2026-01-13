import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { EventType } from 'src/enums/event.enum';

export class CreateEventDto {
  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsMongoId()
  productId?: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  orderId?: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @Min(1)
  qty?: number;

  @IsOptional()
  payload?: Record<string, unknown>;
}
