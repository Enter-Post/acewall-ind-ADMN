import { Link } from "react-router-dom";
import acewallshort from "../assets/acewallshort.png";
import Footer from "@/CustomComponent/Footer";
import { useContext, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalContext } from "@/Context/GlobalProvider";


const schema = z.object({
  email: z.string().email(),
  password: z.string()
});

const TeacherLogin = () => {
 const { login } = useContext(GlobalContext);

//  console.log(login, "login in teacherlogin");
 
  const schema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(8),
    
  });

const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });


  const onSubmit = async (formData) => {
    
    login(formData);  
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
            Teacher Log-in Page
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
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="block text-gray-600 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={"/Login"}
                    className="text-sm font-bold text-green-500"
                  >
                    Login as Student
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
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32">
                  <img src={acewallshort} alt="" />
                </div>
              </div>
              <h2 className="text-xl text-gray-800 font-medium mb-2 text-center md:text-left">
                Teachers Love Acewall Scholars
              </h2>
              <blockquote className="text-gray-600 mb-4 text-center md:text-left">
                <span className="text-2xl">"</span> Acewall Scholars is an
                amazing program. They have helped me with numerous subjects,
                including Biology, Algebra, and Spanish….I not only aced the
                midterm but I got the highest score out of all of Spanish 1,
                thank you.
                <span className="text-2xl">"</span>
              </blockquote>
              <div className="text-center md:text-left">
                <p className="font-medium text-gray-800">Sara Wilsson</p>
                <p className="text-gray-600">Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default TeacherLogin;
