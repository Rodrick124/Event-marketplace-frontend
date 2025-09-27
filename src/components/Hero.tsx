import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div
      className="relative h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-25"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-center w-full">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Experience Unforgettable</span>
            <span className="block text-blue-400">Live Events</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Book your tickets now and be part of the most exciting events in town. From concerts to sports, we've got you covered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;