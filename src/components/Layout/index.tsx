import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "../Header";

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

export default function Layout() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <Header />
      <main className="my-5">
        <Outlet />
      </main>
      <footer className="footer p-10 bg-base-300 text-base-content">
        <div className="text-center">
          <p>
            &copy; 2024 All rights reserved by{" "}
            <Link to="https://github.com/azizrahimov2509/Imtihon8oyRahimov">
              Rahimov Aziz
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
