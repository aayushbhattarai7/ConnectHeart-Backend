import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import Comments from '../molecules/Comment';
import ReplyComment from '../molecules/ReplyComment';
import { FaComment, FaShare } from 'react-icons/fa';
import axios from 'axios';
import Post from './Post';
import Like from './Like';
import Dropdown from '../molecules/DropDownMenu';
import { jwtDecode } from 'jwt-decode';
import Notification from './Notification';
import User from './User';
import { FaHeart } from 'react-icons/fa';
import CommentOptions from '../molecules/CommentOption';
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6';

interface Post {
  id: string;
  thought: string;
  feeling?: string;
  postImage?: PostMedia[];
  comment?: Comment[];
  likes: likes[];
  postIt: {
    id: string;
    details: {
      first_name?: string;
      last_name?: string;
    };
    profile: {
      id?: string;
      path?: string;
    };
  };
}
interface DecodedToken {
  id: string;
  email: string;
}

interface likes {
  id: string;
  isLiked: boolean;
  auth: Auth;
}

interface Auth {
  id: string;
}

interface Comment {
  id?: string;
  comment?: string;
  parentComment?: Comment | null;
  childComment?: Comment[];
  commentAuth: {
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
  isChild: boolean;
  isParent: boolean;
}

interface PostMedia {
  id?: string;
  path?: string;
}

const ShowPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState<string | null>(null);
  const [sideMenu, setSideMenu] = useState(false);
  const [displayPost, setDisplayPost] = useState(false);
  const getPost = async () => {
    try {
      const response = await axiosInstance.get('/post/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🚀 ~ getPost ~ response:', response);

      setPosts(response.data?.posts);
      const userId = sessionStorage.getItem('accessToken');
      setCurrentUserId(userId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching posts');
      } else {
        setError('Error while fetching posts');
      }
    }
  };

