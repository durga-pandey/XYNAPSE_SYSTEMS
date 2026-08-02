import React from "react";

const AnswerList = ({ answers }) => {
  if (!answers || answers.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-sm text-slate-700 dark:text-slate-300">
        Answers:
      </p>
      <ul className="mt-1 list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
        {answers.map((ans, index) => (
          <li key={index}>{ans}</li>
        ))}
      </ul>
    </div>
  );
};

export default AnswerList;