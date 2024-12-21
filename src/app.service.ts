import { Inject, Injectable } from '@nestjs/common';
import { WebHookHelper } from './helpers/webhook.helper';
import {
  CheckPatientDto,
  CreatePatientDto,
  SessionInfo,
} from './dto/webhook.dto';

@Injectable()
export class AppService {
  //Injecting helpers here which will help service class
  constructor(@Inject() private readonly webhookHelper: WebHookHelper) {}

  async checkPatientExistsOrNot(body: CheckPatientDto): Promise<SessionInfo> {
    const user = await this.webhookHelper.checkPatientExistsOrNot(body);

    return {
      sessionInfo: {
        parameters: {
          patientexists: !!user ? 'true' : 'false',
          firstName: !!user
            ? { name: user?.firstName, original: user?.firstName }
            : null,
        },
      },
    };
  }

  async createAppointment(body: CreatePatientDto): Promise<SessionInfo> {
    const appointment = await this.webhookHelper.createAppointment(body);
    return {
      sessionInfo: {
        parameters: {
          appointmentId: appointment,
        },
      },
    };
  }
}
