import HeaderHome from "./HeaderHome";
import { LinearProgress } from "@mui/material";

export default function Achievements() {
  const lessons = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 2,
      title: "AWS Certified Solutions Architect",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 3,
      title: "AWS Certified Solutions Architect",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 4,
      title: "AWS Certified Solutions Architect",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 5,
      title: "AWS Certified Solutions Architect",
      image: "https://picsum.photos/id/237/200/300",
    },
    {
      id: 6,
      title: "AWS Certified Solutions Architect",
      image: "https://picsum.photos/id/237/200/300",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
