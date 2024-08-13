import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { BsFillSendFill } from "react-icons/bs";
import { io, Socket as IOSocket } from 'socket.io-client';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import MessageUser from './MessageUser';

interface DecodedToken {
  id: string;
  email: string;
}

interface FormData {
  message: string;
}

interface Messages {
  id: string;
  message: string;
  receiver: {
    id: string;
    details: {
      first_name: string;
      last_name: string;
    };
  };
  sender: {
    id: string;
    details: {
      first_name: string;
      last_name: string;
    };
  };
}

const Message = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  const [chats, setChats] = useState<Messages[]>([]);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [socket, setSocket] = useState<IOSocket | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
        fetchChat(receiverId!);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    } else {
      console.error('No token found in sessionStorage');
    }
  }, [receiverId]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }

    const newSocket = io( 'http://localhost:4000', {
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      newSocket.emit('room', { receiverId: receiverId });
    });

    newSocket.on('message', (message: Messages) => {
      setChats((prevChats) => [...prevChats, message]);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    return () => {
      newSocket.off('message');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, [receiverId]);

  const fetchChat = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/chat/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setChats(response.data.displaychat);
      console.log(response?.data?.displaychat);
    } catch (error) {
      console.error('Error fetching chat data', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!decodedToken?.id) {
      console.error('User not authenticated');
      return;
    }

    socket?.emit('message', {
      message: data.message,
      receiverId: receiverId,
    });
    reset();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className='p-4 flex items-center justify-between bg-white'>
        <MessageUser />
      </div>
      <div className=" ml-[63rem] p-4 mt-14 justify-end items-end mb-12 mx-auto w-[60rem] max-w-4xl border border-gray-300 bg-white rounded-lg shadow-lg overflow-y-auto flex-grow">
        <div className="flex flex-col justify-end w-full overflow-auto items-end space-y-4">
          {chats?.map((chat, index) => (
            <div
              key={`${chat.id} ${index}`}
              className={`mb-2 p-4 rounded-lg shadow-md flex ${
                decodedToken?.id === chat?.sender?.id
                  ? 'bg-blue-700 text-white justify-end items-end self-end ml-auto'
                  : 'bg-gray-300 text-black justify-start items-end self-start mr-auto'
              }`}
            >
              <div className=''>
                <img src="" alt="" />
                <p className="font-semibold">{chat?.sender?.details?.first_name}</p>
                <div className="flex flex-col">
                  <p>{chat.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-[56rem] fixed bottom-0 left-[63rem] p-4 bg-white border border-gray-300">
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-4xl mx-auto">
            <input
              type="text"
              {...register('message')}
              placeholder="Type Here..."
              className="flex-grow p-2 rounded-l-lg outline-none"
              required
            />
            <div className='flex gap-12'>
              <button className='text-2xl'><MdOutlineEmojiEmotions /></button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-blue-700 text-2xl  p-2 rounded-r-full hover:text-blue-900 transition duration-300"
              >
                <BsFillSendFill />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message;