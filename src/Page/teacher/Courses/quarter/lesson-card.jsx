"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Youtube, Link2, ChevronDown, ChevronUp } from "lucide-react"
import { Link } from "react-router-dom"
// import { DeleteModal } from "../../../CustomComponent/CreateCourse/DeleteModal"
import EditLessonModal from "@/CustomComponent/CreateCourse/EditLesson"
import { AssessmentCard } from "./assessment-card"
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal"
// import { AssessmentCard } from "./assessment-card"

export function LessonCard({
  lesson,
  lessonIndex,
  courseId,
  quarterStartDate,
  quarterEndDate,
  semesterId,
  quarterId,
  onDelete,
  onDeleteAssessment,
  fetchQuarterDetail,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="overflow-hidden shadow-sm border-l-4 border-l-blue-400">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Lesson {lessonIndex + 1}
          </Badge>
          <h4 className="font-semibold text-gray-800">{lesson.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <DeleteModal what="Lesson" deleteFunc={() => onDelete(lesson._id)} />
          <EditLessonModal lesson={lesson} fetchQuarterDetail={fetchQuarterDetail} />
          <Link
            to={`/admin/assessments/create/lesson/${lesson._id}/${courseId}/${quarterStartDate}/${quarterEndDate}?semester=${semesterId}&quarter=${quarterId}`}
          >
            <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
              + Add Assessment
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="border-t pt-4 bg-white">
          {lesson.description && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">{lesson.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3">Resources</h5>
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
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        {pdf.filename}
                      </a>
                    ),
                )}

                {lesson.youtubeLinks && (
                  <a
                    href={lesson.youtubeLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors shadow-sm"
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
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-purple-600 hover:bg-purple-50 transition-colors shadow-sm"
                  >
                    <Link2 className="h-4 w-4" />
                    Visit Link
                  </a>
                )}
              </div>
            </div>

            <AssessmentCard
              assessments={lesson.lesson_assessments || []}
              title="Lesson Assessments"
              badgeColor="bg-green-50"
              onDelete={onDeleteAssessment}
            />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
