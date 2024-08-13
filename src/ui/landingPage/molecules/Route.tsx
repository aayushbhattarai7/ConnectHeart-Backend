import Header from '../organisms/Header';
import { Outlet } from 'react-router-dom';
export function Route() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
