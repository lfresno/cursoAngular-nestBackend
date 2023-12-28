
export interface JwtPayload {

    id: string;     //este id solo se va a reconstruir si el token fue autorizado por mi backend
    iat?: number;   //fecha de creación
    exp?: number;   //fecha de expiración
}