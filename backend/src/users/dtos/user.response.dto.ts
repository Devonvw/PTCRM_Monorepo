import { User } from "../entities/user.entity";

export class UserResponseDto {
  constructor (user: User){
    this.id = user.id;
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.dateOfBirth = user.dateOfBirth;
  }
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
}