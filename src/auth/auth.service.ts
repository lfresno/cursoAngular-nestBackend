import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcryptjs from "bcryptjs";

import { User } from './entities/user.entity';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto';

//JWT
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService,

  ){}

  //HAY QUE PONER EL ASYNC PARA QUE FUNCIONE EL AWAIT. Se usa el await para asegurarnos de que el error no salta en ningún punto después del servicio
  async create(createuserDto: CreateUserDto) : Promise<User>{

    //manejamos los errores que puedan surgir
    try {
      // 1- Encriptar contraseña: usamos un HASH de una sola vcvía, de forma que sea imposible de desencriptar
      const {password, ...userData} = createuserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      // 2- Guardar el usuario
      await newUser.save();  //guarda en la BD
      const {password:_, ...user} = newUser.toJSON(); //se guarda todo en la BD pero no se devuelve todo en el método
      return user;

      // 3- Generar el JWT (JSON Web Token)

    } catch (error) {
      if(error.code === 11000){
        throw new BadRequestException(`${createuserDto.email} already exists!`);  //algunos errores ya nos los proporciona nest
      }
      throw new InternalServerErrorException(' Something terrible happened!!! ');      
    }

  }

  async register ( registerDto: RegisterUserDto) : Promise<LoginResponse> {

    const user = await this.create( registerDto );  //podemos hacer esto porque el dto es igual, si no, se podría desestructurar y funcionaría tmbn
  
    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    }
  }

  async login( loginDto: LoginDto ) : Promise<LoginResponse>{
    //debería devolver el usuario y el JSON Web Token

    const {email, password } = loginDto;

    //comprobamos los datos y damos error si alguno de ellos falla
    const user = await this.userModel.findOne({email}); //buscar uno en el que email = email
    if(!user) throw new UnauthorizedException('Not valid credentials - email');
    if(!bcryptjs.compareSync(password, user.password)) throw new UnauthorizedException(' Not valid credentials - password');

    //devolvemos el usuario y el token
    const { password:_, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //JWT
  getJwtToken ( payload : JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
