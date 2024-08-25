import React, { FormEvent, useEffect, useState } from 'react';
import { FaImage, FaSmile, FaVideo } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useLang } from '../../../hooks/useLang';
import axiosInstance from '../../../service/instance';
import Button from '../../common/atoms/Button';
import { authLabel } from '../../../localization/auth';
import { Link } from 'react-router-dom';

interface FormData {
  thought: string;
  feeling: string;
  files: File[];
}

interface PostProps {
  postId: string;
  refresh: (postId: string) => void;
}

interface User {
  id?: string;
  email?: string;
  details: {
    first_name: string;
    last_name: string;
    phone_number: string;
    gender: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}

const Post: React.FC<PostProps> = ({ postId, refresh }) => {
  const { lang } = useLang();
  const {
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const [user, setUser] = useState<User | null>(null);
  const [formData, setformData] = useState<FormData>({ thought: '', feeling: '', files: [] });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const getUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/user/user', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response?.data?.getuser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = new FormData();
      data.append('thought', formData.thought);
      data.append('feeling', formData.feeling);
      data.append('type', 'POST');
      formData.files?.forEach((file) => data.append('files', file));
      await axiosInstance.post('/post', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset();
      refresh(postId);
      setImagePreviews([]);
    } catch (err) {
      console.error('Error while submitting:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setformData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setformData((prevData) => ({
      ...prevData,
      files,
    }));

    setImagePreviews(files.map(URL.createObjectURL));
  };

  useEffect(() => {
    getUserDetails();
  });

