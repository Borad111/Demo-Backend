import jwt from 'jsonwebtoken';

const JWT_SECRET = "your_secret_key";



export class jwtUtils {
    static generateToken(payload: object, expiresIn:string | number='1d'): string {
        return jwt.sign(payload, JWT_SECRET as string, { expiresIn });
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET as string);
        } catch (error) {
            throw new Error("Invalid Token");
        }
    }

    static decodeToken(token: string): any {
        return jwt.decode(token);
    }
}
