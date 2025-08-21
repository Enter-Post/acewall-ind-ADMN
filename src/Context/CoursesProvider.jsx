import { axiosInstance } from "@/lib/AxiosInstance";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GlobalContext } from "./GlobalProvider";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courseLoading, setCourseLoading] = useState(false);
  const { user } = useContext(GlobalContext);
  let [course, setCourse] = useState({
    basics: {},
    chapters: [],
    createdby: user?._id,
  });
  const [quarters, setQuarters] = useState([])

  // <<<<<<< Messages
  //   // console.log(course, "course");
  // =======
  //   // const uploadCourse = async () => {
  // >>>>>>> keshaUpdates-23/4

  //   // };

  return (
    <CourseContext.Provider
      value={{
        course,
        setCourse,
        courseLoading,
        setCourseLoading,
        quarters,
        setQuarters,

      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
