import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Connecting People Through Events
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
            Welcome to Event Marketplace, your premier destination for discovering and booking tickets for events of all kinds.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose prose-lg text-gray-500">
              <h3>Our Mission</h3>
              <p>
                Our mission is to make finding and attending events easier and more enjoyable than ever before. We believe in the power of live experiences to bring people together, create lasting memories, and enrich lives.
              </p>
              <h3>For Attendees</h3>
              <p>
                Browse a vast selection of events, from music concerts and sports games to workshops and community gatherings. Our platform provides a seamless and secure booking experience, ensuring you never miss out on the action.
              </p>
              <h3>For Organizers</h3>
              <p>
                We provide a powerful suite of tools for event organizers to create, manage, and promote their events. From ticket sales and analytics to attendee management, our dashboard helps you host successful events with ease.
              </p>
            </div>
            <div className="relative h-64 md:h-auto">
              <img
                className="rounded-lg shadow-xl object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="People at an event"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;