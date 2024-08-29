import Login from './ui/landingPage/organisms/Login';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Route } from './ui/landingPage/molecules/Route';
import Signup from './ui/landingPage/organisms/Signup';
import ShowPost from './ui/landingPage/organisms/ShowPost';
import Request from './ui/landingPage/organisms/Request';
import Connection from './ui/landingPage/organisms/Connection';
import User from './ui/landingPage/organisms/User';
import Profile from './ui/landingPage/organisms/Profile';
import Settings from './ui/landingPage/organisms/Settings';
import Support from './ui/landingPage/organisms/Support';
import Faq from './ui/landingPage/organisms/Faq';
import UserProfile from './ui/landingPage/organisms/UserProfile';
import MessageUser from './ui/landingPage/organisms/MessageUser';
import './App.css';
import { SocketProvider } from './contexts/OnlineStatus';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Route />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      { path: '', element: <ShowPost /> },
      {
        path: '/connect',
        element: <Connection />,
      },
      {
        path: '/requests',
        element: <Request />,
      },
      {
        path: '/users',
        element: <User />,
      },

      {
        path: '/message',
        element: <MessageUser />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/support',
        element: <Support />,
      },
      {
        path: '/faq',
        element: <Faq />,
      },
      {
        path: '/userProfile/:userId',
        element: <UserProfile />,
      },
     
    ],
  },
]);
function App() {
  return (
    <>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </>
  );
}

export default App;
