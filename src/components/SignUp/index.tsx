import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError,
} from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../../farebase/config";
import { Link, useNavigate } from "react-router-dom";
import bg1 from "../../../public/bgfood.jpg";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
  name: string;
  photo: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    photo: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.photo,
      });

      const userData = {
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Welcome, ${user.displayName}!`);
      navigate("/");
    } catch (error) {
      const authError = error as AuthError;
      const errorCode = authError.code;
      if (errorCode === "auth/email-already-in-use") {
        setError("You already have an account. Please log in.");
      } else {
        setError(authError.message);
      }
    }

    setFormData({ email: "", password: "", name: "", photo: "" });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const userData = {
          displayName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success(`Welcome, ${user.displayName}!`);
        navigate("/");
      })
      .catch((error: AuthError) => {
        setError(error.message);
      });
  };

  const togglePasswordShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 relative">
      <img
        src={bg1}
        alt="bg1"
        className="absolute w-full h-screen object-cover"
      />
      <form
        className="w-full max-w-md p-8 bg-slate-600 bg-opacity-40 rounded-lg shadow-lg border z-20 border-gray-300"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Sign Up
        </h2>
        <div className="form-control mb-4">
          <label className="label" htmlFor="name">
            <span className="label-text text-white text-base font-semibold">
              Name
            </span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name..."
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label" htmlFor="email">
            <span className="label-text text-white text-base font-semibold">
              Email
            </span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
        <div className="form-control mb-4 relative">
          <label className="label" htmlFor="password">
            <span className="label-text text-white text-base font-semibold">
              Password
            </span>
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password..."
            className="input input-bordered w-full pr-10"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <button
            type="button"
            className="absolute right-0 pr-3 flex items-center text-gray-400 bottom-4"
            onClick={togglePasswordShow}
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5 text-gray-600" />
            ) : (
              <FaEye className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        <div className="form-control mb-4">
          <label className="label" htmlFor="photo">
            <span className="label-text text-white text-base font-semibold">
              Photo URL
            </span>
          </label>
          <input
            id="photo"
            type="text"
            placeholder="Enter the photo URL..."
            className="input input-bordered w-full"
            value={formData.photo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, photo: e.target.value }))
            }
          />
        </div>
        {error && (
          <div className="text-[#ef3434] font-semibold mb-4 text-lg">
            {error}
          </div>
        )}
        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </div>
        <div className="form-control mt-4">
          <button
            type="button"
            className="btn w-full btn-accent"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-6 h-6" /> Continue with Google
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-white font-semibold text-base">
            Already have an account?
            <Link to="/login" className="link link-primary ml-1 text-[#36f436]">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
