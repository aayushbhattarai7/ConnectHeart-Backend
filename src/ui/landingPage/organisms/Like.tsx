import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

interface LikeProps {
  postId: string;
}

interface Auth {
  id: string;
}

interface Like {
  id: string;
  auth: Auth;
  isLiked: boolean;
}

interface GetLike {
  postId: string;
  likes: Like[];
}

const Like: React.FC<LikeProps> = ({ postId }) => {
  const [like, setLike] = useState<boolean>(false);
  const [allLikes, setAllLikes] = useState<GetLike | null>(null);

  const toggleLike = async () => {
    try {
      const userId = sessionStorage.getItem('accessToken');

      const response = await axiosInstance.post(
        `/like/${postId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userId}`,
          },
        },
      );
      setLike(!like);
      getLike(postId);
      console.log(response);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getLike = async (postId: string) => {
    try {
      const response = await axiosInstance.get(`/like/${postId}`);
      const likes = response?.data?.likes || [];
      setAllLikes(response.data);

      const userId = sessionStorage.getItem('accessToken');
      const userLiked = likes.some((like: Like) => like.auth.id === userId);
      setLike(userLiked);

      console.log(response?.data?.likes);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  useEffect(() => {
    getLike(postId);
  }, [postId]);

  return (
    <div>
      <button onClick={toggleLike} className="text-xl" style={{ color: like ? 'red' : 'black' }}>
        {like ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default Like;
