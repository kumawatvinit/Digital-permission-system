import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Navbar } from './Navbar';

export const Layout = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};