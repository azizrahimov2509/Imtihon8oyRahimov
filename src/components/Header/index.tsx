import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, selectDarkMode } from "../../store/DarkModeSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaSignOutAlt, FaChartBar } from "react-icons/fa";
import RecipeModal from "../RecipeModal";
import { RootState } from "../../store/bigstore";

interface User {
  displayName?: string;
  email?: string;
  photoURL?: string;
}

function Header() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const [theme, setTheme] = useState(
    localStorage.getItem("darkmode") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("darkmode", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleToggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    dispatch(toggleDarkMode());
  };

  const openModal = () => {
    const modal = document.getElementById("recipe_modal") as HTMLDialogElement;
    modal?.showModal();
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-base-300">
      <div className="container navbar">
        <div className="navbar-start">
          <div className="dropdown ml-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              {user && user.photoURL ? (
                <div className="flex items-center">
                  <img src={user.photoURL} alt="user icon" width={40} />{" "}
                  <p className="ml-2">{user?.displayName}</p>
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14.5a5 5 0 1 0-10 0 5 5 0 0 0 10 0zM14.5 3a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM12 14.5a5 5 0 1 0-10 0 5 5 0 0 0 10 0zM20.5 14.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"
                  />
                </svg>
              )}
            </div>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <p>Name: {user?.displayName}</p>
                <p>Email: {user?.email}</p>
                <div className="card-actions">
                  <button
                    className="btn btn-sm btn-primary btn-block"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          <Link to={"/"} className="btn btn-ghost text-xl">
            Kitchen app
          </Link>
        </div>
        <div className="navbar-end">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 flex flex-col items-center gap-2"
            >
              <li>
                <Link to={"/"} className="btn btn-primary w-44">
                  <FaHome /> Homepage
                </Link>
              </li>
              <li>
                <Link to={"/statistics"} className="btn btn-primary w-44">
                  <FaChartBar /> Statistics
                </Link>
              </li>
              <li>
                <button className="btn btn-primary w-44" onClick={openModal}>
                  <FaPlus /> Create Recipe
                </button>
              </li>
              <li>
                <a onClick={handleLogout} className="btn btn-primary w-44">
                  <FaSignOutAlt /> Logout
                </a>
              </li>
            </ul>
          </div>
          <div className="indicator">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-primary badge-sm indicator-item">
                    {itemCount}
                  </span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
              >
                <div className="card-body">
                  <span className="font-bold text-lg">{itemCount} Items</span>
                  <div className="card-actions">
                    <Link to="/cart" className="btn btn-primary btn-block">
                      View cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              onChange={handleToggleDarkMode}
              checked={darkMode}
            />
            <svg
              className="swap-off fill-current w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            <svg
              className="swap-on fill-current w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>
      <RecipeModal setRefresh={() => {}} />
    </header>
  );
}

export default Header;
