import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService : JwtService,
    private authService : AuthService,
  ) {}

  //execution context da acceso a la solicitud que se está haciendo 
  async canActivate( context: ExecutionContext ):  Promise<boolean> { //true: la persona puede entrar

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) { //si no hay token, falta un error
      throw new UnauthorizedException('There is no bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED } //si el token se creó con una semilla distinta, dará error
      );

      const user  = this.authService.findUserById( payload.id );
      if(!user) throw new UnauthorizedException('User does not exist');
      if( !(await user).isActive ) throw new UnauthorizedException('User is not active');

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user; //así podemos ver todo el obj del usuario y no solo el id 
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  
}
