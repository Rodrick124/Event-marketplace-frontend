import React from 'react';
import { AttendeeReservation } from '../pages/Dashboard/MyEvents';
import { useAuth } from '../context/AuthContext';

interface TicketProps {
  reservation: AttendeeReservation;
}

const Ticket: React.FC<TicketProps> = ({ reservation }) => {
  const { user } = useAuth();

  if (!reservation.eventId) {
    return <div>Event details not available.</div>;
  }

  return (
    <div id={`ticket-${reservation._id}`} className="p-6 bg-white font-sans" style={{ width: '400px' }}>
      <div className="border-2 border-gray-300 rounded-lg">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg text-center">
          <h2 className="text-2xl font-bold">EVENT TICKET</h2>
          <p className="text-sm">Admit One</p>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{reservation.eventId.title}</h3>
          <p className="text-gray-600 mb-4">
            {new Date(reservation.eventId.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">ATTENDEE</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">QUANTITY</p>
              <p className="font-medium">{reservation.ticketQuantity}</p>
            </div>
          </div>
          <div className="border-t border-dashed pt-4 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs text-gray-500">RESERVATION ID</p>
              <p className="font-mono text-xs">{reservation._id}</p>
            </div>
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500">QR Code</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;