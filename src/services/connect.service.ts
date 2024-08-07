import { AppDataSource } from '../config/database.config'
import { Auth } from '../entities/auth/auth.entity'
import { Connect } from '../entities/connection/connection.entity'
import HttpException from '../utils/HttpException.utils'
import { Status } from '../constant/enum'
import { Message } from '../constant/message'
import { Http } from 'winston/lib/winston/transports'
import { freemem } from 'os'

export class ConnectService {
  constructor(
    private readonly connectRepo = AppDataSource.getRepository(Connect),
    private readonly AuthRepo = AppDataSource.getRepository(Auth)
  ) { }

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

  async viewRequests(userId: string): Promise<Auth[]> {
    try {
      const requests = await this.connectRepo.find({
        where:{
          receiver:{
            id:userId
          },
          
            status:Status.PENDING
          
        },
        relations: ['sender.details']
      })

      const req = requests.map((request) =>
        request.sender.id === userId && Status.PENDING ? request.receiver : request.sender
      )
      return req
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
        .leftJoinAndSelect('connection.sender', 'sender')
        .leftJoinAndSelect('connection.receiver', 'receiver')
        .leftJoinAndSelect('sender.details', 'senderDetails') 
        .leftJoinAndSelect('receiver.details', 'receiverDetails')
        .where('connection.sender_id = :userId OR connection.receiver_id = :userId', { userId })
        .andWhere('connection.status = :status', { status: Status.ACCEPTED })
        .getMany();

      const friends: Auth[] = allFriends.map((connection) =>
        connection.sender.id === userId && Status.ACCEPTED ? connection.receiver : connection.sender
      )

      return friends
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching friends list')
    }
  }

  async getFriendsCount() {
    try {

      const friends =  this.getFriends
      const count:number = friends.length
      console.log("🚀 ~ ConnectService ~ getFriendsCount ~ count:", count)
      return count
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching friends list')
    }
  }



  async getUserSuggestion(userId:string) {
    const auth = await this.AuthRepo.findOne({where: {id:userId}})
    if(!auth) throw HttpException.unauthorized

    const users = await this.AuthRepo.createQueryBuilder('auth')
    .leftJoinAndSelect('auth.details','details')
    .where('auth.id != :userId', {userId})
    .andWhere(qb => {
      const subQuery = qb.subQuery()
      .select('connect.receiver_id')
      .from(Connect, 'connect')
      .where('connect.sender_id =:userId',{userId})
      .getQuery();
      return 'auth.id NOT IN' +subQuery
    })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
      .select('connect.sender_id')
      .from(Connect, 'connect')
      .where('connect.receiver_id = :userId', {userId})
      .getQuery();
      return 'auth.id NOT IN' +subQuery
    })
    .getMany()
    return users
  }
  
}
