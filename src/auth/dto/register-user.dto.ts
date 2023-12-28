
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {

    //Es muy parecido a create user
    //se hace esto en vez de reutilizarlo porque tienen objetivos distints y si en un futuro se quiere modificar uno de ellos, el otro no se ve afectado
    
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    
}
