import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowBigLeft,
  ArrowLeft,
  BookOpen,
  FileText,
  Loader,
  Pen,
  Trash2,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateAssessmentDialog from "@/CustomComponent/CreateCourse/EditAssessment";
import EditAssessmentDialog from "@/CustomComponent/CreateCourse/EditAssessment";

function QuestionDisplay({ question, index }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      {question.type === "file" ? (
        <section>
          <div className="font-medium text-gray-800 mb-3 flex gap-2 flex-col">
            <p className="text-xl font-bold">Instruction:</p>
            <p className="text-lg">{question?.question}</p>
          </div>
          <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
            {question?.files.map((file, i) => (
              <a target="#" href={file.url} className="flex items-center">
                <FileText size={24} className="text-blue-500 mr-3" />
                <p>{file.filename}</p>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex gap-2 flex-col">
          <p className="text-xl font-bold">Question:</p>
          <p
            className="text-lg font-medium text-gray-800 mb-3"
            dangerouslySetInnerHTML={{
              __html: `${question.question}`,
            }}
          />
        </div>
      )}

      {question.type === "mcq" && (
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          {question.options?.map((opt, i) => (
            <li
              key={i}
              className={
                question.correctAnswer === (i + 1).toString()
                  ? "font-semibold text-green-600 bg-green-50 p-1 rounded"
                  : ""
              }
            >
              {opt}
              {question.correctAnswer === (i + 1).toString() && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Correct
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}

      {question.type === "qa" && (
        <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
          <span className="font-semibold text-green-800">Answer:</span>{" "}
          {question.correctAnswer}
        </div>
      )}

      {question.type === "truefalse" && (
        <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
          <span className="font-semibold text-green-800">Answer:</span>{" "}
          {question.correctAnswer === "true" ? "True" : "False"}
        </div>
      )}
    </div>
  );
}

export function AssessmentPage() {
  const { assessmentid } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState();
  const [loading, setLoading] = useState(true);

  const fetchAssessment = async (req, res) => {
    await axiosInstance
      .get(`assessment/${assessmentid}`)
      .then((res) => {
        console.log(res);
        setAssessment(res.data.assessment);
        setLoading(false);
      })
      .catch((err) => {
        setAssessment(null);
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssessment();
  }, [assessmentid]);

  const questionsByType =
    assessment?.questions?.reduce((groups, question) => {
      const type = question.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(question);
      return groups;
    }, {}) || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <section className="flex justify-center items-center h-full w-full">
          <Loader className="animate-spin " />
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-3"
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      <div className="mb-6 border-b pb-4 flex items-center justify-between">
        <section>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {assessment?.title}
            <Badge variant="outline">{assessment?.category?.name}</Badge>
          </h1>
          <div className="text-sm text-gray-500">
            due date: {new Date(assessment?.dueDate.date).toDateString()}
          </div>
        </section>
        <section>
          <EditAssessmentDialog
            assessment={assessment}
            fetchAssessment={fetchAssessment}
          />
        </section>
      </div>

      {assessment?.description && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Description</h4>
          <p className="text-sm text-blue-800">{assessment.description}</p>
        </div>
      )}
      {/* <section className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Files</h4>
        {assessment?.files.length === 0 ? (
          <p className="text-sm text-gray-500">no file available</p>
        ) : (
          assessment?.files.lent &&
          assessment?.files &&
          assessment?.files.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Files
              </h4>
              <div className="flex flex-wrap gap-2">
                {assessment?.files
                  .filter((file) => /\.(pdf|docx)$/i.test(file.filename))
                  .map((file, i) => (
                    <a
                      key={file.url || i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      <FileText className="h-4 w-4" />
                      {file.filename}
                    </a>
                  ))}
              </div>
            </div>
          )
        )}
      </section> */}

      <section>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Questions</h4>
        {assessment.questions.length === 0 ? (
          <p className="text-sm text-gray-500">No questions found</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {["mcq", "qa", "truefalse", "file"].map((type) => {
              const group = questionsByType[type];
              if (!group || group.length === 0) return null;

              return (
                <AccordionItem key={type} value={type}>
                  <AccordionTrigger className="text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{type.toUpperCase()}</Badge>
                      <span>({group.length} questions)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {group.map((question, idx) => (
                      <QuestionDisplay
                        key={question._id}
                        question={question}
                        index={idx}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </div>
  );
}
