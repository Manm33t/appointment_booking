import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { WebHookHelper } from './helpers/webhook.helper';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: WebHookHelper,
          useValue: {
            checkPatientExistsOrNot: () => {},
            createAppointment: () => {},
          },
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "checkPatientExistsOrNot"', async () => {
      jest
        .spyOn((appService as any).webhookHelper, 'checkPatientExistsOrNot')
        .mockResolvedValue({
          firstName: 'singh',
        });
      expect(
        await appService.checkPatientExistsOrNot({
          mobileNumber: '123456789',
        }),
      ).toEqual({
        sessionInfo: {
          parameters: {
            patientexists: 'true',
            firstName: {
              name: 'singh',
              original: 'singh',
            },
          },
        },
      });
    });

    it('should return "createAppointment"', async () => {
      jest
        .spyOn((appService as any).webhookHelper, 'createAppointment')
        .mockResolvedValue('1234');
      expect(
        await appService.createAppointment({
          session: {
            mobileNumber: '1223343',
          },
        }),
      ).toEqual({
        sessionInfo: {
          parameters: {
            appointmentId: '1234',
          },
        },
      });
    });
  });
});
