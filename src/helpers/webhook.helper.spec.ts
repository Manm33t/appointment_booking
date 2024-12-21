import { Test, TestingModule } from '@nestjs/testing';
import { WebHookHelper } from './webhook.helper'; // Adjust import according to your file structure
import { Patient } from '../schemas/patient.schema';
import { Appointment } from '../schemas/appointment.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CheckPatientDto, CreatePatientDto } from 'src/dto/webhook.dto';

describe('WebHookHelper', () => {
  let webhookHelper: WebHookHelper;
  let patientModel: Model<Patient>;
  let appointmentModel: Model<Appointment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebHookHelper,
        {
          provide: getModelToken(Patient.name),
          useValue: {
            findOne: jest.fn(), // Mock findOne method
            save: jest.fn(), // Mock save method
          },
        },
        {
          provide: getModelToken(Appointment.name),
          useValue: {
            save: jest.fn(), // Mock save method for Appointment
          },
        },
      ],
    }).compile();

    webhookHelper = module.get<WebHookHelper>(WebHookHelper);
    patientModel = module.get<Model<Patient>>(getModelToken(Patient.name));
    appointmentModel = module.get<Model<Appointment>>(
      getModelToken(Appointment.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const formattedDate = webhookHelper['formatDate']('5-7-2024');
      expect(formattedDate).toBe('05-07-2024');
    });

    it('should throw an error if date format is invalid', () => {
      expect(() => webhookHelper['formatDate']('5/7/2024')).toThrow(
        'Invalid date format. Expected format: DD-MM-YYYY',
      );
    });
  });

  describe('appointmentTimeToTimestamp', () => {
    it('should return the correct timestamp from appointment time', () => {
      const appointmentTime = {
        year: 2024,
        month: 12,
        day: 25,
        hours: 10,
        minutes: 30,
        seconds: 0,
        nanos: 0,
      };
      const timestamp =
        webhookHelper['appointmentTimeToTimestamp'](appointmentTime);
      const expectedTimestamp = new Date(2024, 11, 25, 10, 30, 0, 0);
      expect(timestamp).toEqual(expectedTimestamp);
    });
  });

  describe('checkPatientExistsOrNot', () => {
    it('should return a patient if found', async () => {
      const mockPatient = { _id: 'patientId', mobileNumber: '1234567890' };
      jest.spyOn(patientModel, 'findOne').mockResolvedValue(mockPatient);

      const body: CheckPatientDto = { mobileNumber: '1234567890' };
      const patient = await webhookHelper.checkPatientExistsOrNot(body);

      expect(patient).toEqual(mockPatient);
      expect(patientModel.findOne).toHaveBeenCalledWith({
        mobileNumber: '1234567890',
      });
    });

    it('should return null if patient is not found', async () => {
      jest.spyOn(patientModel, 'findOne').mockResolvedValue(null);

      const body: CheckPatientDto = { mobileNumber: '1234567890' };
      const patient = await webhookHelper.checkPatientExistsOrNot(body);

      expect(patient).toBeNull();
      expect(patientModel.findOne).toHaveBeenCalledWith({
        mobileNumber: '1234567890',
      });
    });
  });

  describe('createAppointment', () => {
    it('should create a new patient and appointment if patient does not exist', async () => {
      const mockPatient = {
        _id: 'newPatientId',
        save: jest.fn().mockResolvedValue({ _id: 'newPatientId' }),
      };
      const mockAppointment = {
        _id: 'newAppointmentId',
        save: jest.fn().mockResolvedValue({ _id: 'newAppointmentId' }),
      };

      // Mock the behavior of checkPatientExistsOrNot to simulate patient not found
      webhookHelper.checkPatientExistsOrNot = jest.fn().mockResolvedValue(null); // Simulating patient does not exist
      (webhookHelper as any).createPatient = jest
        .fn()
        .mockResolvedValue(mockPatient); // Simulating patient creation

      // Mock the saving of the appointment
      (webhookHelper as any).createAnAppointment = jest
        .fn()
        .mockResolvedValue(mockAppointment); // Simulate appointment creation

      const body: CreatePatientDto = {
        session: {
          phonenumber: '1234567890',
          firstname: { original: 'John' },
          lastname: { original: 'Doe' },
          dob: { month: 5, day: 12, year: 1990 },
          insurance: 'XYZ Health',
          insuranceId: 'INS123',
          appointmenttype: 'Checkup',
          appointmenttime: {
            year: 2024,
            month: 12,
            day: 20,
            hours: 9,
            minutes: 30,
            seconds: 0,
            nanos: 0,
          },
        },
      };

      // Call the method
      const result = await webhookHelper.createAppointment(body);

      // Expectations
      expect(result).toBe('newAppointmentId'.slice(-4)); // The ID should be the last 4 characters of appointment ID
      expect(webhookHelper.checkPatientExistsOrNot).toHaveBeenCalledWith({
        mobileNumber: '1234567890',
      });
      expect((webhookHelper as any).createPatient).toHaveBeenCalledWith({
        firstName: 'john',
        lastName: 'doe',
        mobileNumber: '1234567890',
        birthDate: '05-12-1990', // formatted date
        insuranceCompany: 'XYZ Health',
        insuranceId: 'INS123',
      });
      expect((webhookHelper as any).createAnAppointment).toHaveBeenCalledWith({
        patientID: 'newPatientId', // patient ID from the created patient
        appointmentType: 'Checkup',
        appointmentTime: new Date('2024-12-20T04:00:00.000Z'), // It should be a timestamp
      });
    });

    it('should use existing patient and create appointment if patient exists', async () => {
      const mockPatient = {
        _id: 'existingPatientId',
        save: jest.fn().mockResolvedValue({ _id: 'existingPatientId' }),
      };
      const mockAppointment = {
        _id: 'newAppointmentId',
        save: jest.fn().mockResolvedValue({ _id: 'newAppointmentId' }),
      };

      // Mock the behavior of checkPatientExistsOrNot to simulate patient found
      webhookHelper.checkPatientExistsOrNot = jest
        .fn()
        .mockResolvedValue(mockPatient); // Simulating patient exists

      // Mock the saving of the appointment
      (webhookHelper as any).createAnAppointment = jest
        .fn()
        .mockResolvedValue(mockAppointment); // Simulate appointment creation

      const body: CreatePatientDto = {
        session: {
          phonenumber: '1234567890',
          firstname: { original: 'John' },
          lastname: { original: 'Doe' },
          dob: { month: 5, day: 12, year: 1990 },
          insurance: 'XYZ Health',
          insuranceId: 'INS123',
          appointmenttype: 'Checkup',
          appointmenttime: {
            year: 2024,
            month: 12,
            day: 20,
            hours: 9,
            minutes: 30,
            seconds: 1,
            nanos: 1,
          },
        },
      };

      // Call the method
      const result = await webhookHelper.createAppointment(body);

      // Expectations
      expect(result).toBe('newAppointmentId'.slice(-4)); // The ID should be the last 4 characters of appointment ID
      expect(webhookHelper.checkPatientExistsOrNot).toHaveBeenCalledWith({
        mobileNumber: '1234567890',
      });
      expect((webhookHelper as any).createAnAppointment).toHaveBeenCalledWith({
        patientID: 'existingPatientId', // patient ID from the found patient
        appointmentType: 'Checkup',
        appointmentTime: new Date('2024-12-20T04:00:01.001Z'), // It should be a timestamp
      });
    });
  });
});
