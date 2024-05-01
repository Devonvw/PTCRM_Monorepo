import { EnumRoles } from "src/enums/roles.enums";
import { User } from "../entities/user.entity";

export class UserResponseDto {
  constructor (user: User){
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.dateOfBirth = user.dateOfBirth;
    this.role = user.role;
  }
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  role: EnumRoles;
}