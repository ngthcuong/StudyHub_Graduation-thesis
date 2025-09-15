import HeaderHome from "./HeaderHome";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const lessons = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      author: "Lina",
      progress: "60",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 2,
      title: "AWS Certified Solutions Architect",
      author: "Lina",
      progress: "60",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 3,
      title: "AWS Certified Solutions Architect",
      author: "Lina",
      progress: "60",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 4,
      title: "AWS Certified Solutions Architect",
      author: "Lina",
      progress: "60",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 5,
      title: "AWS Certified Solutions Architect",
      author: "Lina",
      progress: "60",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 6,
      title: "AWS Certified Solutions Architect",
      author: "Lina",
      progress: "60",
      image: "https://picsum.photos/id/237/200/300",
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      <HeaderHome />
      <div className="min-h-screen bg-gray-100 flex justify-center py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => navigate(`/course/${lesson.id}`)}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 cursor-pointer"
            >
              <img
                src={lesson.image}
                alt={lesson.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800">
                  {lesson.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-600 font-medium mb-2">
                    {lesson.author}
                  </span>
                  <div className="my-3">
                    <LinearProgress
                      variant="determinate"
                      value={lesson.progress}
                      sx={{
                        backgroundColor: "#d9d9d9", // nền dưới màu nâu
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#49bbbd", // thanh chạy màu xanh lá
                        },
                      }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs mt-3">
                    lessons completed: {lesson.progress}%
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
