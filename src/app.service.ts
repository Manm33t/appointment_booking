import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './schemas/patient.schema';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}
  async getHello(): Promise<any> {
    return this.patientModel.find();
  }

  async createPatient(data: any): Promise<void> {
    const patient = new this.patientModel({ ...data });
    await patient.save();
  }

  async processRequest(body: any): Promise<any> {
    console.log(body, 'body');
    return;
    const parameters = body.sessionInfo.parameters;
    const { firstName, lastName, birthdate, appointmentType, insuranceInfo } =
      parameters;

    // Check if the patient exists
    let patient = await this.patientModel.findOne({
      firstName,
      lastName,
      birthdate,
    });
    if (!patient) {
      // Create a new patient
      patient = new this.patientModel({
        firstName,
        lastName,
        birthdate,
        insuranceInfo,
      });
      await patient.save();
    }

    // Create a new appointment
    const appointment = new this.appointmentModel({
      patientId: patient._id,
      appointmentType,
      appointmentTimeSlot: parameters.appointmentTimeSlot,
    });
    await appointment.save();

    // Return response to Dialogflow
    return {
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [`Your appointment has been booked successfully.`],
            },
          },
        ],
      },
    };
  }
}
