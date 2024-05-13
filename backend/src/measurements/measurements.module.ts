import { Module } from '@nestjs/common';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './entities/measurement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement])],
  controllers: [MeasurementsController],
  providers: [MeasurementsService]
})
export class MeasurementsModule {}
