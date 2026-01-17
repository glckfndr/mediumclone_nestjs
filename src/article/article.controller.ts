import { Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post()
  createArticle(): any {
    return this.articleService.createArticle();
  }

  @Get()
  findAll(): any {
    return this.articleService.findAllArticles();
  }
}
