import React from "react";

const QuestionTitle = ({ question }) => {
  if (!question) return null;

  return (
    <h3 className="font-medium text-slate-900 dark:text-white">
      {question}
    </h3>
  );
};

export default QuestionTitle;