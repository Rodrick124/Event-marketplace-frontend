import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Payment } from './Dashboard/MyPayments';

const ReceiptPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const payment: Payment | undefined = location.state?.payment;

  useEffect(() => {
    if (!payment) {
      // Redirect if the page is accessed directly without state
      navigate('/dashboard/payments');
    }
  }, [payment, navigate]);

  if (!payment) {
    return null; // Or a loading/error state
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link to="/dashboard/payments" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Payments
          </Link>
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Print Receipt
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg printable-content" id="receipt">
          <header className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Receipt</h1>
              <p className="text-gray-500">Payment ID: {payment._id}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">Event Reservation</h2>
              <p className="text-sm text-gray-500">event-marketplace.com</p>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Billed To</h3>
              <p className="text-gray-800 font-medium">{user?.name}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Date</h3>
              <p className="text-gray-800 font-medium">{new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Summary</h3>
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Event</th>
                        <th scope="col" className="py-3.5 px-3 text-right text-sm font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{payment.eventId?.title || 'Event details unavailable'}</td>
                        <td className="py-4 px-3 text-right text-sm text-gray-700">${payment.amount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th scope="row" className="pt-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Total</th>
                        <td className="pt-4 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">${payment.amount.toFixed(2)} {payment.currency?.toUpperCase()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Thank you for your purchase!</p>
            <p>If you have any questions, please contact support@event-marketplace.com.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;