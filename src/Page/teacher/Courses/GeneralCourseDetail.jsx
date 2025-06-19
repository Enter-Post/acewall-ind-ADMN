import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CheckCircle2, ChevronDown, Loader, PlayCircle, Star, StarHalf } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import avatar from "@/assets/avatar.png";

const GeneralCourseDetail = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const response = await axiosInstance.get(`/course/get/${id}`);
        if (response.data?.course) {
          setCourseDetails(response.data.course);
        } else {
          setCourseDetails(null);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourseDetails(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (id) getCourseDetails();
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader className="animate-spin" />
      </div>
    );

  if (!courseDetails)
    return <div className="p-6 text-red-500">Course not found.</div>;

  const {
    courseTitle,
    courseDescription,
    teachingPoints = [],
    requirements = [],
    price,
    rating,
    thumbnail,
    createdby,
    chapters = [],
    reviews = [],
    videoHours,
    level,
  } = courseDetails;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 overflow-auto">
        <div className="grid lg:grid-cols-3 gap-2 p-2">
          {/* Main Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8 overflow-hidden mb-6">
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{courseTitle}</h1>
                <p className="text-gray-600 text-sm mb-4">{courseDescription}</p>

                {/* Instructor Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        className="rounded-full"
                        src={createdby?.profileImg?.url || avatar}
                        alt="Instructor"
                      />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 text-sm font-medium">
                      {createdby?.firstName} {createdby?.middleName} {createdby?.lastName}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <StarHalf size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <span className="text-sm font-medium">{rating}</span>
                  <span className="text-sm text-gray-500">(1,234 ratings)</span>
                </div>
              </div>

              {/* Course Thumbnail */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative aspect-video h-90 w-full">
                  <img
                    src={thumbnail?.url || "/default-thumbnail.jpg"}
                    alt="Course preview"
                    className="w-full shadow-md h-full object-cover"
                  />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full p-5">
                  <TabsList className="grid grid-cols-4 bg-transparent border-b border-gray-200 w-full text-green-600">
                    {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none"
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Overview */}
                  <TabsContent value="overview" className="p-6">
                    <h2 className="text-lg font-bold mb-4">Description</h2>
                    <p className="text-gray-600 text-sm mb-4">{courseDescription}</p>

                    <h2 className="text-lg font-bold mt-8 mb-4">What you'll learn</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {teachingPoints.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 size={20} className="text-green-500 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-lg font-bold mt-8 mb-4">Requirements</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {requirements.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 size={20} className="text-green-500 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Curriculum */}
                  <TabsContent value="curriculum" className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {chapters.length > 0 ? (
                        chapters.map((chapter, index) => (
                          <AccordionItem key={index} value={`chapter-${index}`}>
                            <AccordionTrigger className="py-4 text-sm font-semibold flex justify-between items-center group">
                              <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-data-[state=open]:rotate-180" />
                              <span>{chapter.title}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pl-6">
                                {Array.isArray(chapter.lessons) && chapter.lessons.length > 0 ? (
                                  chapter.lessons.map((lesson, i) => (
                                    <Collapsible key={i}>
                                      <CollapsibleTrigger className="w-full flex items-center justify-between text-left group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                                        <div className="flex items-center gap-2">
                                          <ChevronDown className="h-4 w-4 text-gray-500 group-data-[state=open]:rotate-180" />
                                          <span className="text-sm font-medium text-gray-800">{lesson.title}</span>
                                        </div>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent className="mt-3 bg-gray-50 border border-gray-200 p-4 space-y-3">
                                        {lesson.description && (
                                          <>
                                            <span className="font-bold">Description</span>
                                            <p className="text-sm text-gray-700">{lesson.description}</p>
                                          </>
                                        )}
                                      </CollapsibleContent>
                                    </Collapsible>
                                  ))
                                ) : (
                                  <div className="text-sm text-gray-500">No lessons available</div>
                                )}
                              </div>

                              {/* Assessment */}
                              {Array.isArray(chapter.Assessment) && chapter.Assessment.length > 0 && (
                                <div className="mt-6 border-t pt-4 space-y-2 pl-6">
                                  <div className="text-sm font-medium text-gray-700">Assessment</div>
                                  {chapter.Assessment.map((assess, j) => (
                                    <div key={j} className="text-sm text-gray-600">
                                      {assess.title} — <span className="italic">{assess.description}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No chapters available</div>
                      )}
                    </Accordion>
                  </TabsContent>

                  {/* Instructor */}
                  <TabsContent value="instructor" className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20 shadow-md ring-green-500 ring-3 rounded-full">
                        <AvatarImage
                          src={createdby?.profileImg?.url || avatar}
                          alt="Instructor"
                          className="object-cover rounded-full"
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {createdby?.firstName?.charAt(0)}
                          {createdby?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold">
                          {createdby?.firstName} {createdby?.middleName} {createdby?.lastName}
                        </h3>
                        <p className="text-sm text-gray-700 mt-4">{createdby?.bio}</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Reviews */}
                  <TabsContent value="reviews" className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold">{rating}</div>
                      <div className="flex justify-center my-2">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        <StarHalf size={16} className="text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="text-sm text-gray-500">Course Rating</div>
                    </div>

                    <div className="space-y-6">
                      {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <div key={index} className="border-b pb-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?text=S${index}`}
                                  alt="Student"
                                />
                                <AvatarFallback>S{index}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.student}</div>
                                <p className="text-sm mt-2">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No reviews available</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div> 

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-20 shadow-sm">
              <div className="flex flex-col gap-6 mb-6">
                {/* <div className="text-2xl text-green-600 font-extrabold flex justify-between">
                  <span>Price:</span>
                  <span>${price?.discounted ?? price ?? "N/A"}</span>
                </div> */}
                <Button className="w-full text-white text-sm py-2 bg-green-600 hover:bg-green-700 rounded-xl">
                  Enroll Now 
                </Button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="font-semibold">This course includes:</div>
                <div className="flex items-start gap-2">
                  <PlayCircle size={18} className="mt-0.5" />
                  <span>{videoHours || "0"} hours on-demand video</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5" />
                  <span>Access on mobile and web</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5" />
                  <span>
                    {chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)} Lessons
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5" />
                  <span>
                    {level} —{" "}
                    {chapters.reduce((acc, ch) => acc + (ch.Assessment?.length || 0), 0)} Assessments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end flex-1 */}
    </div>
  );
};

export default GeneralCourseDetail;
