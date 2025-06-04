import { Outlet } from 'react-router-dom';
import bgImage from '../assets/unsplash.jpg';

const AuthLayout = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;