import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UpdateAuthDto } from './dto/update-auth.dto';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginDto } from './dto/login.dto';
import {CreateUserDto, LoginDto, RegisterUserDto} from './dto/index';

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


  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
