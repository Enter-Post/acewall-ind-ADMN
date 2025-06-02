import * as React from "react";
import SearchBox from "@/CustomComponent/SearchBox";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { GlobalContext } from "@/Context/GlobalProvider";

const AllCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(GlobalContext);
  const { subcategoryId } = useParams();

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      const getCourses = async () => {
        await axiosInstance
          .get(`/course/${subcategoryId}`, {
            params: { search: searchQuery },
          })
          .then((res) => {
            setAllCourses(res.data.courses);
            console.log(res, "res");
            setLoading(false);
          })
          .catch((err) => {
            console.log(err, "error");
            setLoading(false);
          });
      };
      getCourses();
    }, 2000); // 500ms delay

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchQuery, subcategoryId]);

  return (
    <section className="p-3 md:p-0">
      <div className="flex flex-col pb-5 gap-2">
        <div>
          <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
            All Courses
          </p>
        </div>
        <SearchBox query={searchQuery} setQuery={setSearchQuery} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
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
        <section className="    ">
          <div className="px-10">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {allCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/admin/course/detail/${course._id}`}
                  >
                    <Card className="pb-6 pt-0 w-full h-full overflow-hidden cursor-pointer">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={course?.thumbnail?.url || "/placeholder.svg"}
                          alt={`${course?.thumbnail?.filename} image`}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                      <CardHeader>
                        <CardTitle className="flex justify-between flex-col gap-2">
                          <span className="text-md font-bold leading-tight">
                            {course.courseTitle}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <img src={course.createdby?.profileImg} className="w-5 h-5 rounded-full" alt="" />
                            <p className="text-sm text-muted-foreground">
                              {course.createdby?.firstName}{" "}
                              {course.createdby?.middleName
                                ? course.createdby.middleName + " "
                                : ""}
                              {course.createdby?.lastName}
                            </p>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Language: {course?.language}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </section>
  );
};

export default AllCourses;
