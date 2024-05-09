import { Client } from '../entities/client.entity';

export class SignUpDetailsResponseDto {
  client: Client;
  company: string;
}
