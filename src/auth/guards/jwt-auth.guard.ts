import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard extends the default AuthGuard with 'jwt' strategy
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
