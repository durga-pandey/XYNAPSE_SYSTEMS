
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-16 h-16 border-4 border-t-indigo-600 border-b-indigo-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>

      <div className="flex mt-4 space-x-2">
        <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></span>
        <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-450"></span>
      </div>

      <p className="mt-4 text-gray-500 font-medium">Loading internships...</p>
    </div>
  );
};

export default Loader;
