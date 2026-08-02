import { useEffect, useState } from "react";
import interviewQuestionService from "../../services/interviewQuestionService";
import Modal from "./Modal";
import courseService from "../../services/courseService";
import QuestionItem from "./QuestionItem";

const InterviewQuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    courseId: "",
    question: "",
    answer: [""]
  });

  useEffect(() => {
    fetchInterviewQuestions();
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchInterviewQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await interviewQuestionService.getAllInterviewQuestions({
        page: currentPage,
        limit,
        search: searchTerm
      });
      setQuestions(response.data || []);
      setTotalPages(Math.ceil(response.total / limit) || 1);
    } catch (err) {
      console.error("Failed to fetch interview questions:", err);
      setError("Failed to load interview questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await interviewQuestionService.toggleInterviewQuestionStatus(id);
      fetchInterviewQuestions();
    } catch (err) {
      console.error("Failed to toggle question status:", err);
      setError("Failed to update question status. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await interviewQuestionService.deleteInterviewQuestion(id);
      fetchInterviewQuestions();
    } catch (err) {
      console.error("Failed to delete question:", err);
      setError("Failed to delete question. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answer];
    newAnswers[index] = value;
    setFormData(prev => ({
      ...prev,
      answer: newAnswers
    }));
  };

  const addAnswerField = () => {
    setFormData(prev => ({
      ...prev,
      answer: [...prev.answer, ""]
    }));
  };

  const removeAnswerField = (index) => {
    if (formData.answer.length <= 1) return;
    const newAnswers = [...formData.answer];
    newAnswers.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      answer: newAnswers
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingQuestion) {
        await interviewQuestionService.updateInterviewQuestion(editingQuestion._id, formData);
      } else {
        await interviewQuestionService.createInterviewQuestion(formData);
      }
      
      // Reset form and refresh list
      setFormData({ courseId: "", question: "", answer: [""] });
      setEditingQuestion(null);
      setShowModal(false);
      fetchInterviewQuestions();
    } catch (err) {
      console.error("Failed to save question:", err);
      setError("Failed to save question. Please try again.");
    }
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setFormData({
      courseId: question.courseId?._id || "",
      question: question.question,
      answer: [...question.answer]
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData({ courseId: "", question: "", answer: [""] });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Interview Questions</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all interview questions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            Add Question
          </button>
          <button
            onClick={fetchInterviewQuestions}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {questions.length} of {totalPages * limit} questions
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800"></div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm ? "No questions match your search." : "No interview questions found."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
            <ul className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
              {questions.map((question) => (
                <QuestionItem
                  key={question._id}
                  question={question}
                  onEdit={() => openEditModal(question)}
                  onToggleStatus={() => handleToggleStatus(question._id)}
                  onDelete={() => handleDelete(question._id)}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal for adding/editing questions */}
      <Modal
        isOpen={showModal}
        title={editingQuestion ? "Edit Interview Question" : "Add Interview Question"}
        onClose={() => {
          setShowModal(false);
          setEditingQuestion(null);
          setFormData({ courseId: "", question: "", answer: [""] });
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Question
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Answers
            </label>
            {formData.answer.map((ans, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea
                  value={ans}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  rows="2"
                  required
                />
                {formData.answer.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAnswerField(index)}
                    className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAnswerField}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Add Answer
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingQuestion(null);
                setFormData({ courseId: "", question: "", answer: [""] });
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {editingQuestion ? "Update Question" : "Add Question"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InterviewQuestionPage;