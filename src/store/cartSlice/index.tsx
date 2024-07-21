import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment as firebaseIncrement,
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

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
        updateDoc(doc(db, "cart", "Sq9hZ7Mo4guHBgvkeuMC"), {
          quantity: firebaseIncrement(1),
        });
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        state.items.push(newItem);
        setDoc(doc(db, "cart", newItem.id), newItem);
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        updateDoc(doc(db, "cart", item.id), {
          quantity: firebaseIncrement(1),
        });
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateDoc(doc(db, "cart", item.id), {
          quantity: firebaseIncrement(-1),
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      deleteDoc(doc(db, "cart", action.payload));
    },
  },
});

export const { addToCart, increment, decrement, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
export type { CartState, CartItem };
