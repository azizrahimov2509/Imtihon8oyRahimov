import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/bigstore";
import { increment, decrement, removeFromCart } from "../../store/cartSlice";
import { toast } from "react-hot-toast";

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleIncrement = (id: string) => {
    dispatch(increment(id));
  };

  const handleDecrement = (id: string) => {
    dispatch(decrement(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Removed from cart!");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Your Cart</h1>
      <hr className="mb-4" />

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-md shadow-sm bg-white"
            >
              <img
                src={item.photoURL}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => handleDecrement(item.id)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => handleIncrement(item.id)}
                >
                  +
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
