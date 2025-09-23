import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const { cart, isLoading, error, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Wrap cart operations in try/catch to prevent unhandled promise rejections.
  // The error is already set in the context, so we just need to catch it here.
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      try {
        await updateQuantity(itemId, newQuantity);
      } catch (err) {
        console.error('Failed to update item quantity:', err);
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handleCheckout = () => {
    // This would navigate to the checkout flow
    // For now, we can just show an alert
    alert('Proceeding to checkout!');
    // navigate('/checkout');
  };

  const subtotal = cart?.items.reduce((sum, item) => sum + item.eventId.price * item.quantity, 0) || 0;

  if (isLoading && !cart) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-12 text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto my-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any events to your cart yet.</p>
        <Link to="/events" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Explore Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-12 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Items ({cart.items.length})</h2>
              <button onClick={handleClearCart} className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50" disabled={isLoading}>
                Clear Cart
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {cart.items.map(item => (
                <div key={item._id} className="p-4 flex items-start gap-4">
                  <img src={item.eventId.imageUrl} alt={item.eventId.title} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-grow">
                    <Link to={`/events/${item.eventId._id}`} className="font-semibold text-lg hover:text-blue-600">{item.eventId.title}</Link>
                    <p className="text-sm text-gray-500">{new Date(item.eventId.date).toLocaleDateString()}</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">${item.eventId.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border rounded-md">
                      <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1 || isLoading}>
                        <FaMinus size={12} />
                      </button>
                      <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity >= item.eventId.availableSeats || isLoading}>
                        <FaPlus size={12} />
                      </button>
                    </div>
                    <button onClick={() => handleRemoveItem(item._id)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={isLoading}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>Taxes & Fees</p>
                <p>Calculated at checkout</p>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <button onClick={handleCheckout} className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300" disabled={isLoading}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;