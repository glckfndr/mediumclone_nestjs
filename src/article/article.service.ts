import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticleDto';
import { ArticleEntity } from '@app/article/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';
import { DeleteResult } from 'typeorm/browser';
import { UpdateArticleDto } from '@app/article/dto/updateArticleDto';

import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { FindAllArticlesQueryInterface } from './types/findAllArticles.query';

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
    article.slug = this.getSlug(articleDto.title);
    return this.articleRepository.save(article);
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    };
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    Object.assign(article, updateArticleDto);

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.articleRepository.save(article);
  }

  async findAllArticles(
    currentUserId: number,
    query: FindAllArticlesQueryInterface,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      queryBuilder.andWhere('author.username = :username', {
        username: query.author,
      });
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    if (query.favorited) {
      const author = await this.articleRepository.manager.findOne(UserEntity, {
        where: { username: query.favorited },
        relations: ['favorites'],
      });

      if (!author) {
        queryBuilder.andWhere('1 = 0'); // No articles found for the favorited user
      } else {
        const ids = author.favorites.map((favorite) => favorite.id);
        if (ids.length > 0) {
          queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
        } else {
          queryBuilder.andWhere('1 = 0'); // No articles found for the favorited user
        }
      }
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async addArticleToFavorites(
    slug: string,
    userId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    const user = await this.articleRepository.manager.findOne(UserEntity, {
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isNotFavorited = !user.favorites.some(
      (favorite) => favorite.id === article.id,
    );
    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.articleRepository.manager.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    userId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    const user = await this.articleRepository.manager.findOne(UserEntity, {
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isFavorited = user.favorites.some(
      (favorite) => favorite.id === article.id,
    );
    if (isFavorited) {
      user.favorites = user.favorites.filter(
        (favorite) => favorite.id !== article.id,
      );
      article.favoritesCount--;
      await this.articleRepository.manager.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
