import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticleDto';
import { ArticleEntity } from './article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  createArticle(
    currentUser: UserEntity,
    articleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, articleDto);
    article.author = currentUser;
    if (article.tagList == null) {
      article.tagList = [];
    }
    article.slug = 'foo slug'; // TODO: generate slug
    return this.articleRepository.save(article);
  }

  findAllArticles() {
    return 'Find All Articles';
  }
}
