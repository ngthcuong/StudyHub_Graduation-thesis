import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  LinearProgress,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Bookmark as BookmarkIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  FullscreenRounded as FullscreenIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoIcon,
  Speed as SpeedIcon,
  Download as DownloadIcon,
  Reply as ReplyIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Info as InfoIcon,
  Notes as NotesIcon,
  AccessTime,
  ImportContacts,
  BookmarkBorder,
  CheckCircle,
} from "@mui/icons-material";
import { lessons } from "../mock/mockLession";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  useGetLessonsByCourseIdMutation,
  useGetPartByIdMutation,
} from "../services/grammarLessonApi";
import { useGetCourseByIdMutation } from "../services/courseApi";
import {
  useGetTestByTestIdMutation,
  useGetAttemptByTestAndUserMutation,
} from "../services/testApi";
import { useLogStudySessionMutation } from "../services/StudyStatsApi";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useSelector } from "react-redux";

const CourseLessson = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const { courseId } = useParams();
  const [data, setData] = useState([]);
  const [course, setCourse] = useState(null);
  const [lessonsWithTests, setLessonsWithTests] = useState([]);
  const [finalTest, setFinalTest] = useState(null);

  const [currentLessonId, setCurrentLessonId] = useState("1-1");
  const [lessonPlay, setLessonPlay] = useState(data[0]?.parts[0]);
  const [startTime, setStartTime] = useState(null);

  const [getLessonsByCourseId] = useGetLessonsByCourseIdMutation();
  const [logStudySession] = useLogStudySessionMutation();
  const [getPartById] = useGetPartByIdMutation();
  const [getCourseById] = useGetCourseByIdMutation();
  const [getTestByTestId] = useGetTestByTestIdMutation();
  const [getAttemptByTestAndUser] = useGetAttemptByTestAndUserMutation();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // 1. Lấy lessons
        const result = await getLessonsByCourseId(courseId).unwrap();
        setData(result.data); // cập nhật state, nhưng đừng dùng ngay

        // 2. Set course data from query
        // if (courseData) {
        //   setCourse(courseData);
        // }
        const courseResult = await getCourseById(courseId).unwrap();
        setCourse(courseResult);

        // 3. Lấy tests dựa trên result.data chứ không phải state data
        const chaptersWithTests = await Promise.all(
          result.data.map(async (chapter) => {
            let tests = [];
            if (chapter.exercises?.length) {
              tests = await Promise.all(
                chapter.exercises.map(async (testId) => {
                  try {
                    const test = await getTestByTestId(testId?._id).unwrap();
                    return test;
                  } catch (err) {
                    console.error("Failed to fetch test:", testId, err);
                    return null;
                  }
                })
              );

              tests = tests.filter(Boolean);
            }

            return {
              ...chapter,
              tests,
            };
          })
        );

        const newLessons = await attachIsPassedToLessons(
          chaptersWithTests,
          user._id
        );
        const allTests = lessonsWithTests
          .flatMap((ch) => ch.tests || [])
          .map((t) => t?.data)
          .filter(Boolean);

        console.log("ALL TESTS:", allTests);

        // Kiểm tra có test nào chưa pass không
        const allPassed =
          allTests.slice(0, -1).every((test) => test.isPassed === true) ||
          allTests.every((test) => test.isPassed === true);

        setFinalTest(allPassed);
        console.log("Tổng số test:", allTests.length);
        console.log(
          "Số test đã pass:",
          allTests.every((test) => test.isPassed === true)
        );
        console.log(
          "Danh sách test:",
          allTests.slice(0, -1).every((test) => test.isPassed === true)
        );
        console.log("Đã pass hết chưa:", allPassed);

        // cập nhật lessons với thông tin isPassed
        setLessonsWithTests(newLessons);
      } catch (error) {
        console.error("Failed to fetch lessons or tests:", error);
      }
    };

    fetchLessons();
  }, [courseId, getLessonsByCourseId, getTestByTestId]);

  // Find current lesson object
  const findCurrentLesson = () => {
    for (const chapter of lessons.chapters) {
      const lesson = chapter.lessons.find(
        (lesson) => lesson._id === currentLessonId
      );
      if (lesson) return lesson;
    }
    return null;
  };

  const currentLesson = findCurrentLesson();

  // Format time from seconds to MM:SS
  // const formatTime = (timeInSeconds) => {
  //   const minutes = Math.floor(timeInSeconds / 60);
  //   const seconds = Math.floor(timeInSeconds % 60);
  //   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  // };

  const handleLessonClick = async (lesson) => {
    // Log thời gian cho lesson cũ trước khi chuyển
    await logTimeForLesson(lessonPlay);

    setCurrentLessonId(lesson._id);

    try {
      const result = await getPartById(lesson._id).unwrap();
      setLessonPlay(result.data);
      setStartTime(Date.now()); // reset thời gian bắt đầu cho lesson mới
    } catch (error) {
      console.error("Failed to fetch part data:", error);
    }
  };

  const logTimeForLesson = async (lesson) => {
    if (!startTime) return; // chưa có thời gian bắt đầu thì bỏ qua

    const end = Date.now();
    const durationMs = end - startTime;
    let durationSeconds = durationMs / 1000;

    try {
      const res = await logStudySession({
        lessonId: lesson._id,
        durationSeconds,
      }).unwrap();
      console.log("✅ Response from backend:", res);
    } catch (error) {
      console.error("Failed to log study session:", error);
    }
  };

  const findNextLesson = () => {
    for (let i = 0; i < lessonsWithTests.length; i++) {
      const chapter = lessonsWithTests[i];
      for (let j = 0; j < chapter.parts.length; j++) {
        const lesson = chapter.parts[j];
        if (lesson._id === currentLessonId) {
          // Trả về bài tiếp theo nếu có
          if (j + 1 < chapter.parts.length) return chapter.parts[j + 1];
          // Nếu hết bài trong chapter, chuyển sang chapter tiếp theo
          if (
            i + 1 < lessonsWithTests.length &&
            lessonsWithTests[i + 1].parts.length > 0
          ) {
            return lessonsWithTests[i + 1].parts[0];
          }
          return null; // hết toàn bộ bài
        }
      }
    }
    return null;
  };

  const handleContinueLesson = async () => {
    // Log thời gian cho lesson hiện tại
    await logTimeForLesson(lessonPlay);

    const nextLesson = findNextLesson();
    if (nextLesson) {
      setCurrentLessonId(nextLesson._id);
      try {
        const result = await getPartById(nextLesson._id).unwrap();
        setLessonPlay(result.data);
        setStartTime(Date.now()); // reset thời gian cho bài mới
      } catch (error) {
        console.error("Failed to fetch next lesson:", error);
      }
    } else {
      console.log("Bạn đã hoàn thành tất cả các bài học!");
    }
  };

  const handleTestClick = (test) => {
    navigate(`/test/${test._id}`);
  };

  const attachIsPassedToLessons = async (lessons, userId) => {
    const updatedLessons = await Promise.all(
      lessons.map(async (lesson) => {
        if (!lesson.tests || lesson.tests.length === 0) {
          return lesson; // bỏ qua nếu lesson chưa có bài test
        }

        const updatedTests = await Promise.all(
          lesson.tests.map(async (testObj) => {
            const testId = testObj?.data?._id;
            if (!testId) return testObj;

            try {
              const res = await getAttemptByTestAndUser({
                testId,
                userId,
              }).unwrap();

              const attemptData = res.data[0];

              const isPassed = attemptData?.isPassed || false;

              return {
                ...testObj,
                data: {
                  ...testObj.data,
                  isPassed, // thêm field này
                },
              };
            } catch (err) {
              console.error(
                `❌ Lỗi khi gọi API cho test ${testId}:`,
                err.message
              );
              return {
                ...testObj,
                data: {
                  ...testObj.data,
                  isPassed: false, // nếu lỗi, gán false
                },
              };
            }
          })
        );

        return {
          ...lesson,
          tests: updatedTests,
        };
      })
    );

    return updatedLessons;
  };

  console.log("LESSONS WITH TESTS:", lessonsWithTests);

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Course Navigation */}
      <div className="w-80 flex-shrink-0 border-r overflow-y-auto border-gray-300">
        <div className="p-4">
          <div className="flex items-center h-12 mb-4 font-light text-xl">
            <HomeIcon
              className="text-gray-700 mr-2 cursor-pointer"
              sx={{
                fontSize: 32,
              }}
              onClick={() => navigate("/home/courses")}
            />
          </div>

          <div className="mb-4">
            <Typography className="!text-xl !font-bold">
              {course?.title || "Course Title"}
            </Typography>
            {/* <div className="flex justify-between mb-1 mt-2">
              <span className="text-sm font-medium">
                {lessons.remainingLessons} lessons left
              </span>
              <span className="text-sm font-medium">{lessons.progress}%</span>
            </div> */}
            {/* <LinearProgress
              variant="determinate"
              value={lessons.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#00A86B",
                },
              }}
            /> */}
          </div>

          {/* Course Chapters */}
          <div className="mt-4">
            {lessonsWithTests?.map((chapter) => (
              <Accordion
                key={chapter?._id}
                defaultExpanded={chapter?._id === 1}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      flexDirection: "column",
                    },
                  }}
                >
                  <div className="w-full">
                    <div className="flex justify-between w-full">
                      <Typography className="!font-semibold">
                        {chapter?.title}
                      </Typography>
                    </div>
                    <div className="flex items-center !text-gray-500 gap-3 mt-0.5">
                      <div className="flex items-center">
                        <ImportContacts className="!h-4" />
                        <Typography className="!text-sm">
                          {chapter?.completedLessons}/{chapter?.totalLessons}{" "}
                          lessons
                        </Typography>
                      </div>
                      <div className="flex items-center">
                        <AccessTime className="!h-4" />
                        <Typography className="!text-sm">
                          {chapter?.totalDuration} mins
                        </Typography>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <ul className="pl-0">
                    {/* Lessons */}
                    {chapter?.parts?.map((lesson) => (
                      <li
                        key={lesson._id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-blue-400 ${
                          currentLessonId === lesson._id
                            ? "border-[#00A86B] bg-blue-300"
                            : lesson?.completed
                            ? "border-transparent"
                            : "border-transparent"
                        }`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        <div className="mr-2">
                          {lesson?.completed ? (
                            <CheckCircleIcon
                              sx={{ color: "#00A86B", fontSize: 20 }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                              {lesson?.type === "video" ? (
                                <VideoIcon
                                  sx={{ fontSize: 14, color: "gray" }}
                                />
                              ) : (
                                <DescriptionIcon
                                  sx={{ fontSize: 14, color: "gray" }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Typography
                            className={`!text-sm ${
                              lesson?.completed
                                ? "text-[#00A86B] !font-medium"
                                : ""
                            }`}
                          >
                            {lesson?.title}
                          </Typography>
                        </div>
                      </li>
                    ))}

                    {/* Tests */}
                    {chapter?.tests?.length > 0 &&
                      chapter.tests.map((test) => {
                        const isLastTest =
                          test?.data?.isTheLastTest && !finalTest;

                        const isPassed = test?.data?.isPassed;

                        return (
                          <li
                            key={test?.data._id}
                            className={`flex items-center p-3 border-l-4 hover:bg-yellow-100
          ${
            isLastTest
              ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
              : "bg-yellow-50 border-yellow-400 cursor-pointer"
          }
        `}
                            onClick={
                              !isLastTest
                                ? () => handleTestClick(test?.data)
                                : undefined
                            }
                          >
                            <div className="mr-2">
                              <AssignmentOutlinedIcon
                                sx={{
                                  fontSize: 20,
                                  color: isLastTest ? "#9CA3AF" : "#F59E0B",
                                }}
                              />
                            </div>

                            <div className="flex-1">
                              <Typography className="!text-sm font-medium">
                                {test?.data.title}
                              </Typography>
                              <Typography className="!text-xs text-gray-500">
                                {test?.data.description}
                              </Typography>
                            </div>

                            {/* Nếu test đã pass thì hiện icon ✅ */}
                            {isPassed && (
                              <span className="ml-2 text-green-600 text-xs font-semibold flex items-center">
                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                              </span>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <Typography variant="h6" className="!font-semibold">
            {currentLesson?.title}
          </Typography>
          <div className="flex items-center">
            <IconButton>
              {/* <BookmarkIcon color="primary" /> */}
              <BookmarkBorder />
            </IconButton>
            <button
              onClick={() => handleContinueLesson(lessonPlay)}
              className="ml-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
            >
              Continue <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* .Content Area */}
        <div className="flex-1  bg-gray-50 overflow-auto flex flex-col w-full ">
          <div className="lesson-viewer flex-1">
            <div
              className="lesson-container max-h-[100vh] overflow-y-auto p-4 bg-white rounded-lg shadow-sm"
              dangerouslySetInnerHTML={{ __html: lessonPlay?.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessson;
