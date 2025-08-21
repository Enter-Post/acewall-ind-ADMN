"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LessonModal from "./LessonModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Youtube,
  Link2,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DeleteModal } from "./DeleteModal";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link } from "react-router-dom";

const ChapterDetail = ({ courseId, chapters, fetchCourseDetail }) => {
  const [openLessons, setOpenLessons] = useState({});
  const [activeTab, setActiveTab] = useState("chapters");
  const [loading, setLoading] = useState(false);
  const [openAssessmentModalId, setOpenAssessmentModalId] = useState(null);


  console.log(chapters, "chapters");

  const toggleLesson = (lessonId) => {
    setOpenLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };
  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="chapters"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="chapters" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Chapters & Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="mt-4">
          <Accordion type="multiple" className="w-full space-y-4">
            {chapters?.map((chapter, chapterIndex) => (
              <AccordionItem
                key={chapter._id}
                value={`chapter-${chapterIndex}`}
                className="border rounded-xl overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-left text-lg font-semibold px-6 py-4 hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Chapter {chapterIndex + 1}
                    </span>
                    {chapter.title}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 space-y-5 bg-white">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {chapter.description}
                  </p>

                  <div className="flex items-center gap-4">
                  

                    <LessonModal
                      chapterID={chapter._id}
                      fetchCourseDetail={fetchCourseDetail}
                    />
                   
                  </div>

                  {Array.isArray(chapter.chapterAssessments) &&
                    chapter.chapterAssessments.length > 0 && (
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-50">
                              Chapter Assessment
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          {chapter.chapterAssessments.map((assess, aIdx) => (
                            <div
                              key={aIdx}
                              className="pl-4 border-l-2 border-orange-400 mb-4 last:mb-0"
                            >
                              <div className="mb-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-base font-medium mb-1 text-gray-800">
                                    {assess.title}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    {/* Trigger Modal */}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 text-gray-500 hover:text-blue-600"
                                        >
                                          <BookOpen className="h-4 w-4" />
                                          <span className="sr-only ">View</span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>{assess.title}</DialogTitle>
                                        </DialogHeader>

                                        <div className="mt-2 space-y-4">
                                          {assess.description && (
                                            <p className="text-sm text-gray-700">{assess.description}</p>
                                          )}

                                          {assess.files?.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-semibold text-gray-600 mb-2">Files</h4>
                                              <div className="flex flex-wrap gap-2">
                                                {assess.files
                                                  .filter((file) =>
                                                    /\.(pdf|docx)$/i.test(file.filename) // ✅ check extension from filename
                                                  )
                                                  .map((file, i) => (
                                                    <a
                                                      key={file._id || i}
                                                      href={file.url} // ✅ use the actual URL
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                      <FileText className="h-4 w-4" />
                                                      {file.filename}
                                                    </a>
                                                  ))}
                                              </div>
                                            </div>
                                          )}


                                          {assess.questions?.length > 0 && (
                                            <Accordion type="multiple" className="w-full">
                                              {["mcq", "qa", "truefalse"].map((type) => {
                                                const group = assess.questions.filter((q) => q.type === type);
                                                if (group.length === 0) return null;

                                                return (
                                                  <AccordionItem key={type} value={type}>
                                                    <AccordionTrigger className="text-left text-sm font-medium text-gray-700">
                                                      {type.toUpperCase()} ({group.length})
                                                    </AccordionTrigger>
                                                    <AccordionContent className="space-y-4">
                                                      {group.map((q, idx) => (
                                                        <div
                                                          key={q._id}
                                                          className="border border-gray-200 rounded-lg p-4"
                                                        >
                                                          <p
                                                            className="text-sm font-medium text-gray-800 mb-2"
                                                            dangerouslySetInnerHTML={{
                                                              __html: `<strong>Q${idx + 1}:</strong> ${q.question}`,
                                                            }}
                                                          />
                                                          {type === "mcq" && (
                                                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                              {q.options?.map((opt, i) => (
                                                                <li
                                                                  key={i}
                                                                  className={
                                                                    q.correctAnswer === (i + 1).toString()
                                                                      ? "font-semibold text-green-500"
                                                                      : ""
                                                                  }
                                                                >
                                                                  {opt}
                                                                  {q.correctAnswer === (i + 1).toString() &&
                                                                    " (Correct)"}
                                                                </li>
                                                              ))}
                                                            </ul>
                                                          )}
                                                          {type === "qa" && (
                                                            <div className="text-sm text-gray-700">
                                                              <span className="font-semibold">Answer:</span>{" "}
                                                              {q.correctAnswer}
                                                            </div>
                                                          )}
                                                          {type === "truefalse" && (
                                                            <div className="text-sm text-gray-700">
                                                              <span className="font-semibold">Answer:</span>{" "}
                                                              {q.correctAnswer === "true" ? "True" : "False"}
                                                            </div>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </AccordionContent>
                                                  </AccordionItem>
                                                );
                                              })}
                                            </Accordion>
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>


                                   
                                  </div>
                                </div>

                                <p className="text-sm text-gray-600">{assess.description}</p>
                              </div>
                            </div>
                          ))}

                        </CardContent>
                      </Card>
                    )}

                  {chapter.lessons?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-base text-gray-900 flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50">
                          Lessons
                        </Badge>
                      </h3>

                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <section key={lesson._id}>
                          <Card className="overflow-hidden">
                            <div
                              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleLesson(lesson._id)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Lesson {lessonIndex + 1}
                                </span>
                                <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                              
                               
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLesson(lesson._id);
                                  }}
                                >
                                  {openLessons[lesson._id] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {openLessons[lesson._id] && (
                              <CardContent className="border-t pt-4">
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <h5 className="text-sm font-semibold text-gray-700">Resources</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {lesson.pdfFiles?.map(
                                        (pdf, i) =>
                                          pdf?.url &&
                                          pdf?.filename && (
                                            <a
                                              key={i}
                                              href={pdf.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                              <FileText className="h-4 w-4" />
                                              {pdf.filename}
                                            </a>
                                          )
                                      )}
                                    </div>

                                    {lesson.youtubeLinks && (
                                      <a
                                        href={lesson.youtubeLinks}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                                      >
                                        <Youtube className="h-4 w-4" />
                                        Watch on YouTube
                                      </a>
                                    )}

                                    {lesson.otherLink && (
                                      <a
                                        href={lesson.otherLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                      >
                                        <Link2 className="h-4 w-4" />
                                        Visit Link
                                      </a>
                                    )}
                                  </div>
                                </div>

                                {lesson.lessonAssessments?.length > 0 && (
                                  <Card className="mt-6">
                                    <CardHeader className="py-3">
                                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50">
                                          Lesson Assessments
                                        </Badge>
                                      </CardTitle>
                                    </CardHeader>

                                    <CardContent className="py-2">
                                      {Object.entries(
                                        lesson.lessonAssessments.reduce((groups, assessment) => {
                                          const type = assessment.type || "Other";
                                          if (!groups[type]) groups[type] = [];
                                          groups[type].push(assessment);
                                          return groups;
                                        }, {})
                                      ).map(([type, assessments]) => (
                                        <div key={type} className="mb-6 last:mb-0">
                                          <h6 className="text-xs font-semibold text-gray-500 uppercase mb-2">{type}</h6>

                                          <div className="space-y-4">
                                            {assessments.map((a, i) => (
                                              <div
                                                key={a._id || i}
                                                className="pl-4 border-l-2 border-blue-400"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <p className="text-sm font-medium text-gray-800">{a.title || `Assessment ${i + 1}`}</p>

                                                  <div className="flex items-center gap-2">
                                                    <Dialog>
                                                      <DialogTrigger asChild>
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          className="h-8 text-gray-500 hover:text-blue-600"
                                                        >
                                                          <BookOpen className="h-4 w-4" />
                                                          <span className="sr-only">View</span>
                                                        </Button>
                                                      </DialogTrigger>
                                                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                          <DialogTitle>{a.title || `Assessment ${i + 1}`}</DialogTitle>
                                                        </DialogHeader>

                                                        <div className="mt-2 space-y-4">
                                                          {a.description && (
                                                            <p className="text-sm text-gray-700">{a.description}</p>
                                                          )}

                                                          {a.files?.length > 0 && (
                                                            <div>
                                                              <h4 className="text-sm font-semibold text-gray-600 mb-2">Files</h4>
                                                              <div className="flex flex-wrap gap-2">
                                                                {a.files.map((file, fi) => (
                                                                  <a
                                                                    key={fi}
                                                                    href={file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                                                  >
                                                                    <FileText className="h-4 w-4" />
                                                                    PDF {fi + 1}
                                                                  </a>
                                                                ))}
                                                              </div>
                                                            </div>
                                                          )}

                                                          {a.questions?.length > 0 && (
                                                            <Accordion type="multiple" className="w-full">
                                                              {["mcq", "qa", "truefalse"].map((type) => {
                                                                const group = a.questions.filter((q) => q.type === type);
                                                                if (group.length === 0) return null;

                                                                return (
                                                                  <AccordionItem key={type} value={type}>
                                                                    <AccordionTrigger className="text-left text-sm font-medium text-gray-700">
                                                                      {type.toUpperCase()} ({group.length})
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="space-y-4">
                                                                      {group.map((q, qIdx) => (
                                                                        <div
                                                                          key={q._id}
                                                                          className="border border-gray-200 rounded-lg p-4"
                                                                        >
                                                                          <p
                                                                            className="text-sm font-medium text-gray-800 mb-2"
                                                                            dangerouslySetInnerHTML={{
                                                                              __html: `<strong>Q${qIdx + 1}:</strong> ${q.question}`,
                                                                            }}
                                                                          />
                                                                          {type === "mcq" && (
                                                                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                                                              {q.options?.map((opt, oi) => (
                                                                                <li
                                                                                  key={oi}
                                                                                  className={
                                                                                    q.correctAnswer === (oi + 1).toString()
                                                                                      ? "font-semibold text-green-500"
                                                                                      : ""
                                                                                  }
                                                                                >
                                                                                  {opt}
                                                                                  {q.correctAnswer === (oi + 1).toString() && " (Correct)"}
                                                                                </li>
                                                                              ))}
                                                                            </ul>
                                                                          )}
                                                                          {type === "qa" && (
                                                                            <div className="text-sm text-gray-700">
                                                                              <span className="font-semibold">Answer:</span>{" "}
                                                                              {q.correctAnswer}
                                                                            </div>
                                                                          )}
                                                                          {type === "truefalse" && (
                                                                            <div className="text-sm text-gray-700">
                                                                              <span className="font-semibold">Answer:</span>{" "}
                                                                              {q.correctAnswer === "true" ? "True" : "False"}
                                                                            </div>
                                                                          )}
                                                                        </div>
                                                                      ))}
                                                                    </AccordionContent>
                                                                  </AccordionItem>
                                                                );
                                                              })}
                                                            </Accordion>
                                                          )}
                                                        </div>
                                                      </DialogContent>
                                                    </Dialog>

                                                    
                                                  </div>
                                                </div>

                                                {a.description && (
                                                  <p className="text-xs text-gray-600 mt-1">{a.description}</p>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                )}

                              </CardContent>
                            )}
                          </Card>
                        </section>
                      ))}
                    </div>
                  )}

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChapterDetail;
