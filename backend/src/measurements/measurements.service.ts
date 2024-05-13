import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from './entities/measurement.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateMeasurementDto } from './dtos/UpdateMeasurementDto';
import { GetMeasurementsQueryDto } from './dtos/GetMeasurementsQueryDto';
import Pagination from 'src/utils/pagination';
import OrderBy from 'src/utils/order-by';
import Filters from 'src/utils/filter';

@Injectable()
export class MeasurementsService {
  constructor(@InjectRepository(Measurement) private measurementRepository: Repository<Measurement>) { }

  async update(userId: number, id: number, body: UpdateMeasurementDto): Promise<any> {
    const measurement = await this.measurementExistsAndBelongsToUser(id, userId);

    measurement.value = body.value;
    return await this.measurementRepository.update(id, measurement);
  }

  async delete(userId: number, id: number): Promise<any> {
    const measurement = await this.measurementExistsAndBelongsToUser(id, userId);

    await this.measurementRepository.delete({ id: measurement.id });
    return { message: 'Measurement deleted' };
  }

  async findAll(userId: number, query: GetMeasurementsQueryDto): Promise<any> {
    const pagination = Pagination(query);
    const orderBy = OrderBy(query, [
      {
        key: 'createdAt',
        fields: ['createdAt'],
      }
    ]);

    //. Get the filters for the query
    const filters = await this.getFilters(query);

    const measurements = await this.measurementRepository.find({
      ...pagination,
      where: [...filters],
      order: orderBy
    });

    const totalRows = await this.measurementRepository.count({
      where: [...filters]
    });

    return { data: measurements, totalRows };
  }
  async getFilters(query: GetMeasurementsQueryDto): Promise<any> {
    const filters = Filters(null, [
      {
        condition: !!query.assessmentId,
        filter: {
          assessment: { id: query.assessmentId }
        }
      },
      {
        condition: !!query.clientId,
        filter: {
          clientGoal: { client: { id: query.clientId } }
        }
      },
      {
        condition: !!query.clientGoalId,
        filter: {
          clientGoal: { id: query.clientGoalId }
        }
      },
      {
        condition: !!query.fromDate,
        filter: {
          performedAt: MoreThanOrEqual(query.fromDate)
        }
      },
      {
        condition: !!query.tillDate,
        filter: {
          performedAt: LessThanOrEqual(query.tillDate)
        }
      }
    ]);

    return filters;
  }
  async findOne(userId: number, id: number): Promise<any> {
    return await this.measurementExistsAndBelongsToUser(id, userId);
  }

  async measurementExistsAndBelongsToUser(measurementId: number, userId: number): Promise<any> {
    const measurement = await this.measurementRepository.findOne({
      where: {
        id: measurementId,
        clientGoal: { client: { user: { id: userId } } }
      }
    });

    if (!measurement) {
      throw new NotFoundException('This measurement does not exist or does not belong to you.');
    }

    return measurement;
  }
}
