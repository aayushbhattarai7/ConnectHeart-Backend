import axios from 'axios';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { BsFillSendFill } from 'react-icons/bs';
import { io, Socket as IOSocket } from 'socket.io-client';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { image } from '../../../config/constant/image';

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}

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
  read: boolean;
  createdAt: string;
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

const MessageUser = () => {
  const [connects, setConnects] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<Messages[]>([]);
  const [toggleEmoji, setToggleEmoji] = useState<boolean>(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [senders, setSenders] = useState('');
  const [type, setType] = useState<boolean>(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const [socket, setSocket] = useState<IOSocket | null>(null);
  const message = watch('message');

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
        fetchChat(senders);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    } else {
      console.error('No token found in sessionStorage');
    }
  }, [senders]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found in sessionStorage');
      return;
    }

    const newSocket = io('http://localhost:4000', {
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      if (senders) {
        newSocket?.emit('room', { receiverId: senders });
      }
    });

    newSocket.on('message', (message: Messages) => {
      setChats((prevChats) => [...prevChats, message]);
    });

    newSocket.on('read', ({ senderId }) => {
      if (senderId) {
        setChats((prevMessages) =>
          prevMessages.filter((message) => message.sender.id !== senderId),
        );
      }
    });

    newSocket.on('typing', ({ userId }) => {
      if (userId !== decodedToken?.id && senders) {
        setType(true);
        setTimeout(() => setType(false), 3000);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    return () => {
      newSocket.off('message');
      newSocket.off('read');
      newSocket.off('unreadCounts');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, [senders]);

  useEffect(() => {
    socket?.on('unreadCounts', ({ senderId, unreadCount }) => {
      setUnreadCounts((prevUnreadCounts) => ({
        ...prevUnreadCounts,
        [senderId]: unreadCount,
      }));
    });

    return () => {
      socket?.off('unreadCounts');
    };
  }, [socket]);

  const handleChatClick = async (senderId: string) => {
    console.log('clicked');
    const response = await axiosInstance.get(`/chat/${senderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    socket?.emit('readed', { senderId, userId: decodedToken?.id });
    setSenders(senderId);
    setSelectedConnectionId(senderId);
    console.log(response);
    console.log(senderId, 'this is senderId');
    socket?.emit('getUnreadCounts', { senderId, receiverId: decodedToken?.id });
  };

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
      receiverId: senders,
    });

    reset();
    setToggleEmoji(false);
  };

  const emojiHandleSelect = (selectEmoji: EmojiClickData) => {
    const emoji = selectEmoji.emoji;
    setValue('message', message + emoji);
  };

  const showConnection = async () => {
    try {
      const response = await axiosInstance.get('/connect/friends', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConnects(response?.data?.friends);
      console.log(response?.data?.friends);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching connection');
      } else {
        setError('Error while fetching connection');
      }
    }
  };

  useEffect(() => {
    showConnection();
  }, []);

  return (
    <div className="bg-gray-100">
      <div className=" ml-[18rem] mt-24 justify-start fixed top-0 w-[39rem] bg-gray-100  p-8 items-start h-screen border">
        <div className="justify-start flex flex-col gap-2 mb-2 overflow-hidden">
          {error && <p>{error}</p>}
          {connects?.map((connect) => {
            const unreadCount = unreadCounts[connect.id] || 0;

            return (
              <div
                key={connect?.id}
                className={`flex flex-col p-10 h-20 mb-10 justify-center border border-white items-start w-[30rem] cursor-pointer rounded-xl ${
                  selectedConnectionId === connect.id
                    ? 'bg-blue-500 text-white hover:bg-blue-700 border border-blue-500'
                    : ' hover:bg-gray-200 border border-white'
                }`}
                onClick={() => handleChatClick(connect?.id)}
              >
                <div className="">
                  <div className="flex pt-2">
                    {connect?.profile?.path ? (
                      <img
                        className="h-16 w-16 rounded-full mb-3"
                        src={connect?.profile?.path}
                        alt="Profile"
                      />
                    ) : (
                      <img
                        className="w-16 h-16 rounded-full"
                        src="/profilenull.jpg"
                        alt="Default Profile"
                      />
                    )}
                    <div className="flex justify-center w-[20rem] pl-3 items-center">
                      <div className="mb-3 mt-2 w-[10rem] mr-16 flex flex-col font-medium">
                        <p className="font-medium">
                          {connect?.details?.first_name} {connect?.details?.last_name}
                        </p>

                        <p></p>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white rounded-full text-xs w-5 py-[2px] px-[6px] h-5">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-screen flex flex-col  overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-white"></div>
        <div className=" ml-[63rem] p-4 mt-14 justify-end items-end mb-12 mx-auto w-[60rem] max-w-4xl  bg-white rounded-lg shadow-lg overflow-y-auto flex-grow">
          <div className="flex flex-col justify-end w-full overflow-auto items-end space-y-4">
            {chats?.map((chat, index) => (
              <div
                key={`${chat.id} ${index}`}
                className={`mb-2 p-4 rounded-lg shadow-md flex justify-end items-end ${
                  decodedToken?.id === chat?.sender?.id
                    ? 'bg-blue-700 text-white justify-end items-end self-end ml-auto'
                    : 'bg-gray-300 text-black justify-start items-end self-start mr-auto'
                }`}
              >
                <div className="">
                  <img src="" alt="" />
                  <p className="font-semibold">{chat?.sender?.details?.first_name}</p>
                  <div className="flex flex-col">
                    <p>{chat.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-full justify-start items-start flex">
              {type && (
                <p>
                  <img src={image?.typing} alt="" />
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="fixed bottom-20 left-90 justify-end flex ">
              {toggleEmoji && <EmojiPicker onEmojiClick={emojiHandleSelect} />}
            </div>
          </div>

          <div className="w-[56rem] fixed bottom-0 left-[63rem] p-4 bg-white border border-gray-300">
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-4xl mx-auto">
              <input
                type="text"
                {...register('message')}
                placeholder="Type Here..."
                className="flex-grow p-2 rounded-l-lg outline-none"
                onKeyDown={() => socket?.emit('typing', { senders })}
                required
              />
              <div className="flex gap-12">
                <p className="text-2xl pt-3" onClick={() => setToggleEmoji(!toggleEmoji)}>
                  <MdOutlineEmojiEmotions />
                </p>

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
    </div>
  );
};

export default MessageUser;
