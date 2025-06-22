import {
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateExportTaskDto {
  @IsString()
  userId: string;

  @IsNumber()
  integrationId: number;

  @IsString()
  @IsIn(['mentions', 'posts'])
  dataType: 'mentions' | 'posts';

  @IsString()
  @IsIn(['csv', 'json'])
  format: 'csv' | 'json';

  @IsNumber()
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
