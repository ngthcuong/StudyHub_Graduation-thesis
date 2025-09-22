import React, { useState } from "react";
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
} from "@mui/icons-material";
import { lessons } from "../mock/mockLession";
import { useNavigate } from "react-router-dom";

const CourseLessson = () => {
  const navigate = useNavigate();

  const [currentLessonId, setCurrentLessonId] = useState("1-1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(141);
  const [activeTab, setActiveTab] = useState(0);

  // Find current lesson object
  const findCurrentLesson = () => {
    for (const chapter of lessons.chapters) {
      const lesson = chapter.lessons.find(
        (lesson) => lesson.id === currentLessonId
      );
      if (lesson) return lesson;
    }
    return null;
  };

  const currentLesson = findCurrentLesson();

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleLessonClick = (lessonId) => {
    setCurrentLessonId(lessonId);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
              onClick={() => navigate("/home")}
            />
          </div>

          <div className="mb-4">
            <Typography className="!text-xl !font-bold">
              {lessons.title}
            </Typography>
            <div className="flex justify-between mb-1 mt-2">
              <span className="text-sm font-medium">
                {lessons.remainingLessons} lessons left
              </span>
              <span className="text-sm font-medium">{lessons.progress}%</span>
            </div>
            <LinearProgress
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
            />
          </div>

          {/* Course Chapters */}
          <div className="mt-4">
            {lessons.chapters.map((chapter) => (
              <Accordion key={chapter.id} defaultExpanded={chapter.id === 1}>
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
                        {chapter.title}
                      </Typography>
                    </div>
                    <div className="flex items-center !text-gray-500 gap-3 mt-0.5">
                      <div className="flex items-center">
                        <ImportContacts className="!h-4" />
                        <Typography className="!text-sm">
                          {chapter.completedLessons}/{chapter.totalLessons}{" "}
                          lessons
                        </Typography>
                      </div>
                      <div className="flex items-center">
                        <AccessTime className="!h-4" />
                        <Typography className="!text-sm">
                          {chapter.totalDuration} mins
                        </Typography>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <ul className="pl-0">
                    {chapter.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                          currentLessonId === lesson.id
                            ? "border-[#00A86B] bg-blue-50"
                            : lesson.completed
                            ? "border-transparent"
                            : "border-transparent"
                        }`}
                        onClick={() => handleLessonClick(lesson.id)}
                      >
                        <div className="mr-2">
                          {lesson.completed ? (
                            <CheckCircleIcon
                              sx={{ color: "#00A86B", fontSize: 20 }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                              {lesson.type === "video" ? (
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
                              lesson.completed
                                ? "text-[#00A86B] !font-medium"
                                : ""
                            }`}
                          >
                            {lesson.title}
                          </Typography>
                        </div>
                        <Typography className="!text-xs !text-gray-500 border px-1.5 py-0.5 leading-4">
                          {formatTime(lesson.duration)}
                        </Typography>
                      </li>
                    ))}
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
            <button className="ml-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">
              Continue <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto flex flex-col">
          <div className="mb-6">
            {currentLesson?.type === "video" && (
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <video
                  className="w-full h-full object-contain"
                  src={currentLesson.content}
                  poster="/thumbnail.jpg"
                />

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  {/* Progress bar */}
                  <div className="relative h-1 bg-gray-500 rounded-full mb-3 cursor-pointer">
                    <div
                      className="absolute h-full bg-blue-500 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                      <IconButton
                        size="small"
                        onClick={togglePlayPause}
                        sx={{ color: "white" }}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>

                      <Typography variant="body2">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Typography>

                      <IconButton size="small" sx={{ color: "white" }}>
                        <VolumeUpIcon />
                      </IconButton>
                    </div>

                    <div className="flex items-center gap-3">
                      <IconButton size="small" sx={{ color: "white" }}>
                        <SpeedIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "white" }}>
                        <FullscreenIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentLesson?.type === "pdf" && (
              <div className="w-full aspect-video bg-white rounded-lg shadow-lg flex items-center justify-center">
                <iframe
                  src={currentLesson.content}
                  className="w-full h-full"
                  title={currentLesson.title}
                ></iframe>
              </div>
            )}

            {currentLesson?.type === "text" && (
              <Paper elevation={2} className="p-6 bg-white rounded-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                ></div>
              </Paper>
            )}
          </div>

          {/* Tab Section */}
          {currentLesson && (
            <Paper elevation={2} className="bg-white !rounded-xl">
              {/* Tab Navigation */}
              <Box
                className=""
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  padding: 2,
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  className="!min-h-fit"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Tab
                    label={
                      <div className="flex items-center">
                        <InfoIcon className="mr-2" fontSize="small" />
                        <span>Description</span>
                      </div>
                    }
                    className="!min-h-fit "
                    sx={{
                      textTransform: "none",
                      fontWeight: "600",
                      py: 1,
                      "&.Mui-selected": {
                        color: "white",
                        backgroundColor: "#f97316",
                        borderRadius: 10,
                      },
                    }}
                  />
                  <Tab
                    label={
                      <div className="flex items-center">
                        <NotesIcon className="mr-2" fontSize="small" />
                        <span>Lecture Notes</span>
                      </div>
                    }
                    className="!min-h-fit"
                    sx={{
                      textTransform: "none",
                      fontWeight: "600",
                      py: 1,
                      "&.Mui-selected": {
                        color: "white",
                        backgroundColor: "#f97316",
                        borderRadius: 10,
                      },
                    }}
                  />
                  <Tab
                    label={
                      <div className="flex items-center">
                        <AttachFileIcon className="mr-2" fontSize="small" />
                        <span>Attach File</span>
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-gray-200 text-gray-800 rounded-full">
                          1
                        </span>
                      </div>
                    }
                    className="!min-h-fit"
                    sx={{
                      textTransform: "none",
                      fontWeight: "600",
                      py: 1,
                      "&.Mui-selected": {
                        color: "white",
                        backgroundColor: "#f97316",
                        borderRadius: 10,
                      },
                    }}
                  />
                  <Tab
                    label={
                      <div className="flex items-center">
                        <CommentIcon className="mr-2" fontSize="small" />
                        <span>Comments</span>
                      </div>
                    }
                    className="!min-h-fit"
                    sx={{
                      textTransform: "none",
                      fontWeight: "600",
                      py: 1,
                      "&.Mui-selected": {
                        color: "white",
                        backgroundColor: "#f97316",
                        borderRadius: 10,
                      },
                    }}
                  />
                </Tabs>
              </Box>

              {/* Tab Content - Description */}
              <Box hidden={activeTab !== 0} className="p-6">
                <Typography variant="h6" className="font-medium mb-4">
                  Lecture Description
                </Typography>
                <Typography variant="body1" className="text-gray-700 mb-4">
                  We cover everything you need to build your first website. From
                  creating your first page through to uploading your website to
                  the internet.
                </Typography>
                <Typography variant="body1" className="text-gray-700">
                  We'll use the world's most popular (and free) web design tool
                  called Visual Studio Code, there are exercises files you can
                  download and then download so that you can compare your
                  project with mine. This will enable you to see exactly where
                  you are in the process so you can compare and then project
                  with mine. This will enable you to see if all sounds a little
                  too fancy - don't worry, this course is aimed at complete
                  beginners to web design and who have never coded before. We'll
                  start right at the beginning and work our way through step by
                  step.
                </Typography>
              </Box>

              {/* Tab Content - Notes */}
              <Box hidden={activeTab !== 1} className="p-6">
                <Typography variant="h6" className="font-medium mb-4">
                  Lecture Notes
                </Typography>
                <Typography variant="body1" className="text-gray-700 mb-4">
                  In ut aliquet ante, Curabitur mollis incidunt turpis, sed
                  aliquamauris finibus vulputate. Praesent et mi in mi maximus
                  egestas. Mauris et ipsum nisi, luctus bibendum pellentesque,
                  eu Sed ac arcu ultricies aliquet. Maecenas tristique aliquet
                  massa, varius tempus, urna ut actor mattis, urna ut actor
                  mattis, urna ut actor mattis.
                </Typography>
                <Typography variant="body1" className="text-gray-700 mb-4">
                  Nunc aliquam lectus finibus, Donec nec a orci. Aliquam
                  efficitur sem cursus elit facilisis lacinia.
                </Typography>
                <ul className="list-disc pl-6 mb-6">
                  <li className="text-gray-700 mb-2">
                    Curabitur posuere ut imperdiet tristique. Nam varius ac id
                    sodales, Donec facilisum interim mattis.
                  </li>
                  <li className="text-gray-700 mb-2">
                    Sed eleifend, libero pharetra vestibulum, nibh est. Mauris
                    vestibulum massa, est. Integer eu lectus.
                  </li>
                  <li className="text-gray-700">
                    Donec consequat lorem nec consequat. Suspendisse eu risus
                    mattis, interdum ante sed, fringilla. Praesent mattis dictum
                    sapien a lacinia. Vestibulum scelerisque magna aliquet,
                    blandit arcs, consectetur purus. Suspendisse et Ut
                    scelerisque felis, integer vulputate urna.
                  </li>
                </ul>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded flex items-center">
                  <DownloadIcon className="mr-2" fontSize="small" />
                  Download Notes
                </button>
              </Box>

              {/* Tab Content - Files */}
              <Box hidden={activeTab !== 2} className="p-6">
                <Typography variant="h6" className="font-medium mb-4">
                  Attach Files (1)
                </Typography>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 text-gray-400">
                      <DescriptionIcon />
                    </div>
                    <div>
                      <Typography className="font-medium">
                        Create account on webflow.pdf
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        12.6 MB
                      </Typography>
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded flex items-center">
                    <DownloadIcon className="mr-2" fontSize="small" />
                    Download File
                  </button>
                </div>
              </Box>

              {/* Tab Content - Comments */}
              <Box hidden={activeTab !== 3} className="p-6">
                <Typography variant="h6" className="font-medium mb-4">
                  Comments (8)
                </Typography>

                {/* Comment Form */}
                <div className="flex mb-6">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
                  <div className="flex-grow">
                    <textarea
                      className="w-full border border-gray-300 rounded p-3 mb-2"
                      placeholder="Write a comment..."
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded flex items-center">
                        <CommentIcon className="mr-2" fontSize="small" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {/* Comment 1 */}
                  <div className="flex">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center mb-1">
                        <Typography className="font-medium mr-2">
                          Ronald Richards
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          • 1 week ago
                        </Typography>
                      </div>
                      <Typography
                        variant="body1"
                        className="text-gray-700 mb-1"
                      >
                        Maecena risu s tortor, tincidun nec purus eu, gravida
                        susc ipit tortor.
                      </Typography>
                      <button className="text-blue-500 text-sm flex items-center">
                        <ReplyIcon className="mr-1" fontSize="small" />
                        REPLY
                      </button>
                    </div>
                  </div>

                  {/* Comment 2 */}
                  <div className="flex">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center mb-1">
                        <Typography className="font-medium mr-2">
                          Kristin Watson
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-blue-500 font-medium mr-2"
                        >
                          ADMIN
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          • 1 week ago
                        </Typography>
                      </div>
                      <Typography
                        variant="body1"
                        className="text-gray-700 mb-1"
                      >
                        Nulla pellentesq leo vitae lorem hendrerit, sit amet
                        elementum ipsum rutrum. Morbi uttrices volupat orci quis
                        fringilla. Suspendisse faucibus augue quis dictum
                        egestas.
                      </Typography>
                      <button className="text-blue-500 text-sm flex items-center">
                        <ReplyIcon className="mr-1" fontSize="small" />
                        REPLY
                      </button>
                    </div>
                  </div>
                </div>
              </Box>
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLessson;
