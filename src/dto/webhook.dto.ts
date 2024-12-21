import { IsNotEmptyObject, IsString } from 'class-validator';

export class CheckPatientDto {
  @IsString()
  mobileNumber: string;
}
type Parameters = {
  parameters: {
    [key: string]: string | Object;
  };
};

export type SessionInfo = {
  sessionInfo: Parameters;
};

export class CreatePatientDto {
  @IsNotEmptyObject()
  session: {
    [key: string]: string | any;
  };
}
