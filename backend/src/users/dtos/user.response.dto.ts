import { User } from "../entities/user.entity";

export class UserResponseDto {
  constructor (user: User){
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.dateOfBirth = user.dateOfBirth;
  }
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
}