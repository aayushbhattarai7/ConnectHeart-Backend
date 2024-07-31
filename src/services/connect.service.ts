import { AppDataSource } from '../config/database.config'
import { Auth } from '../entities/auth/auth.entity'
import { Connect } from '../entities/connection/connection.entity'
import HttpException from '../utils/HttpException.utils'
import { Status } from '../constant/enum'
import { Message } from '../constant/message'
import { Http } from 'winston/lib/winston/transports'

export class ConnectService {
  constructor(
    private readonly connectRepo = AppDataSource.getRepository(Connect),
    private readonly AuthRepo = AppDataSource.getRepository(Auth)
  ) {}

  async connect(sender: string, receiver: string): Promise<Connect> {
    try {
      const senderId = await this.AuthRepo.findOneBy({ id: sender })
      if (!senderId) throw HttpException.unauthorized

      const receiverId = await this.AuthRepo.findOneBy({ id: receiver })
      if (!receiverId) throw HttpException.notFound('Receiver Not Found')
      if (sender === receiver) throw HttpException.badRequest('Cannot send friend request')
      const existingRequest = await this.connectRepo.findOne({
        where: [
          { sender: { id: sender }, receiver: { id: receiver } },
          { sender: { id: receiver }, receiver: { id: sender } },
        ],
      })

      if (existingRequest) {
        throw HttpException.badRequest('Friend Request already sent to this user')
      }

      const send = this.connectRepo.create({
        sender: senderId,
        receiver: receiverId,
      })
      await this.connectRepo.save(send)
      return send
    } catch (error) {
      console.log(error, 'error')
      throw HttpException.badRequest
    }
  }

  async viewRequests(userId: string): Promise<Connect[]> {
    try {
      const view = await this.connectRepo
        .createQueryBuilder('connect')
        .innerJoinAndSelect('connect.sender', 'sender')
        .where('connect.receiver_id =:userId', { userId })
        .andWhere('connect.status =:status', { status: Status.PENDING })
        .getMany()

      return view
    } catch (error) {
      throw HttpException.notFound
    }
  }

  async acceptRequest(userId: string, senderId: string): Promise<string> {
    try {
      await this.connectRepo
        .createQueryBuilder('connect')
        .update('connect')
        .set({ status: Status.ACCEPTED })
        .where('connect.sender_id =:senderId', { senderId })
        .andWhere('connect.receiver_id =:userId', { userId })
        .andWhere('connect.status =:status', { status: Status.PENDING })
        .execute()
      return Message.accepted
    } catch (error) {
      console.log('🚀 ~ ConnectService ~ acceptRequest ~ error:', error)
      throw HttpException.internalServerError(Message.error)
    }
  }

  async rejectRequest(userId: string, senderId: string): Promise<string> {
    try {
      await this.connectRepo
        .createQueryBuilder('connect')
        .delete()
        .from('connect')
        .where('connect.receiver_id =:userId', { userId })
        .andWhere('connect.sender_id =:senderId', { senderId })
        .andWhere('connect.status = :status', { status: Status.PENDING })
        .execute()
      return Message.deleted
    } catch (error) {
      console.log(error)
      throw HttpException.badRequest
    }
  }

  async getFriends(userId: string): Promise<Auth[]> {
    try {
      const allFriends = await this.connectRepo
        .createQueryBuilder('connection')
        .innerJoinAndSelect('connection.sender', 'sender')
        .innerJoinAndSelect('connection.receiver', 'receiver')
        .where('connection.sender_id= :userId OR connection.receiver_id= :userId', { userId })
        
        .getMany()
        console.log('Status.ACCEPTED:', Status.ACCEPTED);

      const friends: Auth[] = allFriends.map((connection) =>
        connection.sender.id === userId && Status.ACCEPTED? connection.receiver : connection.sender
      )


      return friends
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching friends list')
    }
  }
}
