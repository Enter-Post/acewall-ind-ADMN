import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AssessmentSection from "../../CustomComponent/teacher/Assessment/AssessmentSection";

export default function TeacherAssessment() {
  const [currentExpanded, setCurrentExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);

  const currentAssessments = [
    { id: 4, title: "Create a Facebook Marketing Plan", questions: 2, points: 10, dueDate: "Oct 30, 2024" },
    { id: 5, title: "Instagram Story Strategy Analysis", questions: 10, points: 10, dueDate: "Nov 15, 2024" },
    { id: 6, title: "Analyze a Social Media Campaign", questions: 10, points: 10, dueDate: "Nov 25, 2024" },
    { id: 7, title: "Final Project: Build a Marketing Campaign", questions: 10, points: 10, dueDate: "Dec 10, 2024" },
  ];

  const completedAssessments = [
    { id: 1, title: "Social Media Audit Report", questions: 10, points: 10, dueDate: "Sep 30, 2024" },
    { id: 2, title: "SEO Optimization Strategy P1", questions: 10, points: 10, dueDate: "Aug 15, 2024" },
    { id: 3, title: "SEO Optimization Strategy P2", questions: 10, points: 10, dueDate: "Aug 15, 2024" },
  ];

  return (
    <div className="container p-3 md:p-0">
      <div className="flex flex-col mb-2 justify-between">
        <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">Assessments</p>
        <div className="flex justify-end">
         
        </div>
      </div>

      <div className="space-y-6">
        <AssessmentSection title="Current Assessments" Assessments={currentAssessments} expanded={currentExpanded} setExpanded={setCurrentExpanded} />
        <AssessmentSection title="Completed Assessments" Assessments={completedAssessments} expanded={completedExpanded} setExpanded={setCompletedExpanded} />
      </div>
    </div>
  );
}