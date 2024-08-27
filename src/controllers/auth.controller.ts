import { type Request, type Response } from 'express';
import { Message } from '../constant/message';
import { StatusCodes } from '../constant/StatusCodes';
import authService from '../services/auth.service';
import { AuthDTO, ResetPasswordDTO } from '../dto/user.dto';
import webTokenService from '../utils/webToken.service';
import userService from '../services/user.service';
import HttpException from '../utils/HttpException.utils';
import { EmailService } from '../services/email.service';
const emailservice = new EmailService();
export class AuthController {
  async create(req: Request, res: Response) {
    try {
      const file = req?.file;
      const image = file
        ? {
            name: file?.filename,
            mimetype: file?.mimetype,
            type: req.body?.type,
          }
        : null;

      await authService.create(image as any, req.body as AuthDTO);
      res.status(StatusCodes.CREATED).json({ message: Message.created });
    } catch (error: any) {
      console.log('🚀 ~ AuthController ~ create ~ error:', error?.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error?.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body);
      console.log(req.body);
      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
        data.role,
      );
      res.status(StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          email: data.email,
          details: {
            first_name: data.details.first_name,
            last_name: data.details.last_name,
            phone_number: data.details.phone_number,
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          message: Message.loginSuccessfully,
        },
      });
    } catch (error: any) {
      console.log('🚀 ~ AuthController ~ login ~ error:', error?.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error?.message,
      });
    }
  }
  async googleLogin(req: Request, res: Response) {
    const googleId = req.body.id;
    const data = await authService.googleLogin(googleId);
    console.log('🚀 ~ AuthController ~ googleLogin ~ data:', data);

    const tokens = webTokenService.generateTokens(
      {
        id: data.id,
      },
      data.role,
    );
    res.status(StatusCodes.SUCCESS).json({
      data: {
        user: {
          id: data?.id,
          email: data?.email,
          role: data?.role,
          details: {
            firstName: data?.details?.first_name,
            middleName: data?.details?.middle_name,
            lastName: data?.details?.last_name,
          },
          profile: {
            id: data?.profile?.id,
            path:data?.profile?.path
          }
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      message: Message.loginSuccessfully,
    });
  }


  async getId(req: Request, res: Response) {
    try {
      const id = req.params.id;
      console.log(id);
      const data = await userService.getById(id as string);
      console.log(data);
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        data,
        message: Message.created,
      });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ getId ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async searchUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { firstName, middleName, lastName } = req.query;

      const search = await userService.searchUser(
        userId as string,
        firstName as string,
        lastName as string,
      );
      res.status(StatusCodes.SUCCESS).json({
        search,
      });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ searchUser ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }
  async getEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) throw HttpException.notFound(Message.notFound);
      const details = await authService.getEmail({ email });
      res.json({ details });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ getEmail ~ error:', error);
      res.json({ message: Message.error });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      console.log('🚀 ~ AuthController ~ resetPassword ~ userId:', userId);

      console.log(req.body);
      const reset = await authService.passwordReset(
        userId as string,
        req.body as ResetPasswordDTO,
      );
      res.status(StatusCodes.SUCCESS).json({
        message: Message.success,
        reset,
      });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ resetPassword ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const getuser = await authService.getUser(userId as string);
      res.status(StatusCodes.SUCCESS).json({
        getuser,
        message: Message.success,
      });
    } catch (error) {
      console.log('🚀 ~ AuthController ~ getUser ~ error:', error);
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const friendId = req?.params?.id;
      const getUser = await authService.getUserProfile(
        userId as string,
        friendId,
      );
      res.status(StatusCodes.SUCCESS).json({
        getUser,
        message: Message.success,
      });
    } catch (error: any) {
      console.log(error?.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error?.message,
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const file = req?.file;
      const image = file
        ? {
            name: file?.filename,
            mimetype: file?.mimetype,
            type: req.body?.type,
          }
        : null;
      console.log(req.body, 'la');
      await authService.updateUser(
        userId as string,
        image as any,
        req.body as AuthDTO,
      );
      res.status(StatusCodes.SUCCESS).json(Message.updated);
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User Update Failed',
      });
    }
  }
}
