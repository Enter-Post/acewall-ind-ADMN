import * as React from "react";
import SearchBox from "@/CustomComponent/SearchBox";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { GlobalContext } from "@/Context/GlobalProvider";

const GeneralCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(GlobalContext);

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      const getCourses = async () => {
        try {
          const response = await axiosInstance.get("/course/get", {
            params: { search: searchQuery },
          });
          setAllCourses(response.data.courses);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setAllCourses([]);
        } finally {
          setLoading(false);
        }
      };
      getCourses();
    }, 2000); // 500ms delay

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchQuery]);


  return (
    <section className="    ">
      <div>
        <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white ">
          All Courses
        </p>
      </div>
      <div className="px-10">

        <div className="flex flex-col pb-8  md:px-10 gap-4  rounded-lg ">
          <SearchBox query={searchQuery} setQuery={setSearchQuery} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10 ">
            <section className="flex justify-center items-center h-full w-full">
              <Loader className={"animate-spin"} />
            </section>
          </div>
        ) : allCourses?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-4">
            {searching ? (
              <>
                <h1 className="text-2xl font-semibold text-muted-foreground">
                  No course found for "{searchQuery}"
                </h1>
                <p className="text-md mt-4 text-muted-foreground">
                  Try a different keyword or explore all your courses.
                </p>
                <ul className="list-disc pl-6 leading-relaxed mt-4 text-left text-muted-foreground">
                  <li>Check spelling</li>
                  <li>Try different or more general terms</li>
                </ul>
                <Button
                  className="mt-6 bg-green-500 text-white hover:bg-acewall-main"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Search
                </Button>
              </>
            ) : (
              <>
                <img
                  src="https://img.freepik.com/free-vector/exclamation-illustration-concept_114360-23479.jpg?t=st=1745438134~exp=1745441734~hmac=008d4f2dacd0316f660b0c54d3c43bc0a6ccbcc5b622b0cddf56ccc61b482ba9&w=900"
                  alt="No courses"
                  className="w-full h-75 object-contain "
                />
                <p className="text-2xl font-bold  text-muted-foreground">
                  Something went wrong !
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allCourses?.map((course) => (
              <Link
                key={course._id}
                to={`/courses/detail/${course._id}`}
              >
                <Card className="h-full pt-0 w-full overflow-hidden cursor-pointer">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={course.basics.thumbnail || "/placeholder.svg"}
                      alt={`${course.thumbnail} image`}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium h-fit w-fit px-2">
                        {course.basics.category?.title || "Development"}
                      </div>
                      <div className="uppercase text-orange-500  text-xs font-bold  h-fit  mb-2 w-fit px-2">
                        {course.averageRating >= 4.7 ? (

                          <span>
                            <span className="font-bold text-xs text-green-500 ">Top Rated</span> :{" "}
                            {course.averageRating.toFixed(1)}
                          </span>
                        ) : (
                          course.averageRating > 0 ? course.averageRating.toFixed(1) : "0.0"
                        )}
                      </div>
                    </div>
                    <CardTitle>{course.basics.courseTitle}</CardTitle>
                    <p className="text-xs">
                      Teacher: {course.createdby?.firstName}
                    </p>
                    <div className="text-xs flex items-center">

                      <span className="text-yellow-500 ml-1">★</span>
                      <span className="ml-1">{course.rating?.length || 0}</span>
                    </div>
                    <p className="text-lg  font-bold ">
                      ${course.basics.price}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GeneralCourses;
