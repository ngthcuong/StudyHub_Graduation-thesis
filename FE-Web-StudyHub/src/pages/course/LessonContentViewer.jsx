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
          "68f0ec6c313927c6cd68578a"
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
      dangerouslySetInnerHTML={{ __html: lesson?.data?.content }}
    />
  );
}

export default LessonContentViewer;
