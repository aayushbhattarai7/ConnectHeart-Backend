import { AppDataSource } from '../config/database.config'
import { userDetails } from '../entities/auth/details.entities'
import { Message } from '../constant/message'
import { Auth } from '../entities/auth/auth.entity';
import { AuthDTO, DetailDTO } from '../dto/user.dto';
import HttpException from '../utils/HttpException.utils';
class UserService {
    constructor(
        private readonly getDet = AppDataSource.getRepository(userDetails),
        private readonly getDetails = AppDataSource.getRepository(Auth),
  
    ){}
     async getById(id: string): Promise<Auth> {
        const query = this.getDetails.createQueryBuilder('auth').where('auth.id = :id', { id })
        query.leftJoinAndSelect('auth.details', 'details')
        const user = await query.getOne()
    
        if (!user) throw HttpException.notFound(Message.notFound)
    
        return user
      }
    }
    export default new UserService()