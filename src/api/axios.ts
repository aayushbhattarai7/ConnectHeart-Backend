import axios from "axios";

export const Auth = () => {
     const signupAxios = axios.post('/api/user/signup')
    const loginAxios = axios.post('/api/user/login')

}