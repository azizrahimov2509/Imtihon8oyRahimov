import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment as firebaseIncrement,
  collection,
} from "firebase/firestore";
import { db } from "../../farebase/config";

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  photoURL: string;
}

interface CartState {
  items: CartItem[];
}

const loadCartFromLocalStorage = (): CartItem[] => {
  const cartData = localStorage.getItem("cartItems");
  return cartData ? JSON.parse(cartData) : [];
};

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const initialState: CartState = {
  items: loadCartFromLocalStorage(),
};

const CART_DOC_ID = "EZeoGsq6heZJXia80bV8";
const cartCollectionRef = collection(db, "carts", CART_DOC_ID, "items");

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
        updateDoc(doc(cartCollectionRef, item.id), {
          quantity: firebaseIncrement(1),
        });
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        state.items.push(newItem);
        setDoc(doc(cartCollectionRef, newItem.id), newItem);
      }
      saveCartToLocalStorage(state.items);
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        updateDoc(doc(cartCollectionRef, item.id), {
          quantity: firebaseIncrement(1),
        });
        saveCartToLocalStorage(state.items);
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateDoc(doc(cartCollectionRef, item.id), {
          quantity: firebaseIncrement(-1),
        });
        saveCartToLocalStorage(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      deleteDoc(doc(cartCollectionRef, action.payload));
      saveCartToLocalStorage(state.items);
    },
    loadCartFromFirebase: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCartToLocalStorage(state.items);
    },
  },
});

export const {
  addToCart,
  increment,
  decrement,
  removeFromCart,
  loadCartFromFirebase,
} = cartSlice.actions;
export default cartSlice.reducer;
export type { CartState, CartItem };
