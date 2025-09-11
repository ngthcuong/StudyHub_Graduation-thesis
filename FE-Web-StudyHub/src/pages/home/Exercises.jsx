import HeaderHome from "./HeaderHome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

export default function Exercises() {
  const tasks = [
    { name: "Grammar Fundamentals Quiz", type: "Test", status: "completed" },
    {
      name: "Vocabulary Building Exercise",
      type: "Assignment",
      status: "incomplete",
    },
    { name: "Reading Comprehension Test", type: "Test", status: "completed" },
    {
      name: "Essay Writing Assignment",
      type: "Assignment",
      status: "incomplete",
    },
    { name: "Listening Skills Assessment", type: "Test", status: "completed" },
    {
      name: "Pronunciation Practice",
      type: "Assignment",
      status: "incomplete",
    },
    { name: "Advanced Grammar Test", type: "Test", status: "incomplete" },
    {
      name: "Creative Writing Project",
      type: "Assignment",
      status: "completed",
    },
  ];

  return (
    <div>
      <HeaderHome />
      <div className="bg-white p-6 rounded-xl shadow-md mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            Assignments & Tests
          </h2>
          <p className="text-sm text-gray-600">
            Track your progress and complete your learning tasks
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-5">
          <input
            type="text"
            placeholder="Search assignments and tests..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-100">
            Filters
          </button>
          <button className="px-4 py-2 border border-blue-500 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600">
            Clear All
          </button>
          <span className="text-sm text-gray-500">8 of 8 items</span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">
              Assignment Type
            </label>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Types</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">
              Completion Status
            </label>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Levels</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          {/* Apply Filters Button ngang hàng */}
          <div className="flex">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 self-end w-full">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full mx-auto">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-4 py-2 mb-3 rounded-md shadow-sm cursor-pointer ${
              task.status === "completed" ? "bg-green-50" : "bg-white"
            }`}
          >
            {/* Bên trái (icon + text) */}
            <div className="flex items-center space-x-2">
              {task.status === "completed" ? (
                <CheckCircleIcon className="text-green-600" fontSize="small" />
              ) : (
                <RadioButtonCheckedIcon
                  className="text-gray-400"
                  fontSize="small"
                />
              )}
              <span className="text-gray-800 text-base">{task.name}</span>
            </div>

            {/* Bên phải (loại task) */}
            <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-600">
              {task.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
