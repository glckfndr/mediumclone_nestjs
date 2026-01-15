/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JWT_SECRET } from '@app/config';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import type { Response, NextFunction } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, _: Response, next: NextFunction) {
    // Middleware logic to authenticate the user
    // console.log('AuthMiddleware executed', req.headers);
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    // Here you would normally verify the token and fetch the user
    // For demonstration, we'll just log the token
    //console.log('Extracted Token:', token);
    try {
      const decodedToken = verify(token, JWT_SECRET) as { id: number }; // Replace with actual token verification logic

      const user = await this.userService.findById(decodedToken.id);
      console.log('Decoded Token:', user);
      req.user = user;
      next();
    } catch (err) {
      console.log('Token verification failed:', err);
      req.user = null;
      next();
      return;
    }
  }
}
