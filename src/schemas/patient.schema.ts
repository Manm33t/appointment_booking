import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Patient extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  emailID: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop()
  insuranceInfo?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
