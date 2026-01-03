import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  // Define your endpoints and methods here
  constructor(private readonly tagService: TagService) {}
  @Get()
  findAll(): { tags: string[] } {
    return { tags: this.tagService.findAll() };
  }
}
