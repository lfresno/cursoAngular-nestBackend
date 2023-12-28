import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    //Se escriben los datos que esperamos de una entidad de tipo User. (los que se van a pedir al usuario) 
    //Los nombres de las propiedades no tienen porqué ser los mismos, pero son buenas prácticas hacerlo así.

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

    
}
