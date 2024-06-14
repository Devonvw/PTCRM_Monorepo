import { EnumRoles } from 'src/types/roles.enums';

export class UserResponseDto {
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  role: EnumRoles;
  company: string;
}
