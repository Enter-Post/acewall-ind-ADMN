import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobalContext } from "@/Context/GlobalProvider";
import { LandingPageCard } from "@/CustomComponent/Card";
import Footer from "@/CustomComponent/Footer";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const cardData = [
  {
    name: "Academic Tutoring",
    description:
      "Academic tutoring includes remediation and enrichment in reading, writing, and mathematics with emphasis in STEM education. Serving grades K-12.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_357701907-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/academic-tutoring ",
  },

  {
    name: "Mentoring and Mental Health Support",
    description:
      "Mentoring and Mental Health - a 360° approach works to improve each client’s sense of self by providing mentoring support services that positively affect the client’s mental health through the promotion and integration of emotional, physical, and mental well-being. Participants will receive one-on-one and group activities to support the overall goal of mental wellness, in addition to, the integration of Social and Emotional Learning (SEL) activities.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_355386233-834697fd-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/mentoring",
  },
  {
    name: "Parent Aide",
    description:
      "Acewall Scholars offers The Holistic Parent Aid program. This program falls within our mentoring department. Our Parenting progam offers a holistic approach to developing effective parenting skills. Providing education on healthy and effective ways to support children through their emotional, physical, mental, and spiritual development, is our goal.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/shutterstock_2329065089-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/parent-aide",
  },
  {
    name: "Test Prep",
    description:
      "Our Test Prep services prepare students to take standardized test by helping improve their overall test scores. Test prep services are offered for the ASVAB, GED, SOL, ACT, SAT, GRE, and LSAT.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/row-students-doing-exam-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/test-prep",
  },
  {
    name: "Internship Support/Placement",
    description:
      "Acewall Scholars will assist students with finding summer programs, internships, and/or apprenticeships, as well as volunteering experience in fields of interest.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/internship+support-placement-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/internship-support/placement",
  },

  {
    name: "College Counseling",
    description:
      "Our college counseling service assists and empowers both students and parents by providing the necessary guidance and information to assist in navigating the college process. ",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/college+counseling-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/college-counseling",
  },
];

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["student", "teacher"]),
});

const LandingPage = () => {
  const navigate = useNavigate();
  const { signUpdata, setSignupData } = useContext(GlobalContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("auth/check-existence", {
        email: data.email,
      });

      setSignupData({ ...data });
      navigate("/signup");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("User with this email already exists.");
      } else {
        console.error("API error:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  console.log(signUpdata, "signUpdata");

  const handleUserType = (value) => {

    setUser(value);
    console.log("Selected User type:", value); // Replace this with theme logic
  };

  return (
    <>
      {/* Top Bar */}

      <div className="flex flex-col ">
        <div className="h-[70vh] bg-cover bg-start bg-no-repeat bg-[url('assets/hero.webp')] ">
          <div className="h-full  relative w-full bg-black/50 backdrop-blur- flex items-start  justify-start">
            <div
              className="flex  flex-col mt-10 justify-center  items-center px-2 md:px-10  md:mt-16 
            text-center"
            >
              <h1 className="text-white text-xl font-semibold tracking-wide mx-23">
                Where the vision is realized. Where the dream is achieved.
              </h1>
              <div className="flex items-center justify-center flex-wrap sm:flex-row flex-col gap-x-2 text-white ml-2">
                <div className="flex items-center text-md whitespace-nowrap">
                  <p>Imagine</p>
                  <Dot size={28} strokeWidth={3} className="-mx-1.5" />
                  <p>Believe</p>
                  <Dot size={28} strokeWidth={3} className="-mx-1.5" />
                  <p>Create</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black flex flex-col lg:flex-row items-center gap-8 lg:gap-20 p-6 lg:p-4 w-full justify-center"
        >
          <div className="bg-black flex flex-col lg:flex-row items-center gap-8 lg:gap-20 p-6 lg:p-4 w-full justify-center">
            <h1 className="text-white text-2xl font-semibold text-center">
              Create an account
            </h1>
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="bg-white text-black rounded-lg px-4 py-2 w-full lg:w-[250px] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full lg:w-[180px] bg-white rounded-lg px-4 py-5">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-xs">Please enter the role</p>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
              <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                <button
                  type="submit"
                  className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-6 py-3 w-full"
                >
                  Create an Account
                </button>
              </div>
            </div>
            <Link to="/login">
              <button
                className="text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-6 py-3 w-full"
              >
                Login
              </button>
            </Link>
          </div>
        </form>
        <section className="flex justify-center">
          <div
            id="additionalServices"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3 w-[95%] md:w-[80%]"
          >
            {cardData.map((card, index) => (
              <div key={index} className="h-full">
                <LandingPageCard
                  name={card.name}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  buttonUrl={card.buttonUrl}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
