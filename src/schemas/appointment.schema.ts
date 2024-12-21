import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientID: Types.ObjectId;

  @Prop({ required: true })
  appointmentType: string;

  @Prop({ required: true })
  appointmentTime: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
