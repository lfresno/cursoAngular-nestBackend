import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UpdateAuthDto } from './dto/update-auth.dto';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginDto } from './dto/login.dto';
import {CreateUserDto, LoginDto, RegisterUserDto} from './dto/index';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    //createUserDto.    se puede acceder a sus propiedades
    return this.authService.create(createUserDto);
  }

  @Post('/register')
  register( @Body() registerDto : RegisterUserDto ) {
    return this.authService.register(registerDto);
  }
  
  @Post('/login')
  login( @Body() loginDto : LoginDto ) {
    return this.authService.login(loginDto);
  }


  @UseGuards( AuthGuard ) //con esto y la request comprobamos la autorización
  @Get()
  findAll( @Request() req: Request) {
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req : Request ){ //con este método podemos ir reiniciando el token cada cierto tiempo
    const user = req['user'] as User;
    return{
      user: user,
      token: this.authService.getJwtToken({id: user._id})
    }
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
