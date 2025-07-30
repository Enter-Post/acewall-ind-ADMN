import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { LessonCard } from "./lesson-card"
import { AssessmentCard } from "./assessment-card"
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal"
import EditChapterDialog from "@/CustomComponent/CreateCourse/EditChapter"
import LessonModal from "@/CustomComponent/CreateCourse/LessonModal"

export function ChapterCard({
  chapter,
  chapterIndex,
  courseId,
  quarterStartDate,
  quarterEndDate,
  onDeleteChapter,
  onDeleteAssessment,
  onDeleteLesson,
  fetchQuarterDetail,
}) {
  return (
    <AccordionItem value={`chapter-${chapterIndex}`} className="border rounded-xl overflow-hidden shadow-sm">
      <AccordionTrigger className="text-left text-lg font-semibold px-6 py-4 hover:bg-gray-50 transition-all">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Chapter {chapterIndex + 1}
          </Badge>
          <span className="text-gray-800">{chapter.title}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-6 pb-6 space-y-6 bg-white">
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-orange-800 leading-relaxed">{chapter.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DeleteModal what="chapter" deleteFunc={() => onDeleteChapter(chapter._id)} />
          <EditChapterDialog
            chapterId={chapter._id}
            title={chapter.title}
            description={chapter.description}
            fetchQuarterDetail={fetchQuarterDetail}
          />
          <LessonModal chapterID={chapter._id} fetchQuarterDetail={fetchQuarterDetail} />
          <Link
            to={`/admin/assessments/create/chapter/${chapter._id}/${courseId}/${quarterStartDate}/${quarterEndDate}?semester=${chapter.semester._id}&quarter=${chapter.quarter._id}`}
          >
            <Button variant="outline" className="text-green-600 bg-transparent">
              + Add Assessment
            </Button>
          </Link>
        </div>

        <AssessmentCard
          assessments={chapter.chapter_assessments || []}
          title="Chapter Assessments"
          badgeColor="bg-orange-50"
          onDelete={onDeleteAssessment}
        />

        {chapter.lessons && chapter.lessons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">
                Lessons
              </Badge>
              <span className="text-sm text-gray-500">({chapter.lessons.length})</span>
            </div>

            <div className="space-y-3">
              {chapter.lessons.map((lesson, lessonIndex) => (
                <LessonCard
                  key={lesson._id}
                  lesson={lesson}
                  lessonIndex={lessonIndex}
                  courseId={courseId}
                  quarterStartDate={quarterStartDate}
                  quarterEndDate={quarterEndDate}
                  semesterId={chapter.semester._id}
                  quarterId={chapter.quarter._id}
                  onDelete={onDeleteLesson}
                  onDeleteAssessment={onDeleteAssessment}
                  fetchQuarterDetail={fetchQuarterDetail}
                />
              ))}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
