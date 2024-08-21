import { NavLink, useLocation } from 'react-router-dom';
import SideBarDetails from './SideBarDetails';

const Header = () => {
  const location = useLocation();
  const targetPath =
    location.pathname !== '/login' && location.pathname !== '/signup' ? '/' : '/login';
  return (
    <div className="relative">
      <header className="fixed top-0 left-0 w-full h-[11vh] bg-white shadow-md z-50">
        <div
          className="font-poppins font-medium flex items-center justify-between 
        p-4 h-full"
        >
          <div>
            <h2 className="pl-5">
              <NavLink to={targetPath}>
                <img className="w-24 h-24 pb-3" src="/logo.png" alt="Logo" />
              </NavLink>
            </h2>
          </div>

          <div className="flex justify-end gap-7 pr-10">
            {location.pathname !== '/login' && location.pathname !== '/signup' && (
              <>
                <NavLink to={'/support'}>Support</NavLink>
                <NavLink to={'/faq'}>FAQ</NavLink>
              </>
            )}

            {location.pathname === '/login' && (
              <div className="justify-end flex items-end w-full">
                <NavLink
                  to="/signup"
                  className="text-white bg-blue-600 w-20 px-4
                 py-1 rounded-lg h-8 transition duration-300 ease-in-out hover:bg-blue-900"
                >
                  Signup
                </NavLink>
              </div>
            )}

            {location.pathname === '/signup' && (
              <div className="justify-end flex items-end w-full px-10">
                <NavLink
                  to="/login"
                  className="text-white bg-blue-600 w-20 px-4 py-1
                 rounded-lg h-8 transition duration-300 ease-in-out hover:bg-blue-900"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      <SideBarDetails />
    </div>
  );
};

export default Header;
