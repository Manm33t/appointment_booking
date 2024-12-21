import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Patient extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop()
  insuranceCompany?: string;
  @Prop()
  insuranceId?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