  return (
    <div className="2xl:w-[50rem] xl:w-[48rem]  lg:w-[40rem] md:w-[40rem] sm:w-[30rem] mb-10 mt-20  bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <div className="flex gap-6 items-start mb-6" key={user?.id}>
          {user?.profile?.path ? (
            <Link to="/profile">
              {' '}
              <img className="w-16 h-16 rounded-full" src={user?.profile?.path} alt="Profile" />
            </Link>
          ) : (
            <Link to="/profile">
              <img
                className="w-16 h-16 rounded-full"
                src="/profilenull.jpg"
                alt="Default Profile"
              />
            </Link>
          )}
          <div className="flex flex-col flex-1  gap-4 ">
            <input
              placeholder="What on your mind?"
              name="thought"
              onChange={handleChange}
              className="w-full p-3 border bg-gray-100 border-gray-300 rounded-2xl focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between">
              <Button
                buttonText={authLabel.post[lang]}
                name=""
                type="submit"
                disabled={isSubmitting}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-around  mt-2 border-t border-gray-300 pt-2">
          <div className="flex gap-20 font-poppins font-medium">
            <label className="cursor-pointer flex items-center gap-1 text-green-500">
              <FaImage className="text-2xl" />
              <input
                type="file"
                name="files"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm text-gray-600">Media</span>
            </label>
            <button type="button" className="flex items-center gap-1 text-yellow-500">
              <FaSmile className="text-xl" />
              <select
                id="feeling"
                {...register('feeling')}
                onChange={handleChange}
                className=" rounded-md  w-24 py-2  focus:outline-none bg-white text-yellow-500"
              >
                <option value="">Feeling</option>
                <option value="Happy">😊 Happy</option>
                <option value="Loved">❤️ Loved</option>
                <option value="Flirty">😉 Flirty</option>
                <option value="Curious">🤔 Curious</option>
                <option value="Grateful">🙏 Grateful</option>
                <option value="In Love">😍 In Love</option>
                <option value="Playful">😜 Playful</option>
                <option value="Anxious">😰 Anxious</option>
                <option value="Romantic">💘 Romantic</option>
                <option value="Cheerful">😁 Cheerful</option>
              </select>
            </button>

            <button type="button" className="flex items-center gap-1 text-green-500">
              <FaVideo className="text-xl" />
              <span className="text-sm">Live Video</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {imagePreviews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Selected"
              className="w-20 h-20 rounded-md object-cover"
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default Post;

/*import axios from 'axios';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { BsFillSendFill } from 'react-icons/bs';
import { connect, io, Socket as IOSocket } from 'socket.io-client';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
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
    profile: {
      id: string;
      path: string;
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
    <div className=" font-poppins">
      <div className=" ml-[18rem] mt-20 justify-start  fixed top-0 w-[25rem] bg-white pt-5 items-start h-screen ">
        <div className=" flex flex-col  mb-2 overflow-none w-[25rem] border h-screen pt-5">
          <div className="mb-6">
            <h1 className="text-blue-500 font-medium pl-7">Messages</h1>
          </div>
          <div className=" w-[22rem] mb-10 flex gap-5 ml-6 h-10 border bg-gray-100 rounded-lg">
            <button>
              <FiSearch />
            </button>
            <input
              className="outline-none bg-gray-100 w-[20rem]"
              type="text"
              name=""
              id=""
              placeholder="Search"
            />
          </div>
          {error && <p>{error}</p>}
          {connects?.map((connect) => {
            const unreadCount = unreadCounts[connect.id] || 0;

            return (
              <div
                key={connect?.id}
                className={`flex flex-col p-8 h-11 mb-10 justify-center overflow-hidden w-[24.9rem]  items-center cursor-pointer${
                  senders === connect.id
                    ? ' text-black hover:bg-gray-100 bg-gray-100 border-t-2 border-b-2 '
                    : ' hover:bg-gray-100'
                }`}
                onClick={() => handleChatClick(connect?.id)}
              >
                <div className="flex items-center justify-center">
                  <div className="flex pt-2">
                    {connect?.profile?.path ? (
                      <img
                        className="h-12 w-12 rounded-full mb-3"
                        src={connect?.profile?.path}
                        alt="Profile"
                      />
                    ) : (
                      <img
                        className="w-12 h-12 rounded-full"
                        src="/profilenull.jpg"
                        alt="Default Profile"
                      />
                    )}
                    <div className="flex justify-start w-[18rem] pl-3 items-center">
                      <div className="mb-3 mt-2 w-[10rem]  flex flex-col font-medium">
                        <p className="font-medium">
                          {connect?.details?.first_name} {connect?.details?.last_name}
                        </p>
                        {type && senders === connect.id && <p>Typing...</p>}
                      </div>
                    </div>
                  </div>
                  <div className="pr-7">
                    <p className="">5:30</p>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full text-xs w-9 px-[8px] h-5">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-[58rem]  flex flex-col  overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-white"></div>
        <div className=" ml-[43rem] p-4 mb-10 justify-start items-start mt-[4.7rem]  overflow-auto mx-auto w-[60rem] max-w-4xl bg-white shadow-lg overflow-y-auto border  flex-grow">
          {connects?.map((connect) => {
            return (
              <div>
                {senders === connect.id ? (
                  <div>
                    <div
                      key={senders}
                      className="flex gap-6 fixed top-[6.7rem] h-16 rounded right-[21rem] text-black bg-white border w-[56rem]"
                    >
                      <div>
                        {senders ? (
                          <div
                            key={senders}
                            className="flex gap-6 fixed top-[6.7rem] h-16 rounded right-[21rem] text-black border w-[56rem]"
                          >
                            {connect?.profile?.path ? (
                              <img
                                className="h-12 w-12 rounded-full mb-3"
                                src={connect?.profile?.path}
                                alt=""
                              />
                            ) : (
                              <img
                                className="w-12 h-12 rounded-full"
                                src="/profilenull.jpg"
                                alt="Default Profile"
                              />
                            )}

                            <div className="">
                              <div className="flex pt-2 flex-col">
                                <p className="font-medium text-xl">
                                  {connect?.details?.first_name} {connect?.details.last_name}
                                </p>
                                {type && senders === connect.id && <p>Typing...</p>}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className="flex flex-col pt-72 justify-end w-full overflow-auto mt-20 items-end  space-y-4">
            {chats?.map((chat, index) => (
              <div
                key={`${chat.id} ${index}`}
                className={`mb-2 p-4 rounded-lg shadow-md  flex justify-end items-end  ${
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
            <div className="fixed bottom-20 left-72 justify-end flex ">
              {toggleEmoji && <EmojiPicker onEmojiClick={emojiHandleSelect} />}
            </div>
          </div>

          <div className="w-[56rem] fixed bottom-0 left-[43rem] p-4 bg-white border border-gray-300">
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
 */