  // const isValidURL = (text: string): boolean => {
  //   new URL(text);
  //   return true;
  // };

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    } else {
      console.error('No token found in sessionStorage');
    }
  }, []);

  const toggleComments = (postId: string) => {
    setVisibleCommentsPostId((prevPostId) => (prevPostId === postId ? null : postId));
  };

  const toggleCommentForm = (postId: string) => {
    setCommentForm((prevPostId) => (prevPostId === postId ? null : postId));
  };

  const toggleReplyForm = (comment: string) => {
    setReplyCommentId((prevCmtId) => (prevCmtId === comment ? null : comment));
  };

  const handleSideClick = () => {
    setSideMenu(!sideMenu);
    setDisplayPost(false);
  };

  const renderComments = (comments: Comment[], isChild: boolean = false) => {
    if (!visibleCommentsPostId) return null;

    return comments.map((cmt) => (
      <div key={cmt?.id} className="flex  bg-gray-100 justify-start ">
        <div
          key={cmt.id}
          className={`relative mb-4 ${isChild ? 'ml-6' : 'ml-1'}
                 p-4 rounded-md  shadow-sm `}
        >
          {isChild && (
            <div className="absolute top-0 left-0 w-1 border-l-2 border-gray-300 h-full"></div>
          )}

          <div className="">
            <div className="flex gap-2 p-2">
              {cmt?.commentAuth?.profile?.path ? (
                <img
                  className="w-8 h-8  rounded-full"
                  src={cmt?.commentAuth?.profile?.path}
                  alt="Profile"
                />
              ) : (
                <img
                  className="w-8 h-8  rounded-full"
                  src="/profilenull.jpg"
                  alt="Default Profile"
                />
              )}
              <div className="flex flex-col">
                <p className="mt-1 font-medium">
                  {cmt?.commentAuth?.details?.first_name} {cmt?.commentAuth?.details?.last_name}{' '}
                </p>
                <div className="flex gap-4">
                  <p>{cmt?.comment}</p>
                  {(decodedToken?.id === cmt?.commentAuth.id ||
                    posts.some((post) => post.postIt.id === decodedToken?.id)) && (
                    <CommentOptions
                      commentId={cmt?.id!}
                      refresh={getPost}
                      commentUser={cmt?.commentAuth.id}
                      comment={cmt.comment!}
                    />
                  )}
                </div>
              </div>
            </div>
            {replyCommentId === cmt.id && (
              <div className=" p-4 rounded-md">
                <ReplyComment
                  postId={posts[0]?.id || ''}
                  commentId={cmt.id || ''}
                  refresh={getPost}
                />
              </div>
            )}
            <button
              onClick={() => toggleReplyForm(cmt.id!)}
              className=" text-black hover:bg-blue-700 p-1 hover:text-white rounded-md"
            >
              Reply
            </button>
          </div>
          {cmt.childComment && renderComments(cmt.childComment, true)}
        </div>
      </div>
    ));
  };

  const MediaList = (medias: PostMedia[]) => {
    return (
      <div className="flex gap-2 flex-wrap">
        {medias.map((media) => {
          const { id, path } = media;
          const isImage = path?.match(/\.(jpeg|jpg|gif|png|svg)$/);
          const isVideo = path?.match(/\.(mp4|webm|ogg)$/);
          return (
            <div className="" key={id}>
              {isImage && <img className="rounded-lg border-black" src={path} />}
              {isVideo && (
                <video className="rounded-lg" controls>
                  <source
                    className="rounded-2xl"
                    src={path}
                    type={`video/${path?.split('.').pop()}`}
                  />
                </video>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1034) {
        setSideMenu(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mt-6 flex flex-col lg:flex-row justify-evenly items-start mx-auto   lg:p-6 bg-gray-100 ">
      {sideMenu ? (
        <div
          className="flex flex-col justify-start items-center overflow-y-auto h-fit  mt-30 2xl:w-[52rem] xl:w-[52rem]  lg:w-[45rem] md:w-[35rem] sm:w-[33rem] xs:w-[20rem] mx-auto blur-sm  lg:min-w-20 p-4 lg:p-10 mb-16 bg-gray-100"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Post postId={posts[0]?.id || ''} refresh={getPost} />
          {error && <p>{error}</p>}
          {posts.map((post) => (
            <div>
              {displayPost && (
                <div
                  className=" flex justify-center shadow-xl p-10 w-full rounded-xl  mb-16 text-ellipsis bg-white"
                  key={post.id}
                >
                  <div className="items-start sm:flex-row ">
                    <div key={post.postIt?.id} className="bg-white  mb-5">
                      <div className="flex bg-white  p-4">
                        <div className="flex gap-1">
                          {post?.postIt?.profile?.path ? (
                            <img
                              className="w-14 h-14  rounded-full "
                              src={post?.postIt?.profile?.path}
                              alt="Profile"
                            />
                          ) : (
                            <img
                              className="w-14 h-14  rounded-full "
                              src="/profilenull.jpg"
                              alt=""
                            />
                          )}

                          <div className="flex gap-1 p-3 mb-3 text-nowrap ">
                            <p className="font-medium font-poppins text-lg">
                              {post.postIt?.details?.first_name}
                            </p>
                            <p className="font-medium font-poppins text-lg">
                              {post.postIt?.details?.last_name}{' '}
                            </p>
                            {post?.feeling ? (
                              <p className="font-poppins pt-[2px] ">
                                {' '}
                                is feeling{' '}
                                <span className="font-poppins font-medium">
                                  {post?.feeling}
                                </span>{' '}
                              </p>
                            ) : (
                              <p className=" text-lg font-poppins">shared the post</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className=" mb-3 p-2 rounded-2xl break-words">
                        <div
                          className="flex flex-col justify-start items-start mb-4 rounded-lg"
                          key={post.id}
                        >
                          <p className="font-poppins font-medium">{post.thought}</p>
                        </div>

                        <div className="flex flex-col  justify-center items-center pl-10 rounded-2xl">
                          <div className="flex  overflow-hidden rounded-lg pl-10">
                            <div className="rounded-lg ">
                              {post?.postImage && MediaList(post.postImage)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" flex justify-between  mb-1">
                      <div>
                        <p className="pl-5 text-xl text-red-500">
                          <FaHeart />
                        </p>
                        <p>1000 Likes</p>
                      </div>
                      <div className="flex flex-col font-poppins">
                        <button
                          className="rounded-xl bg-blue-700 h-7 pl-5 ml-6 text-white w-14"
                          onClick={() => toggleComments(post.id)}
                        >
                          {visibleCommentsPostId === post.id ? <FaComment /> : <FaComment />}
                        </button>
                        <p>view comments</p>
                      </div>
                    </div>

                    <div className="flex  ml-10 mb-4 w-full border "></div>

                    <div className="flex gap-20 justify-around">
                      <div className="flex flex-col font-poppins">
                        <Like postId={post?.id} userId={currentUserId!} />
                        <p>Like</p>
                      </div>
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col font-poppins">
                          <button
                            className="rounded-xl bg-blue-700 h-7 ml-2 pl-5 text-white w-14"
                            onClick={() => toggleCommentForm(post.id)}
                          >
                            {commentForm === post.id ? <FaComment /> : <FaComment />}
                          </button>
                          <p>Comment</p>
                        </div>
                        <div></div>
                      </div>

                      <div className="flex flex-col font-poppins">
                        <button className="ml-2">
                          <FaShare className="text-xl" />
                        </button>
                        <p>Share</p>
                      </div>
                    </div>
                    {visibleCommentsPostId === post.id &&
                      (post.comment && post.comment.length > 0 ? (
                        <div className="mb-3">{renderComments(post.comment)}</div>
                      ) : (
                        <p className="mb-3">No comments yet</p>
                      ))}

                    <div className="w-full">
                      {commentForm === post.id && (
                        <div className="flex  gap-7">
                          <Comments postId={post?.id || ''} refresh={getPost} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end"></div>
                  {decodedToken?.id === post.postIt?.id && (
                    <Dropdown
                      postId={post.id}
                      refresh={getPost}
                      thought={post.thought}
                      feeling={post.feeling!}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col justify-start items-center overflow-y-auto h-fit  mt-30 2xl:w-[52rem] xl:w-[52rem]  lg:w-[45rem] md:w-[40rem] sm:w-[35rem] mx-auto   mb-16 bg-gray-100"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Post postId={posts[0]?.id || ''} refresh={getPost} />
          {error && <p>{error}</p>}
          {posts.map((post) => (
            <div
              className=" flex justify-center shadow-xl  w-full rounded-xl mx-auto   mb-14 text-ellipsis bg-white"
              key={post.id}
            >
              <div className="items-start sm:mr-20 sm:flex-row w-full p-10">
                <div key={post.postIt?.id} className="bg-white  mb-5">
                  <div className="flex bg-white  p-4">
                    <div className="flex gap-1">
                      {post?.postIt?.profile?.path ? (
                        <img
                          className="w-14 h-14  rounded-full "
                          src={post?.postIt?.profile?.path}
                          alt="Profile"
                        />
                      ) : (
                        <img className="w-14 h-14  rounded-full " src="/profilenull.jpg" alt="" />
                      )}

                      <div className="flex gap-1 mb-3 text-nowrap py-3 px-2">
                        <p className="font-medium font-poppins text-lg ">
                          {post.postIt?.details?.first_name}
                        </p>
                        <p className="font-medium font-poppins text-lg">
                          {post.postIt?.details?.last_name}{' '}
                        </p>
                        {post?.feeling ? (
                          <p className="font-poppins pt-[2px] ">
                            {' '}
                            is feeling{' '}
                            <span className="font-poppins font-medium">{post?.feeling}</span>{' '}
                          </p>
                        ) : (
                          <p className=" text-lg font-poppins">shared the post</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className=" mb-3  rounded-2xl break-words">
                    <div
                      className="flex flex-col justify-start items-start mb-4 rounded-lg"
                      key={post.id}
                    >
                      <p className="font-poppins font-medium">{post.thought}</p>
                    </div>

                    <div className="flex flex-col  justify-center items-center pl-10 rounded-2xl">
                      <div className="flex  overflow-hidden rounded-lg pl-10">
                        <div className="rounded-lg ">
                          {post?.postImage && MediaList(post.postImage)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" flex justify-between pl-10 mx-auto mb-1">
                  <div>
                    <p className="pl-5 text-xl text-red-500">
                      <FaHeart />
                    </p>
                    <p>1000 Likes</p>
                  </div>
                  <div className="flex flex-col font-poppins">
                    <button
                      className="rounded-xl bg-blue-700 h-7 pl-5 ml-6 text-white w-14"
                      onClick={() => toggleComments(post.id)}
                    >
                      {visibleCommentsPostId === post.id ? <FaComment /> : <FaComment />}
                    </button>
                    <p>view comments</p>
                  </div>
                </div>

                <div className="flex  ml-10 mb-4 w-full border "></div>

                <div className="flex gap-20 justify-around ml-10">
                  <div className="flex flex-col font-poppins">
                    <Like postId={post?.id} userId={currentUserId!} />
                    <p>Like</p>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col font-poppins">
                      <button
                        className="rounded-xl bg-blue-700 h-7 ml-2 pl-5 text-white w-14"
                        onClick={() => toggleCommentForm(post.id)}
                      >
                        {commentForm === post.id ? <FaComment /> : <FaComment />}
                      </button>
                      <p>Comment</p>
                    </div>
                    <div></div>
                  </div>

                  <div className="flex flex-col font-poppins">
                    <button className="ml-2">
                      <FaShare className="text-xl" />
                    </button>
                    <p>Share</p>
                  </div>
                </div>
                {visibleCommentsPostId === post.id &&
                  (post.comment && post.comment.length > 0 ? (
                    <div className="mb-3">{renderComments(post.comment)}</div>
                  ) : (
                    <p className="ml-10 mb-3">No comments yet</p>
                  ))}

                <div className="w-full">
                  {commentForm === post.id && (
                    <div className="flex  gap-10">
                      <Comments postId={post?.id || ''} refresh={getPost} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end"></div>
              {decodedToken?.id === post.postIt?.id && (
                <Dropdown
                  postId={post.id}
                  refresh={getPost}
                  thought={post.thought}
                  feeling={post.feeling!}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 mb-1 flex-col hidden xl:block ">
        <Notification />
        <div className="fixed top-[38rem] 2xl:w[40rem]  right-1 bg-white shadow-lg rounded-lg">
          <div className="overflow-y-auto overflow-hidden max-h-[21rem] w-full  break-words">
            <User />
          </div>
        </div>
        <div></div>
      </div>
      {sideMenu && (
        <div className=" mb-5 xs:mb-10 flex-col ">
          <Notification />
          <div
            className=" fixed top-[34rem] xs:w-[30rem] overflow-y-auto h-[33rem] lg:w-[40rem] right-1 bg-white  rounded-lg "
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <User />
          </div>
        </div>
      )}
      <button
        className="fixed right-2 z-50 top-8 text-2xl block xl:hidden"
        onClick={() => handleSideClick()}
      >
        {sideMenu ? <FaCircleArrowRight /> : <FaCircleArrowLeft />}
      </button>
    </div>
  );
};

export default ShowPost;

/*import axios from 'axios';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { BsFillSendFill } from 'react-icons/bs';
import { io, Socket as IOSocket } from 'socket.io-client';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { image } from '../../../config/constant/image';
import { PiPhoneCallFill } from 'react-icons/pi';
import { FaVideo, FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    gender: string;
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
  files: FileList;
}

interface Messages {
  id: string;
  message: string;
  image?: {
    id: string;
    path: string;
  };
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
  const [showMessage, setShowMessage] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);

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
    // const windowWidth = window.innerWidth;
    // if (windowWidth < 1580) {
    //   setShowMessageBox(true);
    //   setShowUserBox(false);
    // } else {
    //   setShowMessageBox(false);
    //   setShowUserBox(true);
    // }
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

  useEffect(() => {
    showConnection();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1034) {
         if (window.innerWidth < 1034) {
           setSideMenu(false);
           setShowMessage(true);
         } else {
           setShowMessage(false);
           setSideMenu(true);
         }
      } else {
        setShowMessage(true)
        setSideMenu(true)
      }
     
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sides = () => {
    setSideMenu(!sideMenu);
    setShowMessage(!showMessage);
  };

  return (
    <div className=" font-poppins flex justify-between items-end border">
      <div className=" xl:w-[26rem] mt-32 lg:w-[28rem] xs:w-[25.5rem] justify-start  bg-white pt-5 items-start  ">
        {sideMenu && (
          <div className=" flex flex-col  mb-2 overflow-none  border h-[51.2rem] pt-5">
            <div className="mb-6">
              <h1 className="text-blue-500 font-medium pl-7">Messages</h1>
            </div>
            <div className=" 2xl:w-[22rem] lg:w-[18rem] mb-10 flex gap-5 ml-6 h-10 border bg-gray-100 rounded-lg">
              <button>
                <FiSearch />
              </button>
              <input
                className="outline-none bg-gray-100 w-[20rem] lg:w-[15rem] "
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
                  className={`flex flex-col p-8  h-11 mb-10 justify-center overflow-hidden 2xl:w-[24.9rem] lg:w-[22rem] lg:pl-16 items-center cursor-pointer${
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
        )}

        <div>
          <button
            className="fixed right-2 z-50 top-24 text-2xl block lg:hidden"
            onClick={() => sides()}
          >
            {sideMenu ? <FaCircleArrowRight /> : <FaCircleArrowLeft />}
          </button>
        </div>
      </div>
      <div>
        {showMessage && (
          <div className=" w-screen flex flex-col items-end overflow-hidden">
            <div className="p-4 flex items-end justify-between bg-white"></div>
            <div className="  p-4  justify-start items-start overflow-auto mx-auto 2xl:w-[70rem]  xl:w-[38rem] xs:mr-40 lg:w-[48rem] lg:ml-0 sm:w-[30rem] xs:w-[26rem] bg-white  overflow-y-auto border">
              {/* {connects?.map((connect) => {
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
          })} *
              <div className="flex mt-20 2xl:justify-center sm:mr-56 justify-end  items-end overflow-auto 2xl:w-[40rem] xl:w-[30rem] xs:w-[23rem] lg:w-full ">
                <div className="flex flex-col justify-end overflow-auto hide-scrollbar items-end h-full w-full">
                  {chats?.map((chat, index) => (
                    <div
                      key={`${chat.id} ${index}`}
                      className={`mb-2 p-4 rounded-lg shadow-md mt-5 flex justify-end items-end ${
                        decodedToken?.id === chat?.sender?.id
                          ? 'bg-blue-700 text-white justify-end items-end self-end ml-auto'
                          : 'bg-gray-300 text-black justify-start items-end self-start mr-auto'
                      } max-w-[25rem] break-words`}
                    >
                      <div>
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
              </div>
              <div className="flex w-full justify-end">
                <div className="fixed bottom-20 left-72 justify-end flex ">
                  {toggleEmoji && <EmojiPicker onEmojiClick={emojiHandleSelect} />}
                </div>
              </div>
            </div>
            {connects && (
              <div className="  xl:ml-0 p-4 mb-10 justify-start items-start lg:ml-0 mx-auto 2xl:w-[70rem] xl:w-[43rem] lg:w-[47rem] sm:w-[30rem] xs:w-[26rem] xs:mr-[15rem] bg-white shadow-lg  border">
                <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-4xl mx-auto">
                  <input
                    type="text"
                    {...register('message')}
                    placeholder="Type Here..."
                    className="flex-grow p-2 rounded-l-lg outline-none"
                    onKeyDown={() => socket?.emit('typing', { senders })}
                    required
                  />
                  <div className="flex gap-12 xs:gap-5">
                    <p className="text-2xl pt-3" onClick={() => setToggleEmoji(!toggleEmoji)}>
                      <MdOutlineEmojiEmotions />
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-blue-700 text-2xl   rounded-r-full hover:text-blue-900 transition duration-300"
                    >
                      <BsFillSendFill />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pt-32 mr-64 lg:w-0 xl:mr-80 lg:p-0 block lg:hidden md:hidden sm:hidden xs:hidden lg:pt-32">
        {connects?.map((connect) => {
          return (
            <div className="w-20">
              {senders === connect.id ? (
                <div
                  key={senders}
                  className="flex flex-col justify-start items-center gap-6  h-[40rem] w-72 rounded  text-black"
                >
                  {connect?.profile?.path ? (
                    <img
                      className="h-44 w-44 rounded-full mb-3"
                      src={connect?.profile?.path}
                      alt=""
                    />
                  ) : (
                    <img
                      className="w-44 h-44 rounded-full border mb-3"
                      src="/profilenull.jpg"
                      alt="Default Profile"
                    />
                  )}
                  <p className="font-medium text-xl pl-7">
                    {connect?.details?.first_name} {connect?.details.last_name}
                  </p>
                  <div className="flex gap-7 justify-center ml-8 mb-5">
                    <p className="text-xl bg-gray-200 p-2 rounded-full">
                      <PiPhoneCallFill />
                    </p>
                    <p className="text-xl bg-gray-200 p-2 rounded-full">
                      <FaVideo />
                    </p>
                    <p className="text-xl bg-gray-200 p-2 rounded-full">
                      <IoMdMail />
                    </p>
                  </div>
                  <div className="">
                    <div className="flex pt-2 flex-col mr-24">
                      <div className="mb-5">
                        <p className="text-gray-500">Gender</p>
                        <p>{connect?.details?.gender}</p>
                      </div>
                      <div className="mb-5">
                        <p className="text-gray-500">Email</p>
                        <p>{connect?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p>{connect?.details?.phone_number}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="bg-red-200 p-3 rounded-lg text-red-500 w-32 hover:bg-red-300 hover:text-red-600">
                      Block
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageUser;
 */
