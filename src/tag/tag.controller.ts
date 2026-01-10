import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  // Define your endpoints and methods here
  constructor(private readonly tagService: TagService) {}
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const data = await this.tagService.findAll();
    return { tags: data.map((el) => el.name) };
  }
}
