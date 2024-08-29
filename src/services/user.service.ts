import { AppDataSource } from '../config/database.config';
import { UserDetails } from '../entities/auth/details.entities';
import { Auth } from '../entities/auth/auth.entity';
import { EmailService } from './email.service';
import HttpException from '../utils/HttpException.utils';
import { generateHtml } from '../utils/mail.template';

class UserService {
  constructor(
    private readonly getDet = AppDataSource.getRepository(UserDetails),
    private readonly getDetails = AppDataSource.getRepository(Auth),
    private readonly mailService = new EmailService(),
  ) {}
  async getById(id: string): Promise<Auth> {
    try {
      const query = this.getDetails
        .createQueryBuilder('auth')
        .leftJoinAndSelect('auth.details', 'details')
        .where('auth.id = :id', { id });

      const users = await query.getOne();
      if (!users) {
        throw HttpException.notFound('User not found');
      }
      return users;
    } catch (error) {
      console.error('Error:', error);
      throw HttpException.internalServerError('Internal server error');
    }
  }


  async searchUser(
    userId: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const auth = await this.getDetails.findOneBy({ id: userId });
      if (!auth) throw HttpException.unauthorized;

      const searchUser = this.getDet.createQueryBuilder('user');

      if (firstName) {
        searchUser.andWhere('user.first_name ILIKE :firstName', {
          firstName: `%${firstName}%`,
        });
      }

      if (lastName) {
        searchUser.andWhere('user.last_name ILIKE :lastName', {
          lastName: `%${lastName}%`,
        });
      }
      const search = await searchUser.getMany();
      console.log('🚀 ~ UserService ~ searchUser ~ search:', search);

      return search;
    } catch (error) {
      console.log('🚀 ~ UserService ~ searchUser ~ error:', error);
      throw HttpException.internalServerError;
    }
  }
}

export default new UserService();

