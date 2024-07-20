import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Recipes from "./pages/Recipes";

interface RedirectProps {
  children: React.ReactNode;
}

const Redirect: React.FC<RedirectProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "false");
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <Redirect>
        <Layout />
      </Redirect>
    ),
    children: [
      {
        index: true,
        element: <Recipes />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
