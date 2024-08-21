import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import Comments from '../molecules/Comment';
import ReplyComment from '../molecules/ReplyComment';
import { FaComment } from 'react-icons/fa';
import axios from 'axios';
import Post from './Post';

interface Post {
  id?: string;
  thought?: string;
  feeling?: string;
  postImage?: PostMedia[];
  comment?: Comment[];
  postIt?: {
    id?: string;
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

const UserPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);

  const getPost = async () => {
    try {
      const response = await axiosInstance.get('/post/user/posts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🚀 ~ getPost ~ response:', response.data?.displayPost);
      setPosts(response.data?.displayPost);
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
          className={`relative mb-4 ${isChild ? 'ml-7' : 'ml-4'} p-4 rounded-md bg-gray-50 shadow-sm `}
        >
          {isChild && (
            <div className="absolute top-0 left-0 w-1 border-l-2 border-gray-300 h-full"></div>
          )}
          <div className="">
            <div className="flex gap-2 p-2">
              <img className="w-8 h-8  rounded-full " src={cmt?.commentAuth?.profile?.path} />
              <p className="mt-1">
                {cmt?.commentAuth?.details?.first_name} {cmt?.commentAuth?.details?.last_name}
              </p>
            </div>
            <p className="text-gray-800 bg-gray-200 w-fit p-2 rounded-md">{cmt.comment}</p>
            <button
              onClick={() => setReplyCommentId(cmt.id || null)}
              className="mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
            >
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
      <div>
        {medias.map((media) => {
          const { id, path } = media;
          const isImage = path?.match(/\.(jpeg|jpg|gif|png)$/);
          const isVideo = path?.match(/\.(mp4|webm|ogg)$/);
          return (
            <div key={id}>
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

  return (
    <div className=''>
      <div className="flex flex-col justify-center w-[59rem] pr-64 mt-16 items-center">
        {posts.length > 0? (
          <div>
{posts.map((post) => (

  <div
    className="shadow-xl p-10 mb-16 bg-gray-100"
    style={{
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    }}
    key={post.id}
  >
    <div key={post.postIt?.id} className="bg-white  mb-5">
      <div className="flex bg-gray-100">
        <div className="flex gap-2 p-2">
          {post?.postIt?.profile?.path ? (
            <img
              className="w-16 h-16  rounded-full "
              src={post?.postIt?.profile?.path}
              alt="Profile"
            />
          ) : (
            <img
              className="w-16 h-16  rounded-full "
              src="/profilenull.jpg"
              alt="Default Profile"
            />
          )}
        </div>
        <div className="flex gap-1 p-5 mb-3 ">
          <p className="font-medium font-poppins text-lg">
            {post.postIt?.details?.first_name}
          </p>
          <p className="font-medium font-poppins text-lg">
            {post.postIt?.details?.last_name}
          </p>
        </div>
      </div>
      <div className=" border border-gray-100 mb-3 p-2 rounded-2xl">
        <div
          className="flex flex-col justify-start items-start mb-4 rounded-lg"
          key={post.id}
        >
          <p className="font-poppins font-medium">{post.thought}</p>

          <p className="font-poppins font-medium">{post.feeling}</p>
        </div>
        <div className="flex flex-col  justify-center items-center w-imgw rounded-2xl ">
          <div className="flex w-imgw overflow-hidden rounded-lg pr-4">
            {post.postImage?.map((image) => (
              <div className="rounded-lg" key={image.id}>
                {post?.postImage && MediaList(post.postImage)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <button
      className="rounded-xl bg-blue-700 h-7 pl-5 text-white w-14"
      onClick={showComment}
    >
      {showComments ? <FaComment /> : <FaComment />}
    </button>
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
        ):(
          <p>No Post Yet</p>
        )}
        
    </div>
    </div>

  );
};

export default UserPost;
