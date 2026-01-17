import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  createArticle() {
    return 'Create Article';
  }
  findAllArticles() {
    return 'Find All Articles';
  }
}
