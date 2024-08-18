import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

interface LikeProps {
  postId: string;
  userId: string; // ID of the currently logged-in user
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

const Like: React.FC<LikeProps> = ({ postId, userId }) => {
  const [like, setLike] = useState<boolean>(false);
  const [allLikes, setAllLikes] = useState<GetLike | null>(null);

  // Function to toggle like status
  const toggleLike = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');

      // Post request to toggle like
      await axiosInstance.post(
        `/like/${postId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch the latest like status
      getLike(postId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Function to get the like status for the post
  const getLike = async (postId: string) => {
    try {
      const response = await axiosInstance.get(`/like/${postId}`);
      const likes = response.data.likes;
      setAllLikes(response.data);

      // Check if the current user has liked the post
      const userLiked = likes.some((like: Like) => like.auth.id === userId);
      setLike(userLiked);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  useEffect(() => {
    // Fetch the like status when the component mounts or postId changes
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
