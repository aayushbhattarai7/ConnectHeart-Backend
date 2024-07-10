import jwt from "jsonwebtoken";
import { DotenvConfig } from "../config/env.config";
import { IJwtPayload, type IJwtOptions } from "../interface/jwt.interface";

class WebTokenService {
    sign(user:IJwtPayload, options:IJwtOptions):string{
        return jwt.sign(
            {
                id:user.id
            },
            options.secret,
            {
                expiresIn:options.expiresIn
            }
        )
    }
    verify(token:string, secret: string): any{
        return jwt.verify(token, secret)
    }

    generateTokens(user: IJwtPayload): { accessToken: string; refreshToken: string } {
        const accessToken =  this.sign(
           user, {
            expiresIn: DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
            secret: DotenvConfig.ACCESS_TOKEN_SECRET
           }
        )
        const refreshToken = this.sign(
            user, {
                expiresIn: DotenvConfig.REFRESH_TOKEN_EXPIRES_IN,
                secret: DotenvConfig.REFRESH_TOKEN_SECRET
            }
        )
        return {accessToken, refreshToken}
    }
}

export default new WebTokenService()