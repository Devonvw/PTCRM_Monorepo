import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import Success from 'src/utils/success';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dtos/CreateAssessmentDto';
import { GetAssessmentsQueryDto } from './dtos/GetAssessmentsQueryDto';
import { UpdateAssessmentDto } from './dtos/UpdateAssessmentDto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}
  //. This endpoint is called when a coach initiates a new assessment for a client. It returns a list of measurements that need to be made for the assessment, it does not write anything to the database, as it is possible that the coach may cancel the assessment before it is completed.
  // @Get('initiate')
  // async initiate(@Req() request: Request, @Body() body: InitiateAssessmentDto) {
  //   const userId = request.user.id;
  //   return await this.assessmentsService.initiate(userId, body);
  // }

  @Get()
  async findAll(
    @Req() request: Request,
    @Query() query: GetAssessmentsQueryDto,
  ) {
    const userId = request.user.id;
    return await this.assessmentsService.findAll(userId, query);
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: number) {
    const userId = request.user.id;
    return await this.assessmentsService.findOne(userId, id);
  }

  //. This endpoint is called when a coach completes an assessment for a client. It writes the assessment (and its measurements) to the database.
  @Post('complete')
  async create(@Req() request: Request, @Body() body: CreateAssessmentDto) {
    const userId = request.user.id;
    const assessment = await this.assessmentsService.create(userId, body);
    return Success('Assessment created successfully', { assessment });
  }

  @Put(':id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() body: UpdateAssessmentDto,
  ) {
    const userId = request.user.id;
    const assessment = await this.assessmentsService.update(userId, id, body);
    return Success('Assessment updated successfully', { assessment });
  }

  @Delete(':id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const userId = request.user.id;
    const assessment = await this.assessmentsService.delete(userId, id);
    return Success('Assessment deleted successfully', { assessment });
  }
}
