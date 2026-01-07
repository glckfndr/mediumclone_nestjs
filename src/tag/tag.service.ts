import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  // Define your service methods here
  findAll(): string[] {
    return ['nestjs', 'typescript', 'backend', 'api', 'html'];
  }
}
