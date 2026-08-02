import React from "react";
import QuestionTitle from "./QuestionTitle";
import CourseInfo from "./CourseInfo";
import AnswerList from "./AnswerList";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

const QuestionItem = ({ question, onEdit, onToggleStatus, onDelete }) => {
  return (
    <li className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div>
              <QuestionTitle question={question.question} />
              <CourseInfo course={question.courseId} />
            </div>
          </div>
          <AnswerList answers={question.answer} />
        </div>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
          <StatusBadge isActive={question.isActive} />
          <ActionButtons
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            isActive={question.isActive}
          />
        </div>
      </div>
    </li>
  );
};

export default QuestionItem;