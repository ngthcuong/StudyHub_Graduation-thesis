import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Paper,
  MenuItem,
  Select,
  Slider,
  Rating,
  Button,
} from "@mui/material";
import {
  Search,
  SentimentDissatisfied,
  FilterAltOutlined,
  FilterAltOffOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useGetAllCoursesMutation } from "../services/grammarLessonApi";
import Header from "../components/Header";

const EmptyState = ({ message }) => (
  <Box textAlign="center" py={10} color="text.secondary">
    <SentimentDissatisfied sx={{ fontSize: 48, mb: 2 }} />
    <Typography variant="h6">{message}</Typography>
  </Box>
);

const currentLevels = [
  { id: "lr-1-295", label: "TOEIC LR 1-295", range: "1-295" },
  { id: "lr-300-595", label: "TOEIC LR 300 - 595", range: "300-595" },
  { id: "lr-600-650", label: "TOEIC LR 600 - 650", range: "600-650" },
];

const goalLevels = [
  { id: "lr-300+", label: "TOEIC LR 300+", range: "300+" },
  { id: "lr-600+", label: "TOEIC LR 600+", range: "600+" },
  { id: "lr-800+", label: "TOEIC LR 800+", range: "800+" },
];

const allowedGoals = {
  "lr-1-295": ["lr-300+", "lr-600+", "lr-800+"],
  "lr-300-595": ["lr-600+", "lr-800+"],
  "lr-600-650": ["lr-800+"],
};

const learningPaths = [
  {
    currentLevel: "lr-1-295",
    goalLevel: "lr-300+",
    courses: [
      "TOEIC Foundation – Ngữ pháp và Từ vựng cơ bản",
      "Listening Starter – TOEIC Part 1 & 2",
      "Reading Starter – TOEIC Part 5 & 6",
      "Mini Test – TOEIC 300+ Practice",
    ],
  },
  {
    currentLevel: "lr-1-295",
    goalLevel: "lr-600+",
    courses: [
      "Grammar & Vocabulary Expansion – Trung cấp",
      "Listening Practice A – TOEIC Part 3 & 4",
      "Reading Practice A – TOEIC Part 6 & 7",
      "Mock Test – TOEIC 600+ Simulation",
    ],
  },
  {
    currentLevel: "lr-1-295",
    goalLevel: "lr-800+",
    courses: [
      "Advanced Grammar Review & Traps in TOEIC",
      "Listening Mastery – Chiến thuật nghe nâng cao",
      "Reading Mastery – Đọc hiểu & Suy luận ý chính",
      "Full Mock Test – TOEIC 800+ Challenge",
    ],
  },
  {
    currentLevel: "lr-300-595",
    goalLevel: "lr-600+",
    courses: [
      "Grammar & Vocabulary Expansion – Trung cấp",
      "Listening Practice A – TOEIC Part 3 & 4",
      "Reading Practice A – TOEIC Part 6 & 7",
      "Mock Test – TOEIC 600+ Simulation",
    ],
  },
  {
    currentLevel: "lr-300-595",
    goalLevel: "lr-800+",
    courses: [
      "Advanced Grammar Review & Traps in TOEIC",
      "Listening Mastery – Chiến thuật nghe nâng cao",
      "Reading Mastery – Đọc hiểu & Suy luận ý chính",
      "Full Mock Test – TOEIC 800+ Challenge",
    ],
  },
  {
    currentLevel: "lr-600-650",
    goalLevel: "lr-800+",
    courses: [
      "Advanced Grammar Review & Traps in TOEIC",
      "Listening Mastery – Chiến thuật nghe nâng cao",
      "Reading Mastery – Đọc hiểu & Suy luận ý chính",
      "Full Mock Test – TOEIC 800+ Challenge",
    ],
  },
];

