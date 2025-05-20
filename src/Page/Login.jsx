import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import acewallshort from "../assets/acewallshort.png";
import Footer from "@/CustomComponent/Footer";
import ReviewsSlider from "@/CustomComponent/LoginComponent/ReviewsSlider";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { GlobalContext } from "@/Context/GlobalProvider";

const Login = () => {
  const { login } = useContext(GlobalContext);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      await login(formData);
      setLoginError(""); // clear previous errors
      // Optionally navigate somewhere on successful login
      // navigate("/student/dashboard");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      console.error(errorMessage);
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to={"/"} className="text-sm md:text-base">
            Return to Home
          </Link>
          <Link to={"/"} className="text-sm  md:text-base">
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-center text-2xl md:text-3xl text-gray-800 font-normal mb-8">
            Student Log-in Page
          </h1>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Login Form */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}

                </div>
                <div className="mb-8">
                  <label htmlFor="password" className="block text-gray-600 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <p className="text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}

                </div>

                {loginError && (
                  <p className="text-sm text-red-500 mb-4">{loginError}</p>
                )}


                <div className="flex justify-between items-center">
                  <Link
                    to={"/TeacherLogin"}
                    className="text-sm font-bold text-green-500"
                  >
                    Log in as Teacher
                  </Link>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded transition-colors"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>

            {/* Testimonial Section */}
            <ReviewsSlider />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
