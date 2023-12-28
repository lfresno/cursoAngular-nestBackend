import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(),
    
    MongooseModule.forFeature([ //definimos los modelos que se quieran exponer en el módulo (sean permitidos)
      {   //crea una colección con documentos de este tipo ?
        name: User.name,
        schema: UserSchema
      }
    ]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' }, //lo recomendado es que expiren cada poco tiempo 
    }),
    
  ]
})
export class AuthModule {}
