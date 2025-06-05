import {
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExportTaskDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Type(() => Number)
  integrationId: number;

  @IsString()
  @IsIn(['mentions', 'posts'])
  dataType: 'mentions' | 'posts';

  @IsString()
  @IsIn(['csv', 'json'])
  format: 'csv' | 'json';

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  providerId?: number;

  @IsBoolean()
  @IsOptional()
  includeAspectAnalyses?: boolean;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
