import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DeshBoardCard({ mainHeading, data, link, height }) {
  return (
    <Card
      className={`bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full`}
      style={{ height: height || "100%" }}
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle className="text-lg text-white ">{mainHeading}</CardTitle>
        <Link to={link} className="text-white text-xs">
          View All
        </Link>
      </CardHeader>

      <CardContent className="p-0 overflow-auto max-h-[390px]">
        <div className="divide-y divide-gray-100">
          {data?.length > 0 ? (
            data.map((item, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-start justify-between  transition"
              >
                <div className="flex-1">
                  <Link to={link}>
                    {item.basics?.courseTitle ? (
                      <p className="font-semibold text-gray-800">
                        {item.basics.courseTitle}
                      </p>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800">
                          {item.course}
                        </p>
                        <p className="text-sm text-gray-600">{item.title}</p>
                      </>
                    )}
                  </Link>
                </div>

                <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                  {item.date ? (
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                  ) : item.createdAt ? (
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  ) : null}
                  {item.time && <p>{item.time}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-10">
              No data available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Assignment({ mainHeading, data, bgcolor, bordercolor, height }) {
  return (
    <Card
      className={`bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full`}
      style={{ height: height || "100%" }} // Same height as DeshBoardCard
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle className="text-lg text-white">Assessment Due</CardTitle>
        <Link to="assignment" className="text-white text-xs">
          View All
        </Link>
      </CardHeader>
      <CardContent className={`p-0 ${bgcolor}`}>
        <Link to="assignment">
          <div className={`divide-y`}>
            {data.map((assignment, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between">
                  <h3 className="hover:font-semibold font-semibold transition-all duration-300 cursor-pointer">
                    {assignment.course}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Due: {assignment.dueDate}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm mt-2  transition-all duration-300 cursor-pointer">
                  {assignment.Assignment}
                </p>
              </div>
            ))}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

function AnnouncementCard({ mainHeading, data }) {
  return (
    <Card className="h-fit p-0">
      <CardContent className="p-0">
        {/* Announcement Header */}
        <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
          Anouncements
        </p>

        {/* Announcements List */}
        <div className="divide-y">
          {data?.map((announcement, index) => (
            <div
              key={index}
              className="px-4 py-3 flex flex-col gap-3 border-b border-gray-300"
            >
              {/* Title and Date/Time */}
              <p className="font-bold text-lg">{announcement.course}</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">{announcement.title}</p>
                <p className="text-sm text-gray-500">
                  {announcement.date} • {announcement.time}
                </p>
              </div>

              {/* Announcement Message */}
              <p className="text-gray-700">{announcement.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CoursesCard({ course, link }) {
  return (
    <Link key={course.id} to={link}>
      <Card className="w-full overflow-hidden cursor-pointer gap-0 py-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={course.image || "/placeholder.svg"}
            alt={`${course.course} image`}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="p-4">
          <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2">
            {course.category || "Developments"}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {course.course}
          </h3>
          <div className="text-xl font-bold text-green-500 mb-3">
            ${course.Prise || "24.00"}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{course.rating || "4.9"}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span>{course.students || "982,941"} students</span>
            </div>
          </div>

          {/* Add to cart button */}
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            Add To Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
}

const StudentCard = ({ student }) => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow transition-shadow hover:shadow-lg bg-white">
      <CardContent className="px-6 py-5 flex flex-col items-center text-center space-y-4">
        <Avatar className="w-24 h-24 ring-2 ring-gray-300 shadow-sm">
          <AvatarImage
            src={student.profileImg.url}
            alt={`${student.firstName} ${student.lastName}`}
            className="rounded-full object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-semibold flex items-center justify-center">
            {student.firstName?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-gray-500 p-4 truncate max-w-[200px]">
            {student.email ?? "No email"}
          </p>        </div>

        <div className="w-full grid grid-cols-2 gap-y-1 gap-x-3 text-sm text-gray-600">
          <span>Joined</span>
          <span className="text-right font-medium text-gray-800">
            {new Date(student.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Link key={student._id} to={`/admin/studentProfile/${student._id}`}>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            type="button"
          >
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
const TeacherCard = ({ teacher, onViewProfile }) => (
  <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-white border border-gray-200">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <Avatar className="w-24 h-24 shadow-md mb-4">
        <AvatarImage
          src={teacher.profileImg.url}
          alt={`${teacher.firstName ?? "T"} ${teacher.lastName ?? ""}`}
          className="rounded-full object-cover w-full h-full"
        />
        <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-semibold flex items-center justify-center">
          {teacher.firstName?.[0] ?? "T"}
        </AvatarFallback>
      </Avatar>

      <h3 className="text-lg font-semibold text-gray-800">
        {teacher.firstName ?? "Unnamed"} {teacher.lastName ?? ""}
      </h3>
      <p className="text-sm text-gray-500 truncate max-w-[200px]">
        {teacher.email ?? "No email"}
      </p>

      <div className="w-full mt-4 space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Joined</span>
          <span className="font-medium text-gray-800">
            {new Date(teacher.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Courses</span>
          <span className="font-medium text-gray-800">
            {teacher.courses?.length ?? 0}
          </span>
        </div>
      </div>

      <Button
        className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white text-sm"
        onClick={() => onViewProfile?.(teacher.id)}
      >
        View Profile
      </Button>
    </CardContent>
  </Card>
);

const TransactionCard = ({ title, data }) => (
  <Card className="h-fit p-0 gap-3 rounded mt-5">
    <CardContent className="px-3 py-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead className="text-xs font-medium text-gray-500 py-3">
              Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3">
              Time
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Earnings
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Withdrawals
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction, index) => (
            <TableRow key={index} className="border-t border-gray-100">
              <TableCell className="text-sm text-gray-700 py-4">
                {transaction.date}
              </TableCell>
              <TableCell className="text-sm text-gray-700 py-4">
                {transaction.time}
              </TableCell>
              <TableCell className="text-sm text-green-600 py-4 text-center">
                {transaction.type === "Earning"
                  ? `$${transaction.amount}`
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-red-600 py-4 text-center">
                {transaction.type === "Withdrawal"
                  ? `$${transaction.amount}`
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-black py-4 text-center">
                {transaction.balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const EarningStateCard = ({ data }) => {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center  px-6 h-full">
        <div
          className={`h-12 w-12 rounded-lg flex ${data.bgColor} items-center justify-center mr-4`}
        >
          {data.icon}
        </div>
        <div className="h-full">
          <p className="text-xl font-bold"> {data.value} </p>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const LandingPageCard = ({ name, description, imageUrl, buttonUrl }) => {
  return (
    <Card className="pb-6 pt-0 overflow-hidden cursor-pointer border flex flex-col gap-4">
      <AspectRatio ratio={16 / 5}>
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </AspectRatio>
      <CardHeader>
        {/* <CardTitle>{name}</CardTitle> */}
        <p className="text-md font-bold truncate line-clamp-1.4">{name}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 gap-6">
          <p className="text-muted-foreground  text-xs line-clamp-4">
            {description}
          </p>
          <a
            href={buttonUrl}
            className="inline-flex items-center justify-center w-full px-3 py-2 mt-auto text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Learn more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

function StudentProfileCourseCard({ course }) {
  return (
    <Link to={`/admin/courses/courseDetail/${course._id}`} className="w-full">
      <Card className="p-4 flex flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
        <div className="w-full sm:w-36 h-24 rounded-md overflow-hidden shrink-0">
          <img
            src={course.thumbnail.url}
            alt="Course Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-gray-800">{course.courseTitle}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function StudentProfileStatCard({ title, value, icon }) {
  return (
    <Card className="p-6 flex items-center w-full gap-4 shadow-sm">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-center">{value}</p>
      </div>
    </Card>
  );
}
function TeacherProfileStatCard({ title, value, icon }) {
  return (
    <Card className="p-6 flex items-center w-full gap-4 shadow-sm">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-center">{value}</p>
      </div>
    </Card>
  );
}

const MyCoursesCard = ({ course }) => {
  return (
    <Card className="pb-6 pt-0 w-full overflow-hidden cursor-pointer">
      <AspectRatio ratio={16 / 9}>
        <img
          src={course.basics.thumbnail || "/placeholder.svg"}
          alt={`${course.basics.thumbnail} image`}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardHeader>
        <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2">
          {course.basics.category?.title || "Development"}
        </div>
        <CardTitle className="flex justify-between flex-col gap-2">
          <span>{course.basics.courseTitle}</span>
          {/* <span className="text-lg font-semibold text-green-500">
            ${course.basics.price}
          </span> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* <p className="text-sm text-muted-foreground">
            Teacher: {course.createdby?.firstName}{" "}
            {course.createdby?.middleName
              ? course.createdby.middleName + " "
              : ""}
            {course.createdby?.lastName}
          </p>{" "} */}
          <p className="text-sm text-muted-foreground">
            Language: {course.basics.language}
          </p>
          <p className="text-sm text-muted-foreground">
            Chapters: {course.chapters.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Card;

export {
  DeshBoardCard,
  Assignment,
  AnnouncementCard,
  CoursesCard,
  StudentCard,
  TransactionCard,
  EarningStateCard,
  LandingPageCard,
  StudentProfileCourseCard,
  StudentProfileStatCard,
  MyCoursesCard,
  TeacherProfileStatCard,
  TeacherCard,
};
