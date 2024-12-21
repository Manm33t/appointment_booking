import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CheckPatientDto,
  CreatePatientDto,
  SessionInfo,
} from './dto/webhook.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/check-patient')
  async checkPatientExistsOrNot(
    @Body() body: CheckPatientDto,
  ): Promise<SessionInfo> {
    return this.appService.checkPatientExistsOrNot(body);
  }

  @Post('/create-appointment')
  async createAppointment(
    @Body() body: CreatePatientDto,
  ): Promise<SessionInfo> {
    return this.appService.createAppointment(body);
  }
}
