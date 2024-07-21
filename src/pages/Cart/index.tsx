import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/bigstore";
import {
  increment,
  decrement,
  removeFromCart,
  loadCartFromFirebase,
} from "../../store/cartSlice";
import { toast } from "react-hot-toast";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../../farebase/config";

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  photoURL: string;
}

const calculateTotal = (cartItems: CartItem[]) => {
  return cartItems.reduce((acc, item) => acc + item.quantity * 1, 0);
};

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchCartFromFirestore = async () => {
      try {
        const cartCollectionRef = collection(
          db,
          "carts",
          "EZeoGsq6heZJXia80bV8",
          "items"
        );
        const cartSnapshot = await getDocs(cartCollectionRef);

        const cartData: CartItem[] = cartSnapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: data.id,
            title: data.title,
            quantity: data.quantity,
            photoURL: data.photoURL,
            price: data.price,
          } as CartItem;
        });

        dispatch(loadCartFromFirebase(cartData));
      } catch (error) {
        console.error("Error fetching cart from Firestore:", error);
      }
    };

    fetchCartFromFirestore();
  }, [dispatch]);

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

  const handleCheckout = () => {
    toast.success("Ordered successfully!");
  };

  const subtotal = calculateTotal(cartItems);
  const total = subtotal;

  return (
    <div className="container mx-auto p-4 md:p-8 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Your Cart</h1>
      <hr className="mb-4 border-gray-700 dark:border-gray-500" />

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-between ">
          <div className="space-y-4 md:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-md shadow-sm"
              >
                <img
                  src={item.photoURL}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-sm">
                    Total: Rp {(item.quantity * 1).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-black"
                    onClick={() => handleDecrement(item.id)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-black "
                    onClick={() => handleIncrement(item.id)}
                  >
                    +
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded dark:bg-red-700"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-0 md:w-1/3 md:ml-8">
            <div className="p-4 border rounded-md shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex flex-col mb-4">
                <label htmlFor="promo-code" className="mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  id="promo-code"
                  placeholder="Enter promo code"
                  className="p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-800">
                  Apply
                </button>
              </div>
              <div className="mb-4">
                <p>Items: {cartItems.length}</p>
                <h3 className="text-lg font-semibold">
                  Subtotal: Rp {subtotal.toFixed(2)}
                </h3>
              </div>
              <div className="mb-4">
                <p>
                  Promo: <span>Rp 0</span>
                </p>
                <h3 className="text-lg font-semibold">
                  Total: Rp {total.toFixed(2)}
                </h3>
              </div>
              <button
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition dark:bg-green-600 dark:hover:bg-green-700"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
