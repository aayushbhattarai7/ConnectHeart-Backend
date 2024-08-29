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
import { useSocket } from '../../../contexts/OnlineStatus';

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
const socket = useSocket()
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

