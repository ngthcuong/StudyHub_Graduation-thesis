import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Avatar,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import {
  Search,
  School,
  AttachMoney,
  People,
  Image as ImageIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MenuBook as MenuBookIcon,
  PlayCircleOutline as VideoIcon,
  Description as DocumentIcon,
  Article as TextIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  useGetCourseStatisticsQuery,
  useGetCourseByIdMutation,
} from "../../services/courseApi";
import { useGetPaymentStatisticsQuery } from "../../services/paymentApi";
import {
  useGetLessonsByCourseIdMutation,
  useDeleteGrammarLessonMutation,
} from "../../services/grammarLessonApi";
import { useDeleteCourseMutation } from "../../services/courseApi";
import ModalCreateCourse from "../../components/ModalCreateCourse";
import { toast } from "react-toastify";

const Course = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("totalStudents");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [courseLessons, setCourseLessons] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});

  // Fetch course and payment statistics from API
  const {
    data: courseStatisticsData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch,
  } = useGetCourseStatisticsQuery();

  const { isLoading: paymentsLoading, error: paymentsError } =
    useGetPaymentStatisticsQuery();

  const [getLessonsByCourseId] = useGetLessonsByCourseIdMutation();
  const [getCourseById] = useGetCourseByIdMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [deleteLesson] = useDeleteGrammarLessonMutation();

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: null, // 'course' or 'lesson'
    id: null,
    name: null,
  });

  // Get courses data from API
  const courses = useMemo(
    () => courseStatisticsData?.data?.courses || [],
    [courseStatisticsData]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCourseTypeColor = (type) => {
    switch (type) {
      case "TOEIC":
        return "primary";
      case "IELTS":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setCourseTypeFilter("All");
    setSortBy("totalStudents");
  };

  const handleRowExpand = async (courseId) => {
    const isExpanded = expandedRows[courseId];

    if (!isExpanded && !courseLessons[courseId]) {
      // Fetch lessons if not already fetched
      try {
        const result = await getLessonsByCourseId(courseId).unwrap();
        setCourseLessons((prev) => ({
          ...prev,
          [courseId]: result.data || [],
        }));
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    }

    setExpandedRows((prev) => ({
      ...prev,
      [courseId]: !isExpanded,
    }));
  };

  const handleLessonExpand = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  // Delete handlers
  const handleOpenDeleteDialog = (type, id, name) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, type: null, id: null, name: null });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteDialog;

    try {
      if (type === "course") {
        await deleteCourse(id).unwrap();
        toast.success("Course deleted successfully!");
        refetch();
      } else if (type === "lesson") {
        await deleteLesson(id).unwrap();
        toast.success("Lesson deleted successfully!");
        // Refresh lessons for the current course
        const courseId = Object.keys(expandedRows).find(
          (cId) => expandedRows[cId]
        );
        if (courseId) {
          const response = await getLessonsByCourseId(courseId).unwrap();
          setCourseLessons((prev) => ({
            ...prev,
            [courseId]: response.data,
          }));
        }
      }
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(
        type === "course" ? "Cannot delete course!" : "Cannot delete lesson!"
      );
    }
  };

  // Filter and sort logic
  React.useEffect(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        courseTypeFilter === "All" || course.courseType === courseTypeFilter;
      return matchesSearch && matchesType;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "totalRevenue":
          return b.totalRevenue - a.totalRevenue;
        case "totalStudents":
          return b.totalStudents - a.totalStudents;
        case "cost":
          return b.cost - a.cost;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, courseTypeFilter, sortBy, courses]);

  // Show loading state
  if (coursesLoading || paymentsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading course statistics...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (coursesError || paymentsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="error">
          Error loading course statistics. Please try again.
        </Typography>
      </Box>
    );
  }

  // Calculate total stats
  const totalCourses = courseStatisticsData?.data?.totalCourses || 0;
  const totalRevenue = courseStatisticsData?.data?.totalRevenue || 0;
  const totalStudents = courseStatisticsData?.data?.totalStudents || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleCreateCourseSuccess = () => {
    // Refetch course statistics after creating a new course
    refetch();
    setSelectedCourse(null); // Reset selected course
  };

  const handleUpdateCourseSuccess = () => {
    refetch();
    setSelectedCourse(null); // Reset selected course
  };

  const handleOpenUpdateCourse = async (course) => {
    try {
      // Fetch full course data from API (course from table may be missing fields like description, category, etc.)
      const fullCourse = await getCourseById(course._id).unwrap();

      // Fetch grammar lessons for this course
      const lessonsResponse = await getLessonsByCourseId(course._id).unwrap();
      const grammarLessons = lessonsResponse.data || [];

      // Transform grammar lessons into sections format for the modal
      const sections = grammarLessons.map((lesson) => ({
        sectionName: lesson.title,
        lessons:
          lesson.parts?.map((part) => ({
            lessonName: part.title,
            contentType: part.contentType || "text",
            videoUrl: part.videoUrl || "",
            attachmentUrl: part.attachmentUrl || "",
            description: part.description || "",
            lectureNotes: part.lectureNotes || "",
          })) || [],
      }));

      // Create course object with sections using full course data
      const courseWithSections = {
        ...fullCourse,
        sections: sections,
      };

      setSelectedCourse(courseWithSections);
      setOpenCreateModal(true); // Reuse create modal in edit mode
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Cannot load course data!");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ mb: 1, fontWeight: "bold" }}
          >
            Course Management Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Manage all courses, lessons, and statistics
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateModal(true)}
          sx={{
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1565c0" },
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Create Course
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Total Courses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalCourses}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#dbeafe",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <School sx={{ color: "#1976d2", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#d1fae5",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <AttachMoney sx={{ color: "#10b981", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Total Payments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalStudents}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fef3c7",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <People sx={{ color: "#f59e0b", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              label="Search courses"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel size="small">Course Type</InputLabel>
              <Select
                value={courseTypeFilter}
                onChange={(e) => setCourseTypeFilter(e.target.value)}
                label="Course Type"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="TOEIC">TOEIC</MenuItem>
                <MenuItem value="IELTS">IELTS</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel size="small">Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="totalStudents">Students Count</MenuItem>
                <MenuItem value="totalRevenue">Revenue</MenuItem>
                <MenuItem value="title">Course Title</MenuItem>
                <MenuItem value="cost">Course Price</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearAll}
              sx={{ textTransform: "none", minWidth: 100 }}
            >
              Clear All
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto", fontWeight: 500 }}
            >
              {filteredCourses.length} of {courses.length} courses
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
          >
            Course Details ({filteredCourses.length} courses)
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell
                    sx={{ fontWeight: 600, color: "#374151", width: 50 }}
                  >
                    {/* Expand column */}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                    Course
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                    Level
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Students
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Revenue
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Created
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course, index) => (
                    <React.Fragment key={course._id || index}>
                      <TableRow
                        hover
                        sx={{
                          "&:hover": {
                            bgcolor: "#f9fafb",
                          },
                        }}
                      >
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRowExpand(course._id)}
                          >
                            {expandedRows[course._id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              sx={{ width: 40, height: 40, mr: 2 }}
                              src={course.thumbnailUrl}
                            >
                              <ImageIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: "#1f2937" }}
                              >
                                {course.title}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={course.courseType}
                            color={getCourseTypeColor(course.courseType)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#374151" }}>
                          {course.courseLevel}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "#374151", fontWeight: 500 }}
                        >
                          {formatCurrency(course.cost)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1f2937" }}
                          >
                            {course.totalStudents}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#10b981" }}
                          >
                            {formatCurrency(course.totalRevenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#6b7280" }}>
                          {new Date(course.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                sx={{ color: "#667eea" }}
                                onClick={() => {
                                  handleOpenUpdateCourse(course);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                sx={{ color: "#ef4444" }}
                                onClick={() =>
                                  handleOpenDeleteDialog(
                                    "course",
                                    course._id,
                                    course.title
                                  )
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row - Grammar Lessons */}
                      <TableRow>
                        <TableCell colSpan={9} sx={{ p: 0, border: "none" }}>
                          <Collapse
                            in={expandedRows[course._id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                px: 2,
                                py: 1.5,
                                bgcolor: "#f9fafb",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                  gap: 1,
                                }}
                              >
                                <MenuBookIcon sx={{ color: "#667eea" }} />
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600, color: "#1f2937" }}
                                >
                                  Grammar Lessons
                                </Typography>
                              </Box>

                              {courseLessons[course._id] ? (
                                courseLessons[course._id].length > 0 ? (
                                  <List
                                    sx={{ bgcolor: "white", borderRadius: 2 }}
                                  >
                                    {courseLessons[course._id].map(
                                      (lesson, lessonIndex) => (
                                        <Box key={lesson._id}>
                                          <ListItem
                                            sx={{
                                              borderBottom:
                                                lessonIndex <
                                                courseLessons[course._id]
                                                  .length -
                                                  1
                                                  ? "1px solid #e5e7eb"
                                                  : "none",
                                              flexDirection: "column",
                                              alignItems: "stretch",
                                              p: 0,
                                            }}
                                          >
                                            <ListItemButton
                                              onClick={() =>
                                                handleLessonExpand(lesson._id)
                                              }
                                              sx={{
                                                py: 1,
                                                px: 2,
                                                "&:hover": {
                                                  bgcolor: "#f9fafb",
                                                },
                                              }}
                                            >
                                              <ListItemText
                                                primary={
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: 600 }}
                                                      >
                                                        {lesson.title}
                                                      </Typography>

                                                      <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                      >
                                                        Parts:{" "}
                                                        {lesson.parts?.length ||
                                                          0}
                                                      </Typography>
                                                    </Box>

                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: 0.5,
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      {/* <Tooltip title="Edit">
                                                        <IconButton
                                                          size="small"
                                                          sx={{
                                                            color: "#667eea",
                                                          }}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenUpdateLesson(
                                                              lesson
                                                            );
                                                          }}
                                                        >
                                                          <EditIcon fontSize="small" />
                                                        </IconButton>
                                                      </Tooltip> */}
                                                      <Tooltip title="Delete">
                                                        <IconButton
                                                          size="small"
                                                          sx={{
                                                            color: "#ef4444",
                                                          }}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDeleteDialog(
                                                              "lesson",
                                                              lesson._id,
                                                              lesson.title
                                                            );
                                                          }}
                                                        >
                                                          <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                      </Tooltip>
                                                      <IconButton size="small">
                                                        {expandedLessons[
                                                          lesson._id
                                                        ] ? (
                                                          <ExpandLessIcon />
                                                        ) : (
                                                          <ExpandMoreIcon />
                                                        )}
                                                      </IconButton>
                                                    </Box>
                                                  </Box>
                                                }
                                                // secondary={
                                                //   <Box sx={{ mt: 0.5 }}>
                                                //     <Typography
                                                //       variant="body2"
                                                //       color="text.secondary"
                                                //     >
                                                //       Parts:{" "}
                                                //       {lesson.parts?.length ||
                                                //         0}
                                                //     </Typography>
                                                //     {/* <Typography
                                                //       variant="caption"
                                                //       color="text.secondary"
                                                //     >
                                                //       Created:{" "}
                                                //       {new Date(
                                                //         lesson.createdAt
                                                //       ).toLocaleDateString()}
                                                //     </Typography> */}
                                                //   </Box>
                                                // }
                                              />
                                            </ListItemButton>

                                            {/* Parts List */}
                                            <Collapse
                                              in={expandedLessons[lesson._id]}
                                              timeout="auto"
                                              unmountOnExit
                                            >
                                              <Box
                                                sx={{
                                                  bgcolor: "#fafbfc",
                                                  px: 2,
                                                  py: 1,
                                                }}
                                              >
                                                {lesson.parts &&
                                                lesson.parts.length > 0 ? (
                                                  <List
                                                    sx={{
                                                      bgcolor: "white",
                                                      borderRadius: 2,
                                                      border:
                                                        "1px solid #e5e7eb",
                                                    }}
                                                  >
                                                    {lesson.parts.map(
                                                      (part, partIndex) => (
                                                        <ListItem
                                                          key={
                                                            part._id ||
                                                            partIndex
                                                          }
                                                          sx={{
                                                            borderBottom:
                                                              partIndex <
                                                              lesson.parts
                                                                .length -
                                                                1
                                                                ? "1px solid #f3f4f6"
                                                                : "none",
                                                            flexDirection:
                                                              "column",
                                                            alignItems:
                                                              "flex-start",
                                                            py: 1,
                                                            px: 2,
                                                          }}
                                                        >
                                                          <Box
                                                            sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                              gap: 1,
                                                              mb: 0.5,
                                                              width: "100%",
                                                            }}
                                                          >
                                                            {/* Content Type Icon */}
                                                            {part.contentType ===
                                                            "video" ? (
                                                              <VideoIcon
                                                                sx={{
                                                                  color:
                                                                    "#667eea",
                                                                  fontSize: 20,
                                                                }}
                                                              />
                                                            ) : part.contentType ===
                                                              "document" ? (
                                                              <DocumentIcon
                                                                sx={{
                                                                  color:
                                                                    "#10b981",
                                                                  fontSize: 20,
                                                                }}
                                                              />
                                                            ) : (
                                                              <TextIcon
                                                                sx={{
                                                                  color:
                                                                    "#f59e0b",
                                                                  fontSize: 20,
                                                                }}
                                                              />
                                                            )}

                                                            <Typography
                                                              variant="body1"
                                                              sx={{
                                                                fontWeight: 600,
                                                                flex: 1,
                                                              }}
                                                            >
                                                              {part.title}
                                                            </Typography>

                                                            <Chip
                                                              label={
                                                                part.contentType ||
                                                                "text"
                                                              }
                                                              size="small"
                                                              sx={{
                                                                bgcolor:
                                                                  part.contentType ===
                                                                  "video"
                                                                    ? "#e9ecfe"
                                                                    : part.contentType ===
                                                                      "document"
                                                                    ? "#d1fae5"
                                                                    : "#fef3c7",
                                                                color:
                                                                  part.contentType ===
                                                                  "video"
                                                                    ? "#667eea"
                                                                    : part.contentType ===
                                                                      "document"
                                                                    ? "#10b981"
                                                                    : "#f59e0b",
                                                                fontWeight: 500,
                                                                textTransform:
                                                                  "capitalize",
                                                              }}
                                                            />
                                                          </Box>

                                                          {part.description && (
                                                            <Typography
                                                              variant="body2"
                                                              color="text.secondary"
                                                              sx={{ mb: 0.5 }}
                                                            >
                                                              {part.description}
                                                            </Typography>
                                                          )}

                                                          {part.videoUrl && (
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                gap: 0.5,
                                                                mt: 0.5,
                                                              }}
                                                            >
                                                              <VideoIcon
                                                                sx={{
                                                                  fontSize: 16,
                                                                  color:
                                                                    "#667eea",
                                                                }}
                                                              />
                                                              <Typography
                                                                variant="caption"
                                                                sx={{
                                                                  color:
                                                                    "#667eea",
                                                                  wordBreak:
                                                                    "break-all",
                                                                }}
                                                              >
                                                                {part.videoUrl}
                                                              </Typography>
                                                            </Box>
                                                          )}

                                                          {part.attachmentUrl && (
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                gap: 1,
                                                                mt: 0.5,
                                                              }}
                                                            >
                                                              <DocumentIcon
                                                                sx={{
                                                                  fontSize: 16,
                                                                  color:
                                                                    "#10b981",
                                                                }}
                                                              />
                                                              <Typography
                                                                variant="caption"
                                                                sx={{
                                                                  color:
                                                                    "#10b981",
                                                                  wordBreak:
                                                                    "break-all",
                                                                }}
                                                              >
                                                                {
                                                                  part.attachmentUrl
                                                                }
                                                              </Typography>
                                                            </Box>
                                                          )}
                                                        </ListItem>
                                                      )
                                                    )}
                                                  </List>
                                                ) : (
                                                  <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                      textAlign: "center",
                                                      py: 2,
                                                    }}
                                                  >
                                                    No parts available
                                                  </Typography>
                                                )}
                                              </Box>
                                            </Collapse>
                                          </ListItem>
                                          {lessonIndex <
                                            courseLessons[course._id].length -
                                              1 && <Divider />}
                                        </Box>
                                      )
                                    )}
                                  </List>
                                ) : (
                                  <Paper
                                    sx={{
                                      p: 3,
                                      textAlign: "center",
                                      bgcolor: "white",
                                    }}
                                  >
                                    <Typography color="text.secondary">
                                      No grammar lessons found for this course
                                    </Typography>
                                  </Paper>
                                )
                              ) : (
                                <Box sx={{ textAlign: "center", p: 2 }}>
                                  <CircularProgress size={24} />
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredCourses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* Create/Update Course Modal - Reused for both create and update */}
      <ModalCreateCourse
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setSelectedCourse(null); // Reset selected course on close
        }}
        onSuccess={
          selectedCourse ? handleUpdateCourseSuccess : handleCreateCourseSuccess
        }
        course={selectedCourse} // Pass course for edit mode, null for create mode
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#1f2937" }}>
          Confirm Delete {deleteDialog.type === "course" ? "Course" : "Lesson"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            {deleteDialog.type === "course" ? "course" : "lesson"}{" "}
            <strong>{deleteDialog.name}</strong>?
            {deleteDialog.type === "course" && (
              <Typography
                component="span"
                sx={{ display: "block", mt: 1, color: "#ef4444" }}
              >
                This action will delete all related lessons and cannot be
                undone!
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: "#6b7280" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Course;
