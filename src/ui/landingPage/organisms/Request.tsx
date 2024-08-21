import { useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import { FaHeartCirclePlus, FaHeartCircleXmark } from 'react-icons/fa6';
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

const Request = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const showRequest = async () => {
    try {
      const response = await axiosInstance.get('/connect/requests', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests(response.data?.viewRequest);
      console.log(response?.data.viewRequest, 'hajahah');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const AcceptRequest = async (id: string) => {
    try {
      const response = await axiosInstance.patch(`/connect/accept/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests((prevRequests) => prevRequests.filter((request) => request.sender.id !== id));
      console.log(response, 'hojeuuh');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const Reject = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/connect/reject/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRequests((prevRequests) => prevRequests.filter((request) => request.sender.id !== id));
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching post');
      } else {
        setError('Error while fetching post');
      }
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/userProfile/${userId}`);
  };

  useEffect(() => {
    showRequest();
  }, []);
  return (
    <div className="bg-gray-100 h-screen">
      <div className="justify-center items-center flex p-5 bg-gray-200">
        <h1 className="ml-20 font-poppins font-medium">Connect Requests</h1>
      </div>
      <div className="ml-96 mt-10 justify-start w-[92rem] h-auto p-8 items-start bg-gray-100">
        <div className="justify-start flex flex-wrap gap-8 mb-10 overflow-hidden">
          {error && <p>{error}</p>}
          {requests.length === 0 ? (
            <div className="flex flex-col mt-14 items-center justify-center w-full h-[75vh] bg-gray-100">
              <div className=" shadow-lg rounded-lg p-6 max-w-md text-center">
                <div className="text-4xl text-gray-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-16 h-16 mx-auto"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m13 4a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-700">
                  No Connect Request Received Yet
                </h2>
                <p className="text-gray-600 mt-2">
                  You're all set! We'll notify you once a connect request comes in.
                </p>
              </div>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col p-5 mb-10 justify-center items-center w-64 bg-white shadow-lg rounded-lg"
              >
                <div onClick={() => handleUserClick(request.sender.id)}>
                  <div className="h-44 w-44 mb-5 shadow-lg">
                    {request?.sender?.profile?.path ? (
                      <img className="rounded-full" src={request.sender.profile.path} alt="" />
                    ) : (
                      <img className="rounded-full" src="/profilenull.jpg" alt="" />
                    )}
                  </div>
                  <div className="gap-2 mb-5 flex flex-col font-poppins font-medium">
                    <p>
                      {request.sender.details.first_name} {request.sender.details.last_name}
                    </p>
                    <p>{request.sender.details.gender}</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <button
                    onClick={() => AcceptRequest(request.sender.id)}
                    className="border border-blue-400 bg-blue-600 text-white rounded-lg w-20 p-2 pl-8"
                    type="button"
                  >
                    <FaHeartCirclePlus />
                  </button>
                  <button
                    onClick={() => Reject(request.sender.id)}
                    className="border border-red-400 bg-red-600 text-white rounded-lg w-20 pl-8"
                    type="button"
                  >
                    <FaHeartCircleXmark />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Request;
