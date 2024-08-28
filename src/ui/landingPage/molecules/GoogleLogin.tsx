import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axiosInstance from '../../../service/instance';
import { useNavigate } from 'react-router-dom';
interface CustomCredentialResponse {
  credential?: string;
}
const GoogleAuth = () => {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const handleSuccess = async (credentialResponse: CustomCredentialResponse) => {
    const id = credentialResponse.credential;
    console.log(id, 'aaa');
    try {
      if (typeof id !== 'string' || id.trim() === '') {
        console.log('Invalid token', id);
        return;
      }
      const response = await axiosInstance.post('/user/google', { id });
      console.log(response.data.data.tokens, 'jajajaja');
      navigate('/');
      const { accessToken } = response.data.data.tokens;
      sessionStorage.setItem('accessToken', accessToken);

      console.log(response);
    } catch (error) {
      console.log('🚀 ~ handleSuccess ~ error:', error);
    }
  };
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
