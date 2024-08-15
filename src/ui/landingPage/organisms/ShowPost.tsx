import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import Comments from '../molecules/Comment';
import ReplyComment from '../molecules/ReplyComment';
import { FaComment } from 'react-icons/fa';
import axios from 'axios';
import Post from './Post';
import { useNavigate } from 'react-router-dom';
import Like from './Like';

interface Post {
  id: string;
  thought?: string;
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
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const navigate = useNavigate();

  const getPost = async () => {
    try {
      const response = await axiosInstance.get('/post/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🚀 ~ getPost ~ response:', response);

      setPosts(response.data?.posts);
      setCurrentUserId(response.data?.userId || '');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching posts');
      } else {
        setError('Error while fetching posts');
      }
    }
  };

  const showComment = () => {
    setShowComments(!showComments);
  };

  const renderComments = (comments: Comment[], isChild: boolean = false) => {
    if (!showComments) return null;

    return comments.map((cmt) => (
      <div key={cmt?.id} className="flex justify-start items-center">
        <div
          key={cmt.id}
          className={`relative mb-4 ${isChild ? 'ml-7' : 'ml-4'}
                 p-4 rounded-md bg-gray-50 shadow-sm `}
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
              <p className="mt-1">
                {cmt?.commentAuth?.details?.first_name} {cmt?.commentAuth?.details?.last_name}{' '}
              </p>
            </div>

            <p className="text-gray-800 bg-gray-200 w-fit p-2 rounded-md">{cmt.comment}</p>
            <button
              onClick={() => setReplyCommentId(cmt.id || null)}
              className="mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
            >
              {' '}
              Reply
            </button>

            {replyCommentId === cmt.id && (
              <div className="mt-2  p-4 rounded-md">
                <ReplyComment
                  postId={posts[0]?.id || ''}
                  commentId={cmt.id || ''}
                  refresh={getPost}
                />
              </div>
            )}
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
          const isImage = path?.match(/\.(jpeg|jpg|gif|png)$/);
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

  const handleUserClick = (userId: string) => {
    navigate(`/userProfile/${userId}`);
    //
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="mt-20 flex flex-col h-screen ">
      <div
        className="flex flex-col justify-start items-center overflow-y-auto h-screen mt-30  w-maxx ml-72 
            shadow-xl   p-10 mb-16 bg-gray-100"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <div className="flex justify-end items-start">
          <Post postId={posts[0]?.id || ''} refresh={getPost} />
        </div>

        {error && <p>{error}</p>}
        {posts.map((post) => (
          <div className="shadow-xl p-10 mb-16 text-ellipsis bg-white" key={post.id}>
            <div
              key={post.postIt?.id}
              className="bg-white  mb-5"
              onClick={() => handleUserClick(post?.postIt?.id)}
            >
              <div className="flex bg-white  p-4">
                {post?.postIt?.profile?.path ? (
                  <img
                    className="w-16 h-16  rounded-full "
                    src={post?.postIt?.profile?.path}
                    alt="Profile"
                  />
                ) : (
                  <img className="w-16 h-16  rounded-full " src="/profilenull.jpg" alt="" />
                )}

                <div
                  className="flex gap-1 p-5 mb-3 "
                  onClick={() => handleUserClick(post?.postIt?.id)}
                >
                  <p className="font-medium font-poppins text-lg">
                    {post.postIt?.details?.first_name}
                  </p>
                  <p className="font-medium font-poppins text-lg">
                    {post.postIt?.details?.last_name}{' '}
                  </p>
                  {post?.feeling ? (
                    <p className="font-poppins">
                      {' '}
                      is feeling <span className="font-poppins font-medium">
                        {post?.feeling}
                      </span>{' '}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border mb-3 max-w-[45rem] p-2 rounded-2xl break-words">
                <div
                  className="flex flex-col justify-start items-start mb-4 rounded-lg"
                  key={post.id}
                >
                  <p className="font-poppins font-medium">{post.thought}</p>
                </div>

                <div className="flex flex-col  justify-center items-center w-imgw rounded-2xl">
                  <div className="flex w-imgw overflow-hidden rounded-lg pr-4">
                    <div className="rounded-lg ">
                      {post?.postImage && MediaList(post.postImage)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-10">
              <Like postId={post?.id} />
              <button
                className="rounded-xl bg-blue-700 h-7 pl-5 text-white w-14"
                onClick={showComment}
              >
                {showComments ? <FaComment /> : <FaComment />}
              </button>
            </div>
            {post.comment && (
              <div className="">
                <div className="w-fit h-auto">
                  {showComments && <Comments postId={post.id || ''} refresh={getPost} />}
                </div>
                {renderComments(post.comment)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowPost;