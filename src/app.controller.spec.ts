import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            checkPatientExistsOrNot: () => {},
            createAppointment: () => {},
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "checkPatientExistsOrNot"', async () => {
      jest
        .spyOn((appController as any).appService, 'checkPatientExistsOrNot')
        .mockResolvedValue({
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
      expect(
        await appController.checkPatientExistsOrNot({
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
        .spyOn((appController as any).appService, 'createAppointment')
        .mockResolvedValue({
          sessionInfo: {
            parameters: {
              appointmentId: '1234',
            },
          },
        });
      expect(
        await appController.createAppointment({
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
