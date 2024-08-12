import axios from "axios";
import axiosInstance from "../../../service/instance";
import { useEffect, useState } from "react";
import User from "./User";
import { useNavigate } from "react-router-dom";

interface Connection {
    id: string
    email?: string,
    username?: string;
    details: {
        first_name?: string,
        last_name?: string,
        phone_number?: string
    },
    profile: {
        id?:string,
        path?:string
    }
}

const Connection = () => {
    const [connects, setConnects] = useState<Connection[]>([])
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const showConnection = async () => {
        try {
            const response = await axiosInstance.get('/connect/friends', {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setConnects(response?.data?.friends)
            console.log(response?.data?.friends)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching connection')
            } else {
                setError('Error while fetching connection')
            }
        }
    }


    const Remove = async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/connect/remove/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setConnects((prevConnect) => prevConnect.filter((connect) => connect?.id  !== id));
            console.log(response)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error while fetching post')
            } else {
                setError('Error while fetching post')
            }
        }
    }

    const handleUserClick = (userId: string) => {
        navigate(`/userProfile/${userId}`);
      };

      const handleChatClick = (userId:string) => {
        navigate(`/message/${userId}`)
      }

    useEffect(() => {
        showConnection()
    }, [])
    return (
        <div>
           
           
        <div className=" ml-96 justify-start w-fit  p-8 items-start h-screen">
        <div className="justify-center items-center mt-10 flex p-5">
            <h1 className="ml-20 font-poppins font-medium">Connection</h1>
            </div>
            <div className="justify-start flex flex-wrap gap-8 mb-10 overflow-hidden">
           
            {error && <p>{error}</p>}
            {connects?.map(connect => (

                <div key={connect?.id}  className=" flex flex-col p-5 mb-10 justify-center items-center w-64 shadow-xl">
                   <div className="" onClick={() => handleUserClick(connect?.id)} >
            {connect?.profile?.path ? (
                <img className="h-44 w-44 rounded-2xl mb-3" src={connect?.profile?.path} alt="Profile" />
            ) : (
                <img className="" src="/profilenull.jpg" alt="Default Profile" />
            )}
                    <div key={connect?.id} className="gap-2 mb-5 flex mr-16 font-poppins font-medium">
                        <p>{connect?.details?.first_name}</p>
                        <p>{connect?.details?.last_name}</p>
                    </div>
                    </div>

                    <button onClick={() => Remove(connect?.id)} className="border border-blue-400 bg-blue-600 text-white rounded-lg w-40" >Remove</button>
                    <button onClick={() =>handleChatClick(connect?.id) }>Chat</button>
                </div>
                
            ))}
             </div>
             
             <div className="border border-gray-300 mb-10"></div>
             <User/>
        </div>
        </div>

    )

}
export default Connection