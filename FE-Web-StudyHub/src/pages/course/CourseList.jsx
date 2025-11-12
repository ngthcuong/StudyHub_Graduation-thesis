import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import {
  Search,
  School,
  Storefront,
  SentimentDissatisfied,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CourseCard from "../../components/CourseCard";
import {
  useGetMyCoursesMutation,
  useGetAllCoursesMutation,
} from "../../services/grammarLessonApi";

const EmptyState = ({ message }) => (
  <Box textAlign="center" py={10} color="text.secondary">
    <SentimentDissatisfied sx={{ fontSize: 48, mb: 2 }} />
    <Typography variant="h6">{message}</Typography>
  </Box>
);

const CourseList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const [getMyCourses] = useGetMyCoursesMutation();
  const [getAllCourses] = useGetAllCoursesMutation();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const result = await getMyCourses(user._id).unwrap();
        const ownedCourses = result.courses || [];
        setCourses(ownedCourses);

        const res = await getAllCourses().unwrap();
        const all = res || [];

        const ownedIds = new Set(ownedCourses.map((c) => c._id));
        const filtered = all.filter((course) => !ownedIds.has(course._id));
        setAllCourses(filtered);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [getMyCourses, getAllCourses, user._id]);
  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 8;
  const pageCount = Math.ceil(filteredCourses.length / pageSize);
  const myCoursesPageCount = Math.ceil(filteredMyCourses.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const paginatedMyCourses = filteredMyCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setSearchTerm("");
    setPage(1);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="bg-gray-50 py-10 px-4 md:px-10 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        <Paper elevation={2} sx={{ borderRadius: "16px", overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="course tabs"
            >
              <Tab
                label="My Courses"
                icon={<School />}
                iconPosition="start"
                id="my-courses-tab"
                aria-controls="my-courses-panel"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
              <Tab
                label="Explore the market"
                icon={<Storefront />}
                iconPosition="start"
                id="market-courses-tab"
                aria-controls="market-courses-panel"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
            </Tabs>
          </Box>

          <Fade in={tabIndex === 0} timeout={300}>
            <Box
              role="tabpanel"
              hidden={tabIndex !== 0}
              id="my-courses-panel"
              aria-labelledby="my-courses-tab"
              sx={{ p: { xs: 2, md: 4 } }}
            >
              <Box className="mb-6">
                <TextField
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {paginatedMyCourses.length > 0 ? (
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {paginatedMyCourses.map((course, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course._id}>
                      <div
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() =>
                          navigate(`/course/${course._id}/lesson/${course.id}`)
                        }
                      >
                        <CourseCard
                          course={course}
                          index={index}
                          variant="owned"
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState message="No enrolled courses found." />
              )}

              {myCoursesPageCount > 1 && (
                <Box className="flex justify-center mt-10">
                  <Pagination
                    count={myCoursesPageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                  />
                </Box>
              )}
            </Box>
          </Fade>

          <Fade in={tabIndex === 1} timeout={300}>
            <Box
              role="tabpanel"
              hidden={tabIndex !== 1}
              id="market-courses-panel"
              aria-labelledby="market-courses-tab"
              sx={{ p: { xs: 2, md: 4 } }}
            >
              <Box className="mb-6">
                <TextField
                  placeholder="Tìm kiếm khóa học trên thị trường..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Search className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {paginatedCourses.length > 0 ? (
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {paginatedCourses.map((course, index) => (
                    <Grid xs={12} sm={6} md={4} key={course._id}>
                      <div
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        <CourseCard
                          course={course}
                          index={index}
                          variant="market"
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState message="No courses found matching your search." />
              )}

              {pageCount > 1 && (
                <Box className="flex justify-center mt-10">
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                  />
                </Box>
              )}
            </Box>
          </Fade>
        </Paper>
      </Box>
    </Box>
  );
};

export default CourseList;
