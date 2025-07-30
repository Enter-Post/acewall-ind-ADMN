import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import SearchBox from "@/CustomComponent/SearchBox";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { GlobalContext } from "@/Context/GlobalProvider";
import BackButton from "@/CustomComponent/BackButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UnverifiedCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState("pending");
  const { user } = useContext(GlobalContext);

  console.log(isVerified, "isVerified");

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      const getCourses = async () => {
        try {
          const response = await axiosInstance.get(
            `/course/all?isVerified=${isVerified}`,
            {
              params: { search: searchQuery },
            }
          );
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
  }, [searchQuery, isVerified]);

  return (
    <section className="p-3 md:p-0">
      <div className="mb-2">
        <BackButton />
      </div>
      <div className="flex flex-col pb-5 gap-5">
        <div>
          <p className="text-xl py-4 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
            Unverified Courses
          </p>
        </div>
        <section className="flex flex-col gap-4 mb-4">
          <SearchBox query={searchQuery} setQuery={setSearchQuery} />

          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger
                value="pending"
                onClick={() => setIsVerified("pending")}
              >
                Pending courses
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                onClick={() => setIsVerified("rejected")}
              >
                Rejected courses
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <section className="flex justify-center items-center h-full w-full">
            <Loader className={"animate-spin"} />
          </section>
        </div>
      ) : allCourses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <p className="text-lg font-medium text-gray-700">
            No courses are currently available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses?.map((course) => (
            <Link
              key={course._id}
              to={`/admin/courses/courseDetail/${course._id}`}
            >
              <Card className="pb-6 pt-0 w-full overflow-hidden cursor-pointer">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={course.thumbnail.url || "/placeholder.svg"}
                    alt={`${course.thumbnail.file} image`}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <CardHeader>
                  <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2">
                    {course.category?.title || "Developments"}
                  </div>
                  <CardTitle>{course.courseTitle}</CardTitle>
                  <p className="text-xs">
                    Teacher: {course.createdby?.firstName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Language: {course.language}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default UnverifiedCourses;
