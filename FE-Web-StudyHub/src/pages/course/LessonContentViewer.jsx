import React, { useEffect } from "react";
import { useGetGrammarLessonByIdMutation } from "../../services/grammarLessonApi";

function LessonContentViewer() {
  // `lessonContent` là chuỗi HTML bạn lấy từ database

  const [lesson, setLesson] = React.useState("");

  const [getGrammarLessonById] = useGetGrammarLessonByIdMutation();

  useEffect(() => {
    // Ví dụ gọi API khi component mount
    const fetchLessons = async () => {
      try {
        const lesson = await getGrammarLessonById(
          "68f12670e2e8fe8b022253e9"
        ).unwrap();
        setLesson(lesson);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div
      className="lesson-container"
      dangerouslySetInnerHTML={{ __html: lesson?.data?.parts[1]?.content }}
    />
  );
}

export default LessonContentViewer;
