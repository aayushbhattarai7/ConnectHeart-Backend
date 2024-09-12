import { AppDataSource } from '../config/database.config'
import { Auth } from '../entities/auth/auth.entity'
import { Connect } from '../entities/connection/connection.entity'
import HttpException from '../utils/HttpException.utils'
import { Gender, Status } from '../constant/enum'
import { Message } from '../constant/message'
import { Room } from '../entities/chat/room.entity'
import { Chat } from '../entities/chat/chat.entity'
import { BlockUser } from '../entities/connection/block.entity'

export class ConnectService {
  constructor(
    private readonly connectRepo = AppDataSource.getRepository(Connect),
    private readonly AuthRepo = AppDataSource.getRepository(Auth),
    private readonly RoomRepo = AppDataSource.getRepository(Room),
    private readonly chatRepo = AppDataSource.getRepository(Chat),
    private readonly blockRepo = AppDataSource.getRepository(BlockUser)
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
      const saveit = await this.connectRepo.save(send)

      return send
    } catch (error) {
      console.log(error, 'error')
      throw HttpException.badRequest
    }
  }

  async viewRequests(userId: string): Promise<Connect[]> {
    try {
      const requests = await this.connectRepo
        .createQueryBuilder('connect')
        .leftJoinAndSelect('connect.sender', 'sender')
        .leftJoinAndSelect('sender.details', 'details')
        .leftJoinAndSelect('sender.profile', 'profile')
        .where('connect.receiver.id = :userId', { userId })
        .andWhere('connect.status = :status', { status: Status.PENDING })
        .orderBy('connect.createdAt', 'DESC')
        .getMany()

      return requests
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

      const sender = await this.AuthRepo.findOneBy({ id: senderId })
      if (!sender) throw HttpException.notFound
      const receiver = await this.AuthRepo.findOneBy({ id: userId })
      if (!receiver) throw HttpException.unauthorized

      const room = this.RoomRepo.create({
        sender: sender,
        receiver: receiver,
      })

      await this.RoomRepo.save(room)
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
        .execute()
      return Message.deleted
    } catch (error) {
      console.log(error)
      throw HttpException.badRequest
    }
  }

  async removeConnection(userId: string, connectId: string): Promise<string> {
    try {
      await this.chatRepo
        .createQueryBuilder('chat')
        .delete()
        .where('chat.sender_id =:userId AND chat.receiver_id =:connectId', {
          userId,
          connectId,
        })
        .orWhere('chat.sender_id =:connectId AND chat.receiver_id =:userId', {
          userId,
          connectId,
        })
        .execute()

      await this.RoomRepo.createQueryBuilder('room')
        .delete()
        .where('room.sender_id = :userId AND room.receiver_id = :connectId', {
          userId,
          connectId,
        })
        .orWhere('room.sender_id = :connectId AND room.receiver_id = :userId', {
          userId,
          connectId,
        })
        .execute()
      await this.connectRepo
        .createQueryBuilder('connect')
        .delete()
        .where('connect.sender_id = :userId AND connect.receiver_id = :connectId', { userId, connectId })
        .orWhere('connect.sender_id = :connectId AND connect.receiver_id = :userId', { userId, connectId })
        .execute()

      return 'Connection and associated room removed successfully'
    } catch (error) {
      console.log('🚀 ~ removeConnection ~ error:', error)
      throw HttpException.badRequest
    }
  }

  async getFriends(userId: string) {
    try {
      const allFriends = await this.connectRepo
        .createQueryBuilder('connection')
        .leftJoinAndSelect('connection.sender', 'sender')
        .leftJoinAndSelect('connection.receiver', 'receiver')
        .leftJoinAndSelect('connection.people', 'people')
        .leftJoinAndSelect('sender.details', 'senderDetails')
        .leftJoinAndSelect('receiver.details', 'receiverDetails')
        .leftJoinAndSelect('sender.profile', 'senderprofile')
        .leftJoinAndSelect('receiver.profile', 'receiverprofile')
        .where(
          '(connection.sender_id = :userId OR connection.receiver_id = :userId) AND connection.status != :status',
          { userId, status: Status.PENDING }
        )
        .getMany()
      const friends = allFriends.map((connection) => {
        const friend = connection.sender.id === userId ? connection.receiver : connection.sender
        return { ...friend, people: connection.people }
      })

      return friends
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching friends list')
    }
  }

  async getFriendsCount(userId: string): Promise<Number> {
    try {
      const friends = await this.getFriends(userId)
      const count: number = friends.length
      return count
    } catch (error) {
      console.error(error)
      throw new Error('Error fetching friends list')
    }
  }

  async getUserSuggestion(userId: string) {
    const auth = await this.AuthRepo.findOne({
      where: { id: userId },
      relations: ['details'],
    })
    if (!auth) throw HttpException.unauthorized
    if (!auth.details.gender) throw HttpException.notFound
    const gender = auth.details.gender
    if (!gender) throw HttpException.notFound
    const users = await this.AuthRepo.createQueryBuilder('auth')
      .leftJoinAndSelect('auth.details', 'details')
      .leftJoinAndSelect('auth.profile', 'profile')
      .where('auth.id != :userId', { userId })

      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('connect.receiver_id')
          .from(Connect, 'connect')
          .where('connect.sender_id =:userId', { userId })
          .getQuery()
        return 'auth.id NOT IN' + subQuery
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('connect.sender_id')
          .from(Connect, 'connect')
          .where('connect.receiver_id = :userId', { userId })
          .getQuery()
        return 'auth.id NOT IN' + subQuery
      })
      .getMany()
    return users
  }

  async blockUser(userId: string, blocked: string) {
    try {
      const user = await this.AuthRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.unauthorized

      const blockedUser = await this.AuthRepo.findOneBy({ id: blocked })
      if (!blockedUser) throw HttpException.notFound
      const block = this.blockRepo.create({
        blocked_by: user,
        blocked_to: blockedUser,
      })
      await this.blockRepo.save(block)
      console.log(block)
      return block
    } catch (error: any) {
      console.log(error)
      throw HttpException.badRequest(error.message)
    }
  }

  async unblockUser(blockedBy: string, blockedTo: string) {
    try {
      const result = await this.blockRepo
        .createQueryBuilder()
        .delete()
        .from(BlockUser)
        .where('blocked_by = :blockedBy AND blocked_to = :blockedTo', {
          blockedBy: blockedBy,
          blockedTo: blockedTo,
        })
        .execute()

      return 'Unblocked successfully'
    } catch (error: any) {
      console.error(error)
      throw HttpException.notFound
    }
  }

  async chanageBlockStatus(userId: string, blocked: string) {
    try {
      const changeBlockStatus = await this.blockRepo
        .createQueryBuilder('block')
        .where('(block.blocked_to = :blocked AND block.blocked_by = :userId)', { blocked, userId })
        .getOne()
      if (changeBlockStatus) {
        await this.unblockUser(userId, blocked)
      } else {
        await this.blockUser(userId, blocked)
      }
      return changeBlockStatus
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }

  async getBlockedStatus(userId: string, blocked: string) {
    try {
      const user = await this.AuthRepo.findOneBy({ id: userId })
      if (!user) throw HttpException.unauthorized

      const blockedUser = await this.AuthRepo.findOneBy({ id: blocked })
      if (!blockedUser) throw HttpException.unauthorized
   const isBlocked = await this.blockRepo.findOne({
      where: {
        blocked_by: { id: userId },   
        blocked_to: { id: blocked }
      }, relations:['blocked_by', 'blocked_to']
    });
      return isBlocked

    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }
}
