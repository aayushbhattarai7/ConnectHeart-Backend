import { useEffect, useState } from "react";
import axiosInstance from "../../../service/instance";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface LikeProps {
    postId: string;
    userId: string;
    isLiked: boolean;
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

const Like: React.FC<LikeProps> = ({ postId, userId, isLiked }) => {
    const [like, setLike] = useState(isLiked);
    const[allLikes, setAllLikes] = useState<GetLike | null>(null)
    const [likeAuth, setLikeAuth] = useState<Auth |null>(null)
    const toggleLike = async () => {
        try {
            const response = await axiosInstance.post(`/like/${postId}`, {
                userId,

                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLike(!like);
            console.log(response);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const getLike = async (postId: string) => {
        try {
            const response = await axiosInstance.get(`/like/${postId}`);
            setAllLikes(response?.data?.likes);
            console.log(response?.data?.likes);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    useEffect(() => {
        getLike(postId)
    }, [])

    return (
        <div>

            <button
            
                onClick={toggleLike}
                className="text-xl"
                style={{ color: like ? 'red' : 'black' }}>
                {like ? <FaHeart /> : <FaRegHeart />}
            </button>
        </div>

    );
}

export default Like;
