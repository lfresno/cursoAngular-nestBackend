import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    _id?: string       //ESTO LO CREA MONGO AUTOMÁTICAMENTE

    //son propiedades que queremos guardar en la bbdd
    @Prop({unique: true, required: true})   //especificamos las propiedades que queremos en estas. Parecido a los validators
    email: string;

    @Prop({required: true})
    name: string;
    
    @Prop({minlength: 6, required: true})
    password?: string;
    
    @Prop({default: true})  //pueden tener valores por defecto
    isActive: boolean;
    
    @Prop({ type: [String], default: ['user'] })    //se le dice la forma de estos datos
    roles: string[];
}

//lo exportamos para poder usarlo en los módulos y la base de datos.
export const UserSchema = SchemaFactory.createForClass(User);
