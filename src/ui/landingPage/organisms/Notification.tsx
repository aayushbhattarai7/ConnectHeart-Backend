import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface Request {
  id: string;
  sender: {
    id: string;
    email?: string;
    username?: string;
    details: {
      first_name?: string;
      middle_name?: string;
      last_name?: string;
      gender?: string;
    };
    profile: {
      id?: string;
      path?: string;
    };
  };
}
const Notification = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate()
  const request = async () => {

    try {
      const response = await axiosInstance.get('/connect/requests', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests(response.data?.viewRequest);
      console.log(response, 'reqqqqqqq');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  const getRequest = () => {
    navigate('/requests')
  }
  useEffect(() => {
    request();
  },[]);
  
  return (
    <div className=' fixed top-[7.5rem] rounded-lg right-2 h-[50vh] shadow-lg w-[29rem]  bg-white flex justify-center items-start '>
    <div className="w-[30rem] flex flex-col justify-center items-center overflow-y-auto">
    <h1 className='mt-5 text-xl font-poppins font-medium'>Notification</h1>
    {requests.length ===0 ? (
      <div className='h-[40vh] flex justify-center items-center'>
      <p>No Notification Yet</p>
      </div>
    ):(
      <div> {requests?.map((request) => (
        <div className='bg-blue-300 w-full h-16 rounded-lg items-center justify-start flex p-5 mb-2 gap-5'>
          <div className='w-10 h-10 '>
            {request?.sender?.profile?.path?  (
              <img className='rounded-full' src={request.sender.profile.path} alt="" />
            ):(
                <img className='rounded-full' src="/profilenull.jpg" alt="" />
            )}
          </div>
           <p className=' font-poppins font-bold' onClick={getRequest}>
          {request.sender.details.first_name} {request.sender.details.last_name} <span className='font-normal'>wants to connect with you</span>
        </p>

        </div>
       
      ))}</div>
     
    )}
      
    </div>
    </div>
  );
};

export default Notification;