const Courses = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrentLevel, setSelectedCurrentLevel] = useState("");
  const [selectedGoalLevel, setSelectedGoalLevel] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minDuration, setMinDuration] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [filterExpanded, setFilterExpanded] = useState(false);

  const [getAllCourses] = useGetAllCoursesMutation();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getAllCourses().unwrap();
        setAllCourses(res || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [getAllCourses]);

  const handleLevelSelect = (levelId, type) => {
    if (type === "current") {
      setSelectedCurrentLevel(levelId);
      if (
        selectedGoalLevel &&
        !allowedGoals[levelId]?.includes(selectedGoalLevel)
      ) {
        setSelectedGoalLevel("");
      }
    } else {
      if (
        selectedCurrentLevel &&
        !allowedGoals[selectedCurrentLevel]?.includes(levelId)
      ) {
        return;
      }
      setSelectedGoalLevel(levelId);
    }
  };

  const filteredCourses = useMemo(() => {
    let filtered = [...allCourses];

    // Filter by learning path
    if (selectedCurrentLevel && selectedGoalLevel) {
      const path = learningPaths.find(
        (p) =>
          p.currentLevel === selectedCurrentLevel &&
          p.goalLevel === selectedGoalLevel
      );
      if (path) {
        filtered = filtered.filter((course) =>
          path.courses.includes(course.title)
        );
      }
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < 1000000) {
      filtered = filtered.filter(
        (course) =>
          (course.cost || 0) >= priceRange[0] &&
          (course.cost || 0) <= priceRange[1]
      );
    }

    // Filter by duration
    if (minDuration > 0) {
      filtered = filtered.filter(
        (course) => (course.durationHours || 0) >= minDuration
      );
    }

    // Filter by rating (using averageRating from API)
    if (minRating > 0) {
      filtered = filtered.filter((course) => {
        const avgRating = course.averageRating || 0;
        return avgRating >= minRating;
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => (a.cost || 0) - (b.cost || 0));
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => (b.cost || 0) - (a.cost || 0));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sortBy === "newest") {
      filtered.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return filtered;
  }, [
    allCourses,
    selectedCurrentLevel,
    selectedGoalLevel,
    searchTerm,
    priceRange,
    minDuration,
    minRating,
    sortBy,
  ]);
  const pageSize = 6;
  const pageCount = Math.ceil(filteredCourses.length / pageSize);

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    selectedCurrentLevel,
    selectedGoalLevel,
    sortBy,
    priceRange,
    minDuration,
    minRating,
  ]);

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="bg-gray-50 min-h-screen">
      <Header />

      <Box className="max-w-6xl mx-auto pb-8 pt-1">
        <Paper
          elevation={2}
          sx={{ borderRadius: "16px", overflow: "hidden", p: 2.5 }}
        >
          <Typography variant="h4" className="!font-bold !mb-3 !text-gray-800">
            Explore Courses
          </Typography>

          {/* Search and Filter Bar */}
          <Box className="bg-white rounded-xl shadow p-4 mb-6">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 220 }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setFilterExpanded(!filterExpanded)}
                sx={{ textTransform: "none", fontWeight: 600, minWidth: 100 }}
                startIcon={
                  !filterExpanded ? (
                    <FilterAltOutlined />
                  ) : (
                    <FilterAltOffOutlined />
                  )
                }
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setSelectedCurrentLevel("");
                  setSelectedGoalLevel("");
                  setPriceRange([0, 1000000]);
                  setMinDuration(0);
                  setMinRating(0);
                  setSortBy("");
                  setSearchTerm("");
                }}
                sx={{ textTransform: "none", minWidth: 100 }}
              >
                Clear All
              </Button>
              <Typography
                variant="body2"
                color="#64748b"
                sx={{ minWidth: 120, textAlign: "center" }}
              >
                {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>

            {/* Filters  */}
            {filterExpanded && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{ mb: 0.5 }}
                    >
                      Current Level
                    </Typography>
                    <Select
                      value={selectedCurrentLevel}
                      onChange={(e) =>
                        handleLevelSelect(e.target.value, "current")
                      }
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      {currentLevels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{ mb: 0.5 }}
                    >
                      Goal Level
                    </Typography>
                    <Select
                      value={selectedGoalLevel}
                      onChange={(e) =>
                        handleLevelSelect(e.target.value, "goal")
                      }
                      size="small"
                      fullWidth
                      displayEmpty
                      disabled={!selectedCurrentLevel}
                    >
                      <MenuItem value="">All Goals</MenuItem>
                      {goalLevels.map((level) => {
                        const isDisabled =
                          selectedCurrentLevel &&
                          !allowedGoals[selectedCurrentLevel]?.includes(
                            level.id
                          );
                        return (
                          <MenuItem
                            key={level.id}
                            value={level.id}
                            disabled={isDisabled}
                          >
                            {level.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2.3 }}>
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{ mb: 0.5 }}
                    >
                      Sort By
                    </Typography>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="">Default</MenuItem>
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="price-asc">Price: Low to High</MenuItem>
                      <MenuItem value="price-desc">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Highest Rated</MenuItem>
                    </Select>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{ mb: 0.5 }}
                    >
                      Minimum Rating
                    </Typography>
                    <Rating
                      value={minRating}
                      onChange={(_, newValue) => setMinRating(newValue || 0)}
                      precision={0.5}
                      size="large"
                    />
                  </Grid>

                  <Grid container spacing={6} size={{ md: 12 }}>
                    <Grid size={{ md: 4 }}>
                      <Typography
                        variant="body1"
                        color="#64748b"
                        sx={{ mb: 0.5 }}
                      >
                        Price Range: {priceRange[0].toLocaleString()} VND -{" "}
                        {priceRange[1].toLocaleString()} VND
                      </Typography>
                      <Slider
                        value={priceRange}
                        onChange={(_, newValue) => setPriceRange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000000}
                        step={50000}
                        size="medium"
                        valueLabelFormat={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                      />
                    </Grid>

                    <Grid size={{ md: 4 }}>
                      <Typography
                        variant="body1"
                        color="#64748b"
                        sx={{ mb: 0.5 }}
                      >
                        Minimum Duration: {minDuration} hours
                      </Typography>
                      <Slider
                        value={minDuration}
                        onChange={(_, newValue) => setMinDuration(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        step={5}
                        size="medium"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          {/* Course Grid */}
          {paginatedCourses.length > 0 ? (
            <Grid
              container
              spacing={3}
              justifyContent="center"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {paginatedCourses.map((course, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={course._id}>
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
            <EmptyState message="No courses found matching your criteria." />
          )}

          {/* Pagination */}
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
        </Paper>
      </Box>
    </Box>
  );
};

export default Courses;
