import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Appointment } from '../schemas/appointment.schema';
import { Patient } from '../schemas/patient.schema';
import { CheckPatientDto, CreatePatientDto } from 'src/dto/webhook.dto';

@Injectable()
export class WebHookHelper {
  /**
   * Importing  models here to query in collection
   */
  @InjectModel(Patient.name) private patientModel: Model<Patient>;
  @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>;

  /**
   * Function to format date which is coming from webhook to a string with
   * format DD-MM-YYYY and pad 0 in from of date and month incase month/date<10
   * @param dateString
   * @returns
   */
  private formatDate(dateString: string): string {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected format: DD-MM-YYYY');
    }

    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];

    return `${day}-${month}-${year}`;
  }

  private appointmentTimeToTimestamp(appointmentTime: {
    year?: number;
    month?: number;
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    nanos?: number;
  }): Date {
    const now = new Date();

    const year = appointmentTime?.year ?? now.getFullYear();
    const month = appointmentTime?.month
      ? appointmentTime?.month - 1
      : now.getMonth();
    const day = appointmentTime?.day ?? now.getDate();
    const hours = appointmentTime?.hours ?? now.getHours();
    const minutes = appointmentTime?.minutes ?? now.getMinutes();
    const seconds = appointmentTime?.seconds ?? now.getSeconds();
    const nanos = appointmentTime?.nanos ?? 0;

    const date = new Date(year, month, day, hours, minutes, seconds, nanos);

    return date;
  }

  /**
   * Function which will check patient exists in patient collection or not
   * @param body
   * @returns
   */
  async checkPatientExistsOrNot(body: CheckPatientDto): Promise<Patient> {
    const user = await this.patientModel.findOne({
      mobileNumber: body.mobileNumber,
    });

    return user;
  }

  private async createPatient(user: Partial<Patient>): Promise<Patient> {
    const patient = new this.patientModel(user);
    return patient.save();
  }

  private async createAnAppointment(
    app: Partial<Appointment>,
  ): Promise<Appointment> {
    const appointment = new this.appointmentModel(app);
    return appointment.save();
  }

  async createAppointment(body: CreatePatientDto): Promise<string> {
    let user: any = await this.checkPatientExistsOrNot({
      mobileNumber: body?.session?.phonenumber as string,
    });
    // If patient doesn't exists  create patient first and then create an appointment
    if (!user) {
      user = await this.createPatient({
        firstName: body?.session?.firstname?.original?.toLowerCase(),
        lastName: body?.session?.lastname?.original?.toLowerCase(),
        mobileNumber: body?.session?.phonenumber,
        birthDate: this.formatDate(
          `${body?.session?.dob?.month}-${body?.session?.dob?.day}-${body?.session?.dob?.year}`,
        ),
        insuranceCompany: body?.session?.insurance,
        insuranceId: body?.session?.insuranceid,
      });
    }
    const appointment = await this.createAnAppointment({
      patientID: user._id,
      appointmentType: body?.session?.appointmenttype,
      appointmentTime: this.appointmentTimeToTimestamp(
        body?.session?.appointmenttime,
      ),
    });
    const id = String(appointment?._id);

    return id?.substring(id?.length - 4);
  }
}
